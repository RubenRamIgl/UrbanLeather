package backend.repository;

import backend.model.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

    List<Compra> findByUsuarioUsername(String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM Compra c WHERE c.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT c FROM Compra c WHERE c.usuario.id = :usuarioId")
    List<Compra> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}