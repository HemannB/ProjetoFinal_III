package com.procarro.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstoqueDTO {

    private Integer idEstoque;
    private Integer codPeca;
    private String nomePeca;
    private Integer quantidade;
}
