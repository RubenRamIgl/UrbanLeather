package backend.service;

import backend.DTO.CarritoDTO;
import backend.DTO.CarritoItemDTO;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.*;
import backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TallaRepository tallaRepository;


    private Carrito obtenerOCrearCarrito(String username) {

        return carritoRepository.findByUsuarioUsername(username)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(username)
                            .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

                    Carrito nuevo = new Carrito(usuario);
                    return carritoRepository.save(nuevo);
                });
    }


    public boolean addProducto(String username, Long productoId, String tallaNombre, int cantidad) {

        if (cantidad <= 0) {
            throw new PeticionIncorrectaException("Cantidad inválida");
        }

        Carrito carrito = obtenerOCrearCarrito(username);

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        Talla.TallaNombre tallaEnum;
        try {
            tallaEnum = Talla.TallaNombre.valueOf(tallaNombre.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new PeticionIncorrectaException("Talla inválida");
        }

        Talla talla = tallaRepository.findByProductoIdAndNombre(productoId, tallaEnum)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        CarritoItem itemExistente = carritoItemRepository
                .findByCarritoIdAndProductoIdAndTallaId(
                        carrito.getId(),
                        productoId,
                        talla.getId()
                )
                .orElse(null);

        if (itemExistente != null) {
            itemExistente.setCantidad(itemExistente.getCantidad() + cantidad);
            carritoItemRepository.save(itemExistente);
        } else {
            CarritoItem nuevo = new CarritoItem(carrito, producto, talla, cantidad);
            carritoItemRepository.save(nuevo);
        }

        return true;
    }


    public CarritoDTO verCarrito(String username) {

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));

        List<CarritoItemDTO> items = carrito.getItems()
                .stream()
                .map(i -> new CarritoItemDTO(
                        i.getId(),
                        i.getProducto().getId(),
                        i.getProducto().getNombre(),
                        i.getTalla().getNombre().name(),
                        i.getCantidad()
                ))
                .collect(Collectors.toList());

        return new CarritoDTO(username, items);
    }


    public boolean eliminarItem(String username, Long itemId) {

        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new NoEncontradoException("Item no encontrado"));

        if (!item.getCarrito().getUsuario().getUsername().equals(username)) {
            throw new PeticionIncorrectaException("No puedes eliminar este item");
        }

        carritoItemRepository.delete(item);

        return true;
    }


    public boolean vaciarCarrito(String username) {

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));

        carrito.getItems().clear();

        carritoItemRepository.deleteAll(carrito.getItems());

        return true;
    }
}
