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

    /**
     * Obtiene el carrito de un usuario o lo crea si no existe.
     *
     * @param username nombre del usuario
     * @return carrito existente o recién creado
     * @throws NoEncontradoException si el usuario no existe
     */
    private Carrito obtenerOCrearCarrito(String username) {

        return carritoRepository.findByUsuarioUsername(username)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(username)
                            .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

                    Carrito nuevo = new Carrito(usuario);
                    return carritoRepository.save(nuevo);
                });
    }

    /**
     * Añade un producto al carrito del usuario.
     *
     * <p>Si el producto ya existe en el carrito con la misma talla, incrementa la cantidad.</p>
     *
     * @param username nombre del usuario
     * @param productoId identificador del producto
     * @param tallaNombre nombre de la talla (String)
     * @param cantidad cantidad a añadir
     * @return true si el producto fue añadido correctamente
     * @throws PeticionIncorrectaException si la cantidad o talla son inválidas
     * @throws NoEncontradoException si el producto, talla o usuario no existen
     */
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

    /**
     * Obtiene el carrito completo de un usuario.
     *
     * @param username nombre del usuario
     * @return carrito en formato DTO con sus items
     * @throws NoEncontradoException si el carrito no existe
     */
    // En CarritoService.java
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
                        i.getCantidad(),
                        i.getProducto().getPrecio().doubleValue()
                ))
                .collect(Collectors.toList());

        double total = items.stream()
                .mapToDouble(item -> item.getPrecio() * item.getCantidad())
                .sum();

        return new CarritoDTO(username, items, total);
    }

    /**
     * Elimina un item del carrito de un usuario.
     *
     * @param username nombre del usuario autenticado
     * @param itemId identificador del item del carrito
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si el item no existe
     * @throws PeticionIncorrectaException si el item no pertenece al usuario
     */
    public boolean eliminarItem(String username, Long itemId) {

        CarritoItem item = carritoItemRepository.findById(itemId)
                .orElseThrow(() -> new NoEncontradoException("Item no encontrado"));

        if (!item.getCarrito().getUsuario().getUsername().equals(username)) {
            throw new PeticionIncorrectaException("No puedes eliminar este item");
        }

        carritoItemRepository.delete(item);

        return true;
    }

    /**
     * Vacía completamente el carrito del usuario.
     *
     * @param username nombre del usuario
     * @return true si el carrito fue vaciado correctamente
     * @throws NoEncontradoException si el carrito no existe
     */
    public boolean vaciarCarrito(String username) {

        Carrito carrito = carritoRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Carrito no encontrado"));

        carrito.getItems().clear();

        carritoItemRepository.deleteAll(carrito.getItems());

        return true;
    }
}
