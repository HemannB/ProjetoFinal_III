package com.procarro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estoque")
    private Integer idEstoque;

    @ManyToOne
    @JoinColumn(name = "cod_peca", nullable = false)
    private Peca peca;

    @Column(nullable = false)
    private Integer quantidade;
}
