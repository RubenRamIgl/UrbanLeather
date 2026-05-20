package backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/files")
public class FileController {


    // RUTA SEGURA
    private static final Path UPLOAD_DIR =
            Paths.get("uploads").toAbsolutePath();


    // SUBIR IMAGEN
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {

        try {

            System.out.println("📥 Recibiendo archivo...");

            if (file.isEmpty()) {
                System.out.println("Archivo vacío");
                return ResponseEntity.badRequest().body("Archivo vacío");
            }

            System.out.println("Nombre original: " + file.getOriginalFilename());
            System.out.println("Tamaño: " + file.getSize());

            // crear carpeta si no existe
            Files.createDirectories(UPLOAD_DIR);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = UPLOAD_DIR.resolve(fileName);

            System.out.println("Guardando en: " + filePath.toAbsolutePath());

            Files.write(filePath, file.getBytes());

            System.out.println("Imagen guardada correctamente");

            // String url = "http://localhost:8081/files/" + fileName;
            String url = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/files/")
                    .path(fileName)
                    .toUriString();

            System.out.println("URL generada: " + url);

            return ResponseEntity.ok(url);

        } catch (Exception e) {

            System.out.println("ERROR subiendo imagen:");
            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body("Error subiendo imagen: " + e.getMessage());
        }
    }


    // OBTENER IMAGEN
    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {

        Path file = UPLOAD_DIR.resolve(filename);

        System.out.println("📤 Sirviendo imagen: " + file.toAbsolutePath());

        if (!Files.exists(file)) {
            System.out.println("Imagen no encontrada");
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(file.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file))
                .body(resource);
    }


    // BORRAR IMAGEN
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteImage(@RequestBody Map<String, String> body) {

        try {

            String url = body.get("url");

            System.out.println("Intentando borrar: " + url);


            // EXTRAER SOLO EL NOMBRE DEL ARCHIVO
            String fileName = url.substring(url.lastIndexOf("/") + 1);

            Path filePath = UPLOAD_DIR.resolve(fileName);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("Imagen borrada: " + fileName);
            } else {
                System.out.println("Archivo no existe: " + fileName);
            }

            return ResponseEntity.ok("Imagen eliminada");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error borrando imagen");
        }
    }
}