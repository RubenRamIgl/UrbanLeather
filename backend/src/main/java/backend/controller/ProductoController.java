package backend.controller;

import backend.DTO.ProductoDTO;
import backend.DTO.ProductoRegisterDTO;
import backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductoController {

    @Autowired
    private ProductoService productoService;


    @PostMapping("/productoRegister")
    public ResponseEntity<String> registerProducto(@RequestBody ProductoRegisterDTO dto) {

        productoService.registerProducto(dto);
        return ResponseEntity.ok("Producto creado correctamente");
    }


    @GetMapping("/productos")
    public ResponseEntity<List<ProductoDTO>> listarProductos() {
        return ResponseEntity.ok(productoService.listarProductos());
    }

    @PutMapping("/productoUpdate/{id}")
    public ResponseEntity<String> actualizarProducto(
            @PathVariable Long id,
            @RequestBody ProductoRegisterDTO dto) {

        productoService.actualizarProducto(id, dto);

        return ResponseEntity.ok("Producto actualizado correctamente");
    }


    @DeleteMapping("/productoDelete/{id}")
    public ResponseEntity<String> eliminarProducto(@PathVariable Long id) {

        productoService.eliminarProducto(id);
        return ResponseEntity.ok("Producto eliminado correctamente");
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoDTO> obtenerProductoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerProductoPorId(id));
    }
}
