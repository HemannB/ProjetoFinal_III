package com.procarro.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrcamentoDTO {

    private String nomePeca;
    private Integer quantidade;
    private BigDecimal precoUnitario;
}
