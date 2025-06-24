package com.procarro.service;

import com.procarro.dto.*;
import com.procarro.model.*;
import com.procarro.repository.*;
import com.procarro.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrcamentoService {

    private final OrcamentoRepository orcamentoRepository;
    private final ClienteRepository clienteRepository;
    private final PecaRepository pecaRepository;
    private final EstoqueRepository estoqueRepository;
    private final ItemOrcamentoRepository itemOrcamentoRepository;

    @Autowired
    public OrcamentoService(OrcamentoRepository orcamentoRepository,
                            ClienteRepository clienteRepository,
                            PecaRepository pecaRepository,
                            EstoqueRepository estoqueRepository,
                            ItemOrcamentoRepository itemOrcamentoRepository) {
        this.orcamentoRepository = orcamentoRepository;
        this.clienteRepository = clienteRepository;
        this.pecaRepository = pecaRepository;
        this.estoqueRepository = estoqueRepository;
        this.itemOrcamentoRepository = itemOrcamentoRepository;
    }

    @Transactional(readOnly = true)
    public List<OrcamentoDTO> listarTodos() {
        return orcamentoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrcamentoDTO criarOrcamento(OrcamentoCreateDTO dto) {
        // Validação manual completa
        if (dto.getCpfCliente() == null || dto.getCpfCliente().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF do cliente é obrigatório");
        }

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new IllegalArgumentException("Orçamento deve conter pelo menos um item");
        }

        if (dto.getStatus() == null || !List.of("PENDENTE", "APROVADO", "CANCELADO").contains(dto.getStatus())) {
            throw new IllegalArgumentException("Status do orçamento inválido");
        }

        // Validação dos itens
        for (ItemOrcamentoCreateDTO item : dto.getItens()) {
            if (item.getCodPeca() == null || item.getCodPeca() <= 0) {
                throw new IllegalArgumentException("Código da peça inválido");
            }
            if (item.getQuantidade() == null || item.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Quantidade deve ser maior que zero");
            }
            if (item.getPrecoUnitario() == null || item.getPrecoUnitario().compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Preço unitário deve ser positivo");
            }
        }

        // Busca o cliente
        Cliente cliente = clienteRepository.findById(dto.getCpfCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado: " + dto.getCpfCliente()));

        // Construção do orçamento
        Orcamento orcamento = new Orcamento();
        orcamento.setCliente(cliente);
        orcamento.setObservacoes(dto.getObservacoes());
        orcamento.setStatus(dto.getStatus());
        orcamento.setDataOrcamento(LocalDateTime.now());

        // Processamento dos itens
        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemOrcamento> itens = new ArrayList<>();

        for (ItemOrcamentoCreateDTO itemDTO : dto.getItens()) {
            Peca peca = pecaRepository.findById(itemDTO.getCodPeca())
                    .orElseThrow(() -> new ResourceNotFoundException("Peça não encontrada: " + itemDTO.getCodPeca()));

            ItemOrcamento item = new ItemOrcamento();
            item.setPeca(peca);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(itemDTO.getPrecoUnitario());
            item.setPrecisaComprar(false);
            item.setOrcamento(orcamento);

            BigDecimal subtotal = itemDTO.getPrecoUnitario()
                    .multiply(BigDecimal.valueOf(itemDTO.getQuantidade()));
            valorTotal = valorTotal.add(subtotal);

            itens.add(item);
        }

        orcamento.setItens(itens);
        orcamento.setValorTotal(valorTotal);

        // Persistência
        Orcamento orcamentoSalvo = orcamentoRepository.save(orcamento);
        return toDTO(orcamentoSalvo);
    }

    @Transactional
    public OrcamentoDTO aprovarOrcamento(Integer id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento não encontrado com ID: " + id));

        validarStatusOrcamento(orcamento, "PENDENTE");

        boolean precisaComprar = processarEstoque(orcamento);
        atualizarStatusOrcamento(orcamento, precisaComprar ? "PARCIAL" : "APROVADO");

        return toDTO(orcamentoRepository.save(orcamento));
    }

    @Transactional
    public void cancelarOrcamento(Integer id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento não encontrado com ID: " + id));

        orcamento.setStatus("CANCELADO");
        orcamentoRepository.save(orcamento);
    }

    // Métodos auxiliares privados
    private void validarOrcamento(OrcamentoCreateDTO dto) {
        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new BusinessException("Orçamento deve conter pelo menos um item");
        }
    }

    private Orcamento construirOrcamentoBase(OrcamentoCreateDTO dto, Cliente cliente) {
        Orcamento orcamento = new Orcamento();
        orcamento.setCliente(cliente);
        orcamento.setObservacoes(dto.getObservacoes());
        orcamento.setStatus("PENDENTE");
        orcamento.setDataOrcamento(LocalDateTime.now());
        return orcamento;
    }

    private void processarItens(OrcamentoCreateDTO dto, Orcamento orcamento) {
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemOrcamentoCreateDTO itemDTO : dto.getItens()) {
            Peca peca = pecaRepository.findById(itemDTO.getCodPeca())
                    .orElseThrow(() -> new ResourceNotFoundException("Peça não encontrada com código: " + itemDTO.getCodPeca()));

            ItemOrcamento item = new ItemOrcamento();
            item.setPeca(peca);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(itemDTO.getPrecoUnitario());
            item.setPrecisaComprar(false);
            item.setOrcamento(orcamento);

            itemOrcamentoRepository.save(item);

            valorTotal = valorTotal.add(item.getPrecoUnitario()
                    .multiply(BigDecimal.valueOf(item.getQuantidade())));
        }

        orcamento.setValorTotal(valorTotal);
    }

    private boolean processarEstoque(Orcamento orcamento) {
        boolean precisaComprar = false;

        for (ItemOrcamento item : orcamento.getItens()) {
            Estoque estoque = estoqueRepository.findByPeca(item.getPeca())
                    .orElseThrow(() -> new ResourceNotFoundException("Estoque não encontrado para a peça: " + item.getPeca().getNome()));

            if (estoque.getQuantidade() >= item.getQuantidade()) {
                estoque.setQuantidade(estoque.getQuantidade() - item.getQuantidade());
                estoqueRepository.save(estoque);
            } else {
                item.setPrecisaComprar(true);
                itemOrcamentoRepository.save(item);
                precisaComprar = true;
            }
        }

        return precisaComprar;
    }

    private void validarStatusOrcamento(Orcamento orcamento, String statusEsperado) {
        if (!statusEsperado.equals(orcamento.getStatus())) {
            throw new BusinessException("Orçamento não está no status " + statusEsperado);
        }
    }

    private void atualizarStatusOrcamento(Orcamento orcamento, String novoStatus) {
        orcamento.setStatus(novoStatus);
    }

    private OrcamentoDTO toDTO(Orcamento orcamento) {
        OrcamentoDTO dto = new OrcamentoDTO();
        dto.setIdOrcamento(orcamento.getIdOrcamento());
        dto.setCpfCliente(orcamento.getCliente().getCpf());
        dto.setNomeCliente(orcamento.getCliente().getNome() + " " + orcamento.getCliente().getSobrenome());
        dto.setDataOrcamento(orcamento.getDataOrcamento());
        dto.setValorTotal(orcamento.getValorTotal());
        dto.setObservacoes(orcamento.getObservacoes());
        dto.setStatus(orcamento.getStatus());

        List<ItemOrcamentoDTO> itensDTO = orcamento.getItens().stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        dto.setItens(itensDTO);
        return dto;
    }

    private ItemOrcamentoDTO toItemDTO(ItemOrcamento item) {
        ItemOrcamentoDTO itemDTO = new ItemOrcamentoDTO();
        itemDTO.setCodPeca(item.getPeca().getCodPeca());
        itemDTO.setNomePeca(item.getPeca().getNome());
        itemDTO.setQuantidade(item.getQuantidade());
        itemDTO.setPrecoUnitario(item.getPrecoUnitario());
        itemDTO.setPrecisaComprar(item.isPrecisaComprar());
        itemDTO.setSubtotal(item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())));
        return itemDTO;
    }

    public OrcamentoDTO buscarPorId(Integer id) {
        Orcamento orcamento = orcamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento não encontrado"));
        return toDTO(orcamento);
    }

    public void adicionarItem(Integer idOrcamento, ItemOrcamentoCreateDTO itemDTO) {
        Orcamento orcamento = orcamentoRepository.findById(idOrcamento)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento não encontrado"));

        Peca peca = pecaRepository.findById(itemDTO.getCodPeca())
                .orElseThrow(() -> new ResourceNotFoundException("Peça não encontrada"));

        ItemOrcamento item = new ItemOrcamento();
        // ... configuração do item
        item.setOrcamento(orcamento);

        itemOrcamentoRepository.save(item);
    }
}