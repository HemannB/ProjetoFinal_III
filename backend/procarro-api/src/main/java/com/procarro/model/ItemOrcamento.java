package com.procarro.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "item_orcamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Integer idItem;

    @ManyToOne
    @JoinColumn(name = "orcamento_id", nullable = false)
    @JsonBackReference
    private Orcamento orcamento;

    @ManyToOne
    @JoinColumn(name = "cod_peca", nullable = false)
    private Peca peca;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "preco_unitario", nullable = false)
    private BigDecimal precoUnitario;

    @Column(name = "precisa_comprar", nullable = false)
    private boolean precisaComprar;

    @Transient
    public BigDecimal getSubtotal() {
        if (precoUnitario != null && quantidade != null) {
            return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
        return BigDecimal.ZERO;
    }
}
