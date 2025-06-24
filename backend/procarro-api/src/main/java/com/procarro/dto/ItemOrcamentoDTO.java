package com.procarro.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrcamentoDTO {

    private Integer codPeca;
    private String nomePeca;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private boolean precisaComprar;
    private BigDecimal subtotal;

    public BigDecimal getSubtotal() {
        if (precoUnitario != null && quantidade != null) {
            return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
        return BigDecimal.ZERO;
    }
}
