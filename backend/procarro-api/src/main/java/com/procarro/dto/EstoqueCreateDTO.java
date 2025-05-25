package com.procarro.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstoqueCreateDTO {

    @NotNull(message = "O código da peça é obrigatório.")
    private Integer codPeca;

    @NotNull(message = "A quantidade é obrigatória.")
    private Integer quantidade;
}
