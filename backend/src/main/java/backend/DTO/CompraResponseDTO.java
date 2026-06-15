// backend/DTO/CompraResponseDTO.java
package backend.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class CompraResponseDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private double total;
    private List<DetalleCompraResponseDTO> detalles;

    public CompraResponseDTO() {}

    public CompraResponseDTO(Long id, LocalDateTime fecha, String estado,
                             double total, List<DetalleCompraResponseDTO> detalles) {
        this.id = id;
        this.fecha = fecha;
        this.estado = estado;
        this.total = total;
        this.detalles = detalles;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public List<DetalleCompraResponseDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleCompraResponseDTO> detalles) { this.detalles = detalles; }
}
