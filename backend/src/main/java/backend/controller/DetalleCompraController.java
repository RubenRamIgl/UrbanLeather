package backend.controller;

import backend.DTO.DetalleCompraDTO;
import backend.model.DetalleCompra;
import backend.model.Talla;
import backend.service.DetalleCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DetalleCompraController {

    @Autowired
    private DetalleCompraService detalleCompraService;


    @PostMapping("/detalleCompra/add")
    public ResponseEntity<String> addDetalleCompra(
            @RequestParam Long compraId,
            @RequestParam Long productoId,
            @RequestParam String talla,
            @RequestParam int cantidad
    ) {

        if (talla == null || talla.isEmpty()) {
            throw new RuntimeException("La talla es obligatoria");
        }

        if (cantidad <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        Talla.TallaNombre tallaEnum;
        try {
            tallaEnum = Talla.TallaNombre.valueOf(talla.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Talla no válida");
        }

        detalleCompraService.addDetalleCompra(compraId, productoId, tallaEnum, cantidad);

        return ResponseEntity.ok("Producto añadido a la compra correctamente");
    }


    @GetMapping("/detalleCompra/compra/{compraId}")
    public ResponseEntity<List<DetalleCompra>> verDetallesPorCompra(@PathVariable Long compraId) {

        return ResponseEntity.ok(detalleCompraService.verDetallesPorCompra(compraId));
    }


    @DeleteMapping("/detalleCompra/id/{id}")
    public ResponseEntity<String> eliminarDetalle(@PathVariable Long id) {

        detalleCompraService.eliminarDetalle(id);

        return ResponseEntity.ok("Detalle eliminado correctamente");
    }


    @GetMapping("/detalleCompra/misDetalles")
    public ResponseEntity<List<DetalleCompraDTO>> verMisDetalles() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(detalleCompraService.verDetallesPorUsuario(username));
    }

    @GetMapping("/admin/compras/{username}")
    public ResponseEntity<List<DetalleCompraDTO>> verComprasUsuario(
            @PathVariable String username) {

        return ResponseEntity.ok(
                detalleCompraService.verDetallesPorUsuario(username)
        );
    }
}