package com.procarro.service;

import com.procarro.dto.PecaCreateDTO;
import com.procarro.dto.PecaDTO;
import com.procarro.model.Peca;
import com.procarro.repository.PecaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PecaService {

    @Autowired
    private PecaRepository pecaRepository;

    public List<PecaDTO> listarTodas() {
        return pecaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PecaDTO buscarPorId(Integer id) {
        return pecaRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Peça não encontrada com ID: " + id));
    }

    public PecaDTO salvar(PecaCreateDTO dto) {
        Peca peca = fromDTO(dto);
        return toDTO(pecaRepository.save(peca));
    }

    public PecaDTO atualizar(Integer id, PecaCreateDTO dto) {
        Peca pecaExistente = pecaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça não encontrada com ID: " + id));

        pecaExistente.setNome(dto.getNome());
        pecaExistente.setMontadora(dto.getMontadora());
        pecaExistente.setModelo(dto.getModelo());
        pecaExistente.setAno(dto.getAno());
        pecaExistente.setDescricao(dto.getDescricao());
        pecaExistente.setPreco(dto.getPreco());

        return toDTO(pecaRepository.save(pecaExistente));
    }

    public void deletar(Integer id) {
        if (!pecaRepository.existsById(id)) {
            throw new RuntimeException("Peça não encontrada para exclusão com ID: " + id);
        }
        pecaRepository.deleteById(id);
    }

    private PecaDTO toDTO(Peca peca) {
        return new PecaDTO(
                peca.getCodPeca(),
                peca.getNome(),
                peca.getMontadora(),
                peca.getModelo(),
                peca.getAno(),
                peca.getDescricao(),
                peca.getPreco()
        );
    }

    private Peca fromDTO(PecaCreateDTO dto) {
        Peca peca = new Peca();
        peca.setNome(dto.getNome());
        peca.setMontadora(dto.getMontadora());
        peca.setModelo(dto.getModelo());
        peca.setAno(dto.getAno());
        peca.setDescricao(dto.getDescricao());
        peca.setPreco(dto.getPreco());
        return peca;
    }
}
