package backend.repository;

import backend.model.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {

    List<DetalleCompra> findByCompra_Id(Long compraId);

    List<DetalleCompra> findByProducto_Id(Long productoId);

    List<DetalleCompra> findByCompra_Usuario_Username(String username);

    @Modifying
    @Transactional
    @Query("DELETE FROM DetalleCompra dc WHERE dc.compra.id = :compraId")
    void deleteByCompraId(@Param("compraId") Long compraId);

    @Modifying
    @Transactional
    @Query("DELETE FROM DetalleCompra dc WHERE dc.compra.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT dc FROM DetalleCompra dc WHERE dc.compra.usuario.id = :usuarioId")
    List<DetalleCompra> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}