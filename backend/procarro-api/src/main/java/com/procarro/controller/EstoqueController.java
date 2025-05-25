package com.procarro.controller;

import com.procarro.dto.EstoqueCreateDTO;
import com.procarro.dto.EstoqueDTO;
import com.procarro.service.EstoqueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estoque")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @GetMapping
    public List<EstoqueDTO> listarTodos() {
        return estoqueService.listarTodos();
    }

    @GetMapping("/{id}")
    public EstoqueDTO buscarPorId(@PathVariable Integer id) {
        return estoqueService.buscarPorId(id);
    }

    @PostMapping
    public EstoqueDTO salvar(@RequestBody @Valid EstoqueCreateDTO dto) {
        return estoqueService.salvar(dto);
    }

    @PutMapping("/{id}")
    public EstoqueDTO atualizar(@PathVariable Integer id, @RequestBody @Valid EstoqueCreateDTO dto) {
        return estoqueService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Integer id) {
        estoqueService.deletar(id);
    }
}
