package backend.service;

import backend.DTO.CompraRegisterDTO;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.*;
import backend.model.Compra.EstadoCompra;
import backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CompraService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra una compra en el sistema (modo administrador o sistema interno).
     *
     * @param dto datos de la compra
     * @return true si la compra fue creada correctamente
     * @throws PeticionIncorrectaException si el total o estado son inválidos
     * @throws NoEncontradoException si el usuario no existe
     */
    public boolean registerCompra(CompraRegisterDTO dto) {

        if (dto.getTotal() <= 0) {
            throw new PeticionIncorrectaException("El total debe ser mayor a 0");
        }

        if (dto.getEstado() == null || dto.getEstado().isEmpty()) {
            throw new PeticionIncorrectaException("El estado es obligatorio");
        }

        Usuario usuario = usuarioRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new NoEncontradoException("Usuario no existe"));

        EstadoCompra estado;
        try {
            estado = EstadoCompra.valueOf(dto.getEstado().toUpperCase());
        } catch (Exception e) {
            throw new PeticionIncorrectaException("Estado no válido");
        }

        Compra compra = new Compra();
        compra.setUsuario(usuario);
        compra.setFecha(LocalDateTime.now());
        compra.setEstado(estado);
        compra.setTotal(BigDecimal.valueOf(dto.getTotal()));

        compraRepository.save(compra);

        return true;
    }

    /**
     * Elimina una compra del sistema (modo administrador).
     *
     * @param id identificador de la compra
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si la compra no existe
     */
    public boolean eliminarCompra(Long id) {

        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("No existe la compra"));

        compraRepository.delete(compra);
        return true;
    }

    /**
     * Registra una compra del usuario autenticado.
     *
     * <p>La compra se crea automáticamente con estado PENDIENTE.</p>
     *
     * @param usernameActual usuario autenticado
     * @param dto datos de la compra
     * @return true si la compra fue creada correctamente
     * @throws NoEncontradoException si el usuario no existe
     * @throws PeticionIncorrectaException si los datos son inválidos
     */
    public boolean registerMiCompra(String usernameActual, CompraRegisterDTO dto) {

        if (dto.getTotal() <= 0) {
            throw new PeticionIncorrectaException("El total debe ser mayor a 0");
        }

        Usuario usuario = usuarioRepository.findByUsername(usernameActual)
                .orElseThrow(() -> new NoEncontradoException("Usuario no existe"));

        EstadoCompra estado = EstadoCompra.PENDIENTE;

        Compra compra = new Compra();
        compra.setUsuario(usuario);
        compra.setFecha(LocalDateTime.now());
        compra.setEstado(estado);
        compra.setTotal(BigDecimal.valueOf(dto.getTotal()));

        compraRepository.save(compra);

        return true;
    }

    /**
     * Elimina una compra del usuario autenticado.
     *
     * @param usernameActual usuario autenticado
     * @param idCompra identificador de la compra
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si la compra no existe
     * @throws AccessDeniedException si el usuario no es propietario de la compra
     */
    public boolean eliminarMiCompra(String usernameActual, Long idCompra) {

        Compra compra = compraRepository.findById(idCompra)
                .orElseThrow(() -> new NoEncontradoException("No existe la compra"));

        if (!compra.getUsuario().getUsername().equals(usernameActual)) {
            throw new AccessDeniedException("Solo puedes eliminar tus propias compras");
        }

        compraRepository.delete(compra);
        return true;
    }

    /**
     * Obtiene todas las compras del usuario autenticado.
     *
     * @param usernameActual usuario autenticado
     * @return lista de compras del usuario
     */
    public List<Compra> verMisCompras(String usernameActual) {

        return compraRepository.findByUsuarioUsername(usernameActual);
    }

    public void checkout(String username) {

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));

        List<CarritoItem> items =
                carritoItemRepository.findByCarritoId(carrito.getId());

        if (items.isEmpty()) {
            throw new PeticionIncorrectaException("El carrito está vacío");
        }

        Compra compra = new Compra();
        compra.setUsuario(carrito.getUsuario());
        compra.setFecha(LocalDateTime.now());
        compra.setEstado(Compra.EstadoCompra.PAGADO);

        BigDecimal total = BigDecimal.ZERO;

        List<DetalleCompra> detalles = new ArrayList<>();

        for (CarritoItem item : items) {

            BigDecimal precio = item.getProducto().getPrecio();

            BigDecimal subtotal =
                    precio.multiply(BigDecimal.valueOf(item.getCantidad()));

            total = total.add(subtotal);

            DetalleCompra detalle = new DetalleCompra(
                    compra,
                    item.getProducto(),
                    item.getTalla(),
                    item.getCantidad(),
                    precio,
                    item.getProducto().getNombre()
            );

            detalles.add(detalle);
        }

        compra.setTotal(total);
        compra.setDetalles(detalles);

        compraRepository.save(compra);

        carritoItemRepository.deleteAll(items);
    }
}