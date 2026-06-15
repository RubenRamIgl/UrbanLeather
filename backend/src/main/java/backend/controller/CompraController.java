package backend.controller;

import backend.DTO.CompraRegisterDTO;
import backend.DTO.CompraResponseDTO;
import backend.model.Compra;
import backend.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CompraController {

    @Autowired
    private CompraService compraService;


    @PostMapping("/compraRegister")
    public ResponseEntity<String> registerCompra(@RequestBody CompraRegisterDTO compraDTO) {

        compraService.registerCompra(compraDTO);

        return ResponseEntity.ok("Compra registrada correctamente");
    }


    @PostMapping("/registerMiCompra")
    public ResponseEntity<String> registerMiCompra(@RequestBody CompraRegisterDTO compraDTO) {

        String usernameActual =
                SecurityContextHolder.getContext().getAuthentication().getName();

        compraService.registerMiCompra(usernameActual, compraDTO);

        return ResponseEntity.ok("Tu compra se ha registrado correctamente");
    }


    @DeleteMapping("/eliminarCompra/{id}")
    public ResponseEntity<String> eliminarCompra(@PathVariable Long id) {

        compraService.eliminarCompra(id);

        return ResponseEntity.ok("Compra eliminada correctamente");
    }


    @DeleteMapping("/eliminarMiCompra/{id}")
    public ResponseEntity<String> eliminarMiCompra(@PathVariable Long id) {

        String usernameActual =
                SecurityContextHolder.getContext().getAuthentication().getName();

        compraService.eliminarMiCompra(usernameActual, id);

        return ResponseEntity.ok("Tu compra ha sido eliminada correctamente");
    }


    @GetMapping("/misCompras")
    public ResponseEntity<List<Compra>> verMisCompras() {

        String usernameActual =
                SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(compraService.verMisCompras(usernameActual));
    }

    @PostMapping("/compra/checkout")
    public ResponseEntity<?> checkout() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        CompraResponseDTO compra = compraService.checkout(username);
        return ResponseEntity.ok(compra);
    }

    /*@GetMapping("/admin/compras/{username}")
    public ResponseEntity<List<Compra>> verComprasUsuario(@PathVariable String username) {

        return ResponseEntity.ok(compraService.verMisCompras(username));
    }*/
}
