package backend.service;

import backend.DTO.CategoriaDTO;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.Categoria;
import backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Crea una nueva categoría.
     *
     * @param nombre nombre de la categoría
     * @return true si la categoría fue creada correctamente
     * @throws PeticionIncorrectaException si el nombre es nulo o vacío
     */
    public boolean crearCategoria(String nombre) {

        if (nombre == null || nombre.isEmpty()) {
            throw new PeticionIncorrectaException("El nombre es obligatorio");
        }

        Categoria categoria = new Categoria(nombre);

        categoriaRepository.save(categoria);

        return true;
    }

    /**
     * Obtiene la lista de todas las categorías del sistema.
     *
     * @return lista de categorías en formato DTO
     */
    public List<CategoriaDTO> listarCategorias() {

        return categoriaRepository.findAll()
                .stream()
                .map(c -> new CategoriaDTO(
                        c.getId(),
                        c.getNombre()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el nombre de una categoría existente.
     *
     * @param id identificador de la categoría
     * @param nombre nuevo nombre
     * @return true si la actualización fue correcta
     * @throws PeticionIncorrectaException si el nombre es nulo o vacío
     * @throws NoEncontradoException si la categoría no existe
     */
    public boolean actualizarCategoria(Long id, String nombre) {

        if (nombre == null || nombre.isEmpty()) {
            throw new PeticionIncorrectaException("El nombre es obligatorio");
        }

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Categoría no encontrada"));

        categoria.setNombre(nombre);

        categoriaRepository.save(categoria);

        return true;
    }

    /**
     * Elimina una categoría del sistema.
     *
     * @param id identificador de la categoría
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si la categoría no existe
     */
    public boolean eliminarCategoria(Long id) {

        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Categoría no encontrada"));

        categoriaRepository.delete(categoria);

        return true;
    }
}
