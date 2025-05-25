package com.procarro.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrcamentoCreateDTO {

    private Integer codPeca;
    private Integer quantidade;
    private BigDecimal precoUnitario;
}
