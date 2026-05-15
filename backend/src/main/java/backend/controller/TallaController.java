package backend.controller;

import backend.DTO.TallaDTO;
import backend.DTO.TallaRegisterDTO;
import backend.model.Talla;
import backend.service.TallaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TallaController {

    @Autowired
    private TallaService tallaService;


    @PostMapping("/tallaRegister")
    public ResponseEntity<String> crearTalla(@RequestBody TallaRegisterDTO dto) {

        tallaService.crearTalla(dto);

        return ResponseEntity.ok("Talla creada correctamente");
    }


    @GetMapping("/tallas")
    public ResponseEntity<List<Talla>> listarTallas() {

        return ResponseEntity.ok(tallaService.listarTallas());
    }


    @GetMapping("/tallas/producto/{productoId}")
    public ResponseEntity<List<TallaDTO>> listarPorProducto(@PathVariable Long productoId) {

        return ResponseEntity.ok(tallaService.listarPorProducto(productoId));
    }


    @PutMapping("/tallaUpdate/{id}")
    public ResponseEntity<Talla> actualizarStock(
            @PathVariable Long id,
            @RequestParam int stock) {

        return ResponseEntity.ok(tallaService.actualizarStock(id, stock));
    }


    @DeleteMapping("/tallaDelete/{id}")
    public ResponseEntity<String> eliminarTalla(@PathVariable Long id) {

        tallaService.eliminarTalla(id);

        return ResponseEntity.ok("Talla eliminada correctamente");
    }
}
