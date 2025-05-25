package com.procarro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Peca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codPeca;

    private String nome;

    private String montadora;
    private String modelo;
    private Integer ano;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private Double preco;
}
