package com.procarro.service;

import com.procarro.dto.ClienteRequestDTO;
import com.procarro.dto.ClienteResponseDTO;
import com.procarro.model.Cliente;
import com.procarro.repository.ClienteRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ModelMapper mapper;
    public ClienteResponseDTO salvar(ClienteRequestDTO dto) {
        Cliente cliente = mapper.map(dto, Cliente.class);
        return mapper.map(clienteRepository.save(cliente), ClienteResponseDTO.class);
    }

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(cliente -> mapper.map(cliente, ClienteResponseDTO.class))
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarPorCpf(String cpf) {
        Cliente cliente = clienteRepository.findById(cpf).orElseThrow();
        return mapper.map(cliente, ClienteResponseDTO.class);
    }

    public ClienteResponseDTO atualizar(String cpf, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(cpf).orElseThrow();
        mapper.map(dto, cliente);
        return mapper.map(clienteRepository.save(cliente), ClienteResponseDTO.class);
    }

    public void deletar(String cpf) {
        clienteRepository.deleteById(cpf);
    }
}
