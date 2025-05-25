package com.procarro.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrcamentoDTO {

    private Integer idOrcamento;
    private String cpfCliente;
    private String nomeCliente;
    private LocalDateTime dataOrcamento;
    private BigDecimal valorTotal;
    private String observacoes;
    private List<ItemOrcamentoDTO> itens;
}
