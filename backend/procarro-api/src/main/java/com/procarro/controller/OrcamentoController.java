package com.procarro.controller;

import com.procarro.dto.OrcamentoCreateDTO;
import com.procarro.dto.OrcamentoDTO;
import com.procarro.service.OrcamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orcamentos")
public class OrcamentoController {

    @Autowired
    private OrcamentoService orcamentoService;

    @GetMapping
    public List<OrcamentoDTO> listarTodos() {
        return orcamentoService.listarTodos();
    }

    @PostMapping
    public OrcamentoDTO salvar(@RequestBody OrcamentoCreateDTO dto) {
        return orcamentoService.salvar(dto);
    }
}
