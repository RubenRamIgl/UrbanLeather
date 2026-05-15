package backend.service;

import backend.model.*;
import backend.repository.*;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarritoItemService {

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TallaRepository tallaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    public boolean addItem(String username, Long productoId, Long tallaId, int cantidad) {

        if (cantidad <= 0) {
            throw new PeticionIncorrectaException("La cantidad debe ser mayor a 0");
        }

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findByUsername(username)
                            .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

                    Carrito nuevo = new Carrito(usuario);
                    return carritoRepository.save(nuevo);
                });

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        Talla talla = tallaRepository.findById(tallaId)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        if (talla.getStock() < cantidad) {
            throw new PeticionIncorrectaException("Stock insuficiente");
        }

        Optional<CarritoItem> itemOpt = carritoItemRepository
                .findByCarritoIdAndProductoIdAndTallaId(
                        carrito.getId(),
                        productoId,
                        tallaId
                );

        if (itemOpt.isPresent()) {

            CarritoItem item = itemOpt.get();

            int nuevaCantidad = item.getCantidad() + cantidad;

            if (talla.getStock() < nuevaCantidad) {
                throw new PeticionIncorrectaException("Stock insuficiente");
            }

            item.setCantidad(nuevaCantidad);
            carritoItemRepository.save(item);

        } else {

            CarritoItem item = new CarritoItem();
            item.setCarrito(carrito);
            item.setProducto(producto);
            item.setTalla(talla);
            item.setCantidad(cantidad);

            carritoItemRepository.save(item);
        }

        return true;
    }


    public boolean eliminarItem(Long itemId) {

        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new NoEncontradoException("Item no encontrado"));

        carritoItemRepository.delete(item);

        return true;
    }


    public boolean actualizarCantidad(Long itemId, int cantidad) {

        if (cantidad <= 0) {
            throw new PeticionIncorrectaException("La cantidad debe ser mayor a 0");
        }

        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new NoEncontradoException("Item no encontrado"));

        Talla talla = item.getTalla();

        if (talla.getStock() < cantidad) {
            throw new PeticionIncorrectaException("Stock insuficiente");
        }

        item.setCantidad(cantidad);
        carritoItemRepository.save(item);

        return true;
    }


    public boolean limpiarCarrito(String username) {

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));

        carritoItemRepository.deleteAll(
                carritoItemRepository.findByCarritoId(carrito.getId())
        );

        return true;
    }
}
