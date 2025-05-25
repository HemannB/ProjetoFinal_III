package com.procarro.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrcamentoCreateDTO {

    private String cpfCliente;
    private BigDecimal valorTotal;
    private String observacoes;
    private List<ItemOrcamentoCreateDTO> itens;
}
