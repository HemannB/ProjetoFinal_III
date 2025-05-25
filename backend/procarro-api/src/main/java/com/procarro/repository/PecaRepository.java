package com.procarro.repository;

import com.procarro.model.Peca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PecaRepository extends JpaRepository<Peca, Integer> {
}
