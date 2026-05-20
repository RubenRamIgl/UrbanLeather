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


    public List<DetalleCompra> verDetallesPorCompra(Long compraId) {

        if (!compraRepository.existsById(compraId)) {
            throw new NoEncontradoException("Compra no encontrada");
        }

        return detalleCompraRepository.findByCompra_Id(compraId);
    }


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