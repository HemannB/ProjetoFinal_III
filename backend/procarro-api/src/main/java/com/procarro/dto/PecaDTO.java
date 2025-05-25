package com.procarro.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PecaDTO {
    private Integer codPeca;
    private String nome;
    private String montadora;
    private String modelo;
    private Integer ano;
    private String descricao;
    private Double preco;
}
