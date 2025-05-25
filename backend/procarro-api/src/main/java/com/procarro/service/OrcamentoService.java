package com.procarro.service;

import com.procarro.dto.*;
import com.procarro.model.*;
import com.procarro.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrcamentoService {

    @Autowired
    private OrcamentoRepository orcamentoRepository;

    @Autowired
    private ItemOrcamentoRepository itemOrcamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PecaRepository pecaRepository;

    public List<OrcamentoDTO> listarTodos() {
        return orcamentoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrcamentoDTO salvar(OrcamentoCreateDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getCpfCliente()).orElseThrow();

        Orcamento orcamento = new Orcamento();
        orcamento.setCliente(cliente);
        orcamento.setValorTotal(dto.getValorTotal());
        orcamento.setObservacoes(dto.getObservacoes());

        List<ItemOrcamento> itens = new ArrayList<>();
        for (ItemOrcamentoCreateDTO itemDTO : dto.getItens()) {
            Peca peca = pecaRepository.findById(itemDTO.getCodPeca()).orElseThrow();
            ItemOrcamento item = new ItemOrcamento();
            item.setPeca(peca);
            item.setQuantidade(itemDTO.getQuantidade());
            item.setPrecoUnitario(itemDTO.getPrecoUnitario());
            item.setOrcamento(orcamento);
            itens.add(item);
        }

        orcamento.setItens(itens);
        Orcamento salvo = orcamentoRepository.save(orcamento);
        return toDTO(salvo);
    }

    private OrcamentoDTO toDTO(Orcamento o) {
        return new OrcamentoDTO(
                o.getIdOrcamento(),
                o.getCliente().getCpf(),
                o.getCliente().getNome(),
                o.getDataOrcamento(),
                o.getValorTotal(),
                o.getObservacoes(),
                o.getItens().stream().map(item -> new ItemOrcamentoDTO(
                        item.getPeca().getNome(),
                        item.getQuantidade(),
                        item.getPrecoUnitario()
                )).collect(Collectors.toList())
        );
    }
}
