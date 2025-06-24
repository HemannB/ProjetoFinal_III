package com.procarro.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orcamento")
    private Integer idOrcamento;

    @ManyToOne
    @JoinColumn(name = "cpf_cliente", referencedColumnName = "cpf")
    private Cliente cliente;

    @Column(name = "data_orcamento", nullable = false)
    private LocalDateTime dataOrcamento;

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    private String observacoes;

    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemOrcamento> itens;

    private String status;

    @PrePersist
    public void prePersist() {
        if (this.dataOrcamento == null) {
            this.dataOrcamento = LocalDateTime.now();
        }
    }
}
