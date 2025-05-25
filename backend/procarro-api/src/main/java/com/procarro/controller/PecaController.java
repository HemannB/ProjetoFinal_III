package com.procarro.controller;

import com.procarro.dto.PecaCreateDTO;
import com.procarro.dto.PecaDTO;
import com.procarro.service.PecaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pecas")
public class PecaController {
    @Autowired
    private PecaService pecaService;
    /**
     * Retorna todas as peças cadastradas.
     */
    @GetMapping
    public List<PecaDTO> listarTodas() {
        return pecaService.listarTodas();
    }
    /**
     * Retorna uma peça específica por ID.
     */
    @GetMapping("/{id}")
    public PecaDTO buscarPorId(@PathVariable Integer id) {
        return pecaService.buscarPorId(id);
    }
    /**
     * Salva uma nova peça.
     */
    @PostMapping
    public PecaDTO salvar(@Valid @RequestBody PecaCreateDTO dto) {
        return pecaService.salvar(dto);
    }
    /**
     * Atualiza uma peça existente.
     */
    @PutMapping("/{id}")
    public PecaDTO atualizar(@PathVariable Integer id, @Valid @RequestBody PecaCreateDTO dto) {
        return pecaService.atualizar(id, dto);
    }
    /**
     * Remove uma peça por ID.
     */
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        pecaService.deletar(id);
    }
}
