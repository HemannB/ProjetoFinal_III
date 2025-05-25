package com.procarro.dto;

import lombok.Data;

@Data
public class ClienteResponseDTO {
    private String cpf;
    private String nome;
    private String sobrenome;
    private String telefone;
    private String email;
    private String endereco_completo;
}
