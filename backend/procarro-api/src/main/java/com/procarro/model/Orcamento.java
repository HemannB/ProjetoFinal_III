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

    @Column(name = "data_orcamento")
    private LocalDateTime dataOrcamento = LocalDateTime.now();

    private BigDecimal valorTotal;

    private String observacoes;

    @OneToMany(mappedBy = "orcamento", cascade = CascadeType.ALL)
    private List<ItemOrcamento> itens;
}
