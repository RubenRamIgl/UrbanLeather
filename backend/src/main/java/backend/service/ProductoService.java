package backend.service;

import backend.DTO.ProductoDTO;
import backend.DTO.ProductoRegisterDTO;
import backend.DTO.TallaDTO;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.Categoria;
import backend.model.Producto;
import backend.model.Talla;
import backend.repository.CategoriaRepository;
import backend.repository.ProductoRepository;
import backend.repository.TallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private TallaRepository tallaRepository;


    public boolean registerProducto(ProductoRegisterDTO dto) {

        if (dto.getNombre() == null || dto.getNombre().isEmpty()) {
            throw new PeticionIncorrectaException("El nombre es obligatorio");
        }

        if (dto.getPrecio() == null || dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new PeticionIncorrectaException("El precio debe ser mayor a 0");
        }

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new NoEncontradoException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setColor(dto.getColor());
        producto.setImagenUrl(dto.getImagen_url());
        producto.setCategoria(categoria);

        productoRepository.save(producto);

        if (dto.getTallas() != null && !dto.getTallas().isEmpty()) {

            for (var t : dto.getTallas()) {

                Talla talla = new Talla();
                talla.setNombre(t.getNombre());
                talla.setStock(t.getStock());
                talla.setProducto(producto);

                tallaRepository.save(talla);
            }

        } else {

            for (Talla.TallaNombre nombre : Talla.TallaNombre.values()) {

                Talla talla = new Talla();
                talla.setNombre(nombre);
                talla.setStock(0);
                talla.setProducto(producto);

                tallaRepository.save(talla);
            }
        }

        return true;
    }

    public List<ProductoDTO> listarProductos() {

        return productoRepository.findAll().stream()
                .map(p -> {

                    ProductoDTO dto = new ProductoDTO(
                            p.getId(),
                            p.getNombre(),
                            p.getDescripcion(),
                            p.getPrecio(),
                            p.getColor(),
                            p.getImagenUrl(),
                            p.getCategoria().getNombre()
                    );

                    List<TallaDTO> tallas = tallaRepository
                            .findByProductoId(p.getId())
                            .stream()
                            .map(t -> new TallaDTO(
                                    t.getId(),
                                    t.getNombre().name(),
                                    t.getStock()
                            ))
                            .toList();

                    dto.setTallas(tallas);

                    return dto;
                })
                .toList();
    }

    public void actualizarProducto(Long id, ProductoRegisterDTO dto) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (dto.getImagen_url() != null &&
                !dto.getImagen_url().isEmpty() &&
                producto.getImagenUrl() != null &&
                !producto.getImagenUrl().equals(dto.getImagen_url())) {

            try {

                String oldUrl = producto.getImagenUrl();

                String fileName = oldUrl.substring(oldUrl.lastIndexOf("/") + 1);

                Path uploadDir = Paths.get("uploads").toAbsolutePath();

                Path filePath = uploadDir.resolve(fileName);

                Files.deleteIfExists(filePath);

                System.out.println("🗑 Imagen antigua eliminada");

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setColor(dto.getColor());
        producto.setImagenUrl(dto.getImagen_url());

        if (dto.getCategoriaId() != null) {

            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

            producto.setCategoria(categoria);
        }

        productoRepository.save(producto);
    }


    public boolean eliminarProducto(Long id) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        productoRepository.delete(producto);

        return true;
    }

    public ProductoDTO obtenerProductoPorId(Long id) {

        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("Producto no encontrado"));

        ProductoDTO dto = new ProductoDTO(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getColor(),
                p.getImagenUrl(),
                p.getCategoria().getNombre()
        );

        List<TallaDTO> tallas = tallaRepository
                .findByProductoId(p.getId())
                .stream()
                .map(t -> new TallaDTO(
                        t.getId(),
                        t.getNombre().name(),
                        t.getStock()
                ))
                .toList();

        dto.setTallas(tallas);

        return dto;
    }
}