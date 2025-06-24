package com.procarro.controller;

import com.procarro.dto.ItemOrcamentoCreateDTO;
import com.procarro.dto.OrcamentoCreateDTO;
import com.procarro.dto.OrcamentoDTO;
import com.procarro.service.OrcamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/orcamentos")
public class OrcamentoController {

    private final OrcamentoService orcamentoService;

    @Autowired
    public OrcamentoController(OrcamentoService orcamentoService) {
        this.orcamentoService = orcamentoService;
    }

    @GetMapping
    public ResponseEntity<List<OrcamentoDTO>> listarTodos() {
        List<OrcamentoDTO> orcamentos = orcamentoService.listarTodos();
        return ResponseEntity.ok(orcamentos);
    }

    @PostMapping
    public ResponseEntity<?> criarOrcamento(@RequestBody OrcamentoCreateDTO dto) {
        // Validação manual
        if (dto.getCpfCliente() == null || dto.getCpfCliente().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("CPF do cliente é obrigatório");
        }

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            return ResponseEntity.badRequest().body("Orçamento deve conter pelo menos um item");
        }

        try {
            OrcamentoDTO orcamentoCriado = orcamentoService.criarOrcamento(dto);
            return ResponseEntity.ok(orcamentoCriado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao processar orçamento");
        }
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<OrcamentoDTO> aprovarOrcamento(@PathVariable Integer id) {
        OrcamentoDTO orcamentoAprovado = orcamentoService.aprovarOrcamento(id);
        return ResponseEntity.ok(orcamentoAprovado);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarOrcamento(@PathVariable Integer id) {
        orcamentoService.cancelarOrcamento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrcamentoDTO> buscarPorId(@PathVariable Integer id) {
        OrcamentoDTO orcamento = orcamentoService.buscarPorId(id);
        return ResponseEntity.ok(orcamento);
    }

    @PostMapping("/{id}/itens")
    public ResponseEntity<Void> adicionarItem(
            @PathVariable Integer id,
            @RequestBody ItemOrcamentoCreateDTO itemDTO) {
        orcamentoService.adicionarItem(id, itemDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}