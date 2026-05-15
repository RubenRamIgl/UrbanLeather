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


    public List<Talla> listarTallas() {
        return tallaRepository.findAll();
    }


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


    public boolean eliminarTalla(Long id) {

        Talla talla = tallaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Talla no encontrada"));

        tallaRepository.delete(talla);

        return true;
    }


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