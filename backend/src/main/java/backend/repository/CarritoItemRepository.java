package backend.repository;

import backend.model.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {

    List<CarritoItem> findByCarritoId(Long carritoId);

    List<CarritoItem> findByCarritoUsuarioUsername(String username);

    Optional<CarritoItem> findByCarritoIdAndProductoIdAndTallaId(
            Long carritoId,
            Long productoId,
            Long tallaId
    );

    @Modifying
    @Transactional
    @Query("DELETE FROM CarritoItem ci WHERE ci.carrito.id = :carritoId")
    void deleteByCarritoId(@Param("carritoId") Long carritoId);

    @Modifying
    @Transactional
    @Query("DELETE FROM CarritoItem ci WHERE ci.carrito.usuario.id = :usuarioId")
    void deleteByUsuarioId(@Param("usuarioId") Long usuarioId);
}