package com.procarro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Peca {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cod_peca")
    private Integer codPeca;

    @Column(nullable = false)
    private String nome;

    // Adicione os demais campos que você tiver, por exemplo:
    private String montadora;
    private String modelo;
    private Integer ano;
    private String descricao;
    private Double preco;
}
