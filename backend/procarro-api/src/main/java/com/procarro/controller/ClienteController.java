package com.procarro.controller;

import com.procarro.dto.ClienteRequestDTO;
import com.procarro.dto.ClienteResponseDTO;
import com.procarro.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ClienteResponseDTO criar(@RequestBody @Valid ClienteRequestDTO dto) {
        return clienteService.salvar(dto);
    }

    @GetMapping
    public List<ClienteResponseDTO> listar() {
        return clienteService.listarTodos();
    }

    @GetMapping("/{cpf}")
    public ClienteResponseDTO buscar(@PathVariable String cpf) {
        return clienteService.buscarPorCpf(cpf);
    }

    @PutMapping("/{cpf}")
    public ClienteResponseDTO atualizar(@PathVariable String cpf, @RequestBody @Valid ClienteRequestDTO dto) {
        return clienteService.atualizar(cpf, dto);
    }

    @DeleteMapping("/{cpf}")
    public void deletar(@PathVariable String cpf) {
        clienteService.deletar(cpf);
    }
}
