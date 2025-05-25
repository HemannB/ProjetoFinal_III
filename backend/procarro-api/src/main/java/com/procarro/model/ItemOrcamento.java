package com.procarro.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer idItem;

    @ManyToOne
    @JoinColumn(name = "id_orcamento")
    private Orcamento orcamento;

    @ManyToOne
    @JoinColumn(name = "cod_peca")
    private Peca peca;

    private Integer quantidade;

    @Column(name = "preco_unitario")
    private BigDecimal precoUnitario;
}
