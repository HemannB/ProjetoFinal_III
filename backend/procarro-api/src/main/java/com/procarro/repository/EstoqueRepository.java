package com.procarro.repository;

import com.procarro.model.Estoque;
import com.procarro.model.Peca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Integer> {
    Optional<Estoque> findByPeca(Peca peca);
}
