package backend.service;

import backend.DTO.DetalleCompraDTO;
import backend.model.*;
import backend.repository.*;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleCompraService {

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TallaRepository tallaRepository;

    /**
     * Añade un detalle de compra a una compra existente.
     *
     * <p>Reduce el stock de la talla correspondiente si hay disponibilidad.</p>
     *
     * @param compraId identificador de la compra
     * @param productoId identificador del producto
     * @param tallaNombre nombre de la talla seleccionada
     * @param cantidad cantidad de productos a añadir
     * @return true si el detalle fue creado correctamente
     * @throws PeticionIncorrectaException si la cantidad es inválida o no hay stock suficiente
     * @throws NoEncontradoException si la compra, producto o talla no existen
     */
    public boolean addDetalleCompra(Long compraId, Long productoId, Talla.TallaNombre tallaNombre, int cantidad) {

        if (cantidad <= 0) {
            throw new PeticionIncorrectaException("La cantidad debe ser mayor a 0");
        }

        Compra compra = compraRepository.findById(compraId)
                .orElseThrow(() -> new NoEncontradoException("Compra no encontrada"));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        Talla talla = tallaRepository
                .findByProductoIdAndNombre(productoId, tallaNombre)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        if (talla.getStock() < cantidad) {
            throw new PeticionIncorrectaException("Stock insuficiente");
        }

        talla.setStock(talla.getStock() - cantidad);
        tallaRepository.save(talla);

        DetalleCompra detalle = new DetalleCompra();
        detalle.setCompra(compra);
        detalle.setProducto(producto);
        detalle.setTalla(talla);
        detalle.setCantidad(cantidad);
        detalle.setPrecioUnitario(producto.getPrecio());
        detalle.setNombreProducto(producto.getNombre());

        detalleCompraRepository.save(detalle);

        return true;
    }

    /**
     * Obtiene todos los detalles asociados a una compra.
     *
     * @param compraId identificador de la compra
     * @return lista de detalles de compra
     * @throws NoEncontradoException si la compra no existe
     */
    public List<DetalleCompra> verDetallesPorCompra(Long compraId) {

        if (!compraRepository.existsById(compraId)) {
            throw new NoEncontradoException("Compra no encontrada");
        }

        return detalleCompraRepository.findByCompra_Id(compraId);
    }


    /**
     * Obtiene todos los detalles de compra realizados por un usuario.
     *
     * @param username nombre del usuario
     * @return lista de detalles en formato DTO
     */
    public List<DetalleCompraDTO> verDetallesPorUsuario(String username) {

        return detalleCompraRepository.findByCompra_Usuario_Username(username)
                .stream()
                .map(d -> new DetalleCompraDTO(
                        d.getId(),
                        d.getNombreProducto(),
                        d.getCantidad(),
                        d.getPrecioUnitario().doubleValue(),
                        d.getTalla().getNombre().name(),
                        d.getCompra().getId(),
                        d.getCompra().getEstado().name(),
                        d.getCompra().getFecha(),
                        d.getCompra().getTotal()
                ))
                .toList();
    }

    /**
     * Elimina un detalle de compra y devuelve el stock a la talla correspondiente.
     *
     * <p>Al eliminar el detalle, se restaura automáticamente el stock de la talla.</p>
     *
     * @param id identificador del detalle de compra
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si el detalle no existe
     */
    public boolean eliminarDetalle(Long id) {

        DetalleCompra detalle = detalleCompraRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Detalle no encontrado"));

        Talla talla = detalle.getTalla();
        talla.setStock(talla.getStock() + detalle.getCantidad());
        tallaRepository.save(talla);

        detalleCompraRepository.delete(detalle);

        return true;
    }
}