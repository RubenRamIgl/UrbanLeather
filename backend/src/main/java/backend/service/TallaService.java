package backend.service;

import backend.DTO.TallaDTO;
import backend.DTO.TallaRegisterDTO;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.Producto;
import backend.model.Talla;
import backend.repository.ProductoRepository;
import backend.repository.TallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TallaService {

    @Autowired
    private TallaRepository tallaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Crea una nueva talla asociada a un producto.
     *
     * @param dto datos necesarios para registrar la talla
     * @return true si la talla se creó correctamente
     * @throws PeticionIncorrectaException si el nombre es nulo o el stock es negativo
     * @throws NoEncontradoException si el producto no existe
     */
    public boolean crearTalla(TallaRegisterDTO dto) {

        if (dto.getNombre() == null) {
            throw new PeticionIncorrectaException("El nombre de la talla es obligatorio");
        }

        if (dto.getStock() < 0) {
            throw new PeticionIncorrectaException("El stock no puede ser negativo");
        }

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        Talla talla = new Talla();
        talla.setNombre(dto.getNombre());
        talla.setStock(dto.getStock());
        talla.setProducto(producto);

        tallaRepository.save(talla);

        return true;
    }


    /**
     * Obtiene todas las tallas registradas en el sistema.
     *
     * @return lista de todas las tallas
     */
    public List<Talla> listarTallas() {
        return tallaRepository.findAll();
    }


    /**
     * Lista todas las tallas asociadas a un producto específico.
     *
     * @param productoId identificador del producto
     * @return lista de tallas en formato DTO
     * @throws NoEncontradoException si el producto no existe
     */
    public List<TallaDTO> listarPorProducto(Long productoId) {

        if (!productoRepository.existsById(productoId)) {
            throw new NoEncontradoException("Producto no encontrado");
        }

        return tallaRepository.findByProductoId(productoId)
                .stream()
                .map(t -> new TallaDTO(
                        t.getId(),
                        t.getNombre().name(),
                        t.getStock()
                ))
                .toList();
    }

    /**
     * Elimina una talla del sistema por su ID.
     *
     * @param id identificador de la talla
     * @return true si la eliminación fue exitosa
     * @throws NoEncontradoException si la talla no existe
     */
    public boolean eliminarTalla(Long id) {

        Talla talla = tallaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        tallaRepository.delete(talla);

        return true;
    }

    /**
     * Actualiza el stock disponible de una talla.
     *
     * @param id identificador de la talla
     * @param stock nuevo valor de stock
     * @return talla actualizada
     * @throws PeticionIncorrectaException si el stock es negativo
     * @throws NoEncontradoException si la talla no existe
     */
    public Talla actualizarStock(Long id, int stock) {

        if (stock < 0) {
            throw new PeticionIncorrectaException("El stock no puede ser negativo");
        }

        Talla talla = tallaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        talla.setStock(stock);

        tallaRepository.save(talla);

        return talla;
    }
}