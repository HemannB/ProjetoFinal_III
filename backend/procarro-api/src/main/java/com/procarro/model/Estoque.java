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

    @OneToOne
    @JoinColumn(name = "cod_peca", nullable = false, unique = true)
    private Peca peca;

    @Column(nullable = false)
    private Integer quantidade;
}
