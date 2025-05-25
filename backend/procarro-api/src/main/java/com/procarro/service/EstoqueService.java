package com.procarro.service;

import com.procarro.dto.EstoqueCreateDTO;
import com.procarro.dto.EstoqueDTO;
import com.procarro.model.Estoque;
import com.procarro.model.Peca;
import com.procarro.repository.EstoqueRepository;
import com.procarro.repository.PecaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstoqueService {

    @Autowired
    private EstoqueRepository estoqueRepository;

    @Autowired
    private PecaRepository pecaRepository;

    public List<EstoqueDTO> listarTodos() {
        return estoqueRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EstoqueDTO buscarPorId(Integer id) {
        Estoque estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estoque com ID " + id + " não encontrado."));
        return toDTO(estoque);
    }

    @Transactional
    public EstoqueDTO salvar(EstoqueCreateDTO dto) {
        Peca peca = pecaRepository.findById(dto.getCodPeca())
                .orElseThrow(() -> new EntityNotFoundException("Peça com código " + dto.getCodPeca() + " não encontrada."));

        Estoque estoque = new Estoque();
        estoque.setPeca(peca);
        estoque.setQuantidade(dto.getQuantidade());

        return toDTO(estoqueRepository.save(estoque));
    }

    @Transactional
    public EstoqueDTO atualizar(Integer id, EstoqueCreateDTO dto) {
        Estoque estoque = estoqueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estoque com ID " + id + " não encontrado."));

        Peca peca = pecaRepository.findById(dto.getCodPeca())
                .orElseThrow(() -> new EntityNotFoundException("Peça com código " + dto.getCodPeca() + " não encontrada."));

        estoque.setPeca(peca);
        estoque.setQuantidade(dto.getQuantidade());

        return toDTO(estoqueRepository.save(estoque));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!estoqueRepository.existsById(id)) {
            throw new EntityNotFoundException("Estoque com ID " + id + " não encontrado.");
        }
        estoqueRepository.deleteById(id);
    }

    private EstoqueDTO toDTO(Estoque estoque) {
        return new EstoqueDTO(
                estoque.getIdEstoque(),
                estoque.getPeca().getCodPeca(),
                estoque.getPeca().getNome(),
                estoque.getQuantidade()
        );
    }
}
