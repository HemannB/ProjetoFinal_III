package com.procarro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteRequestDTO {
    @NotBlank
    private String cpf;
    @NotBlank
    private String nome;
    @NotBlank
    private String sobrenome;
    @NotBlank
    private String telefone;
    @NotBlank
    private String email;
    @NotBlank
    private String endereco_completo;
}
