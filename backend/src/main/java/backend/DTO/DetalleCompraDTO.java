package backend.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DetalleCompraDTO {

    // ===== DETALLE =====
    private Long id;
    private String nombreProducto;
    private int cantidad;
    private double precioUnitario;
    private String talla;

    // ===== COMPRA =====
    private Long compraId;
    private String estadoCompra;
    private LocalDateTime fechaCompra;
    private BigDecimal totalCompra;

    public DetalleCompraDTO() {}

    public DetalleCompraDTO(Long id,
                            String nombreProducto,
                            int cantidad,
                            double precioUnitario,
                            String talla,
                            Long compraId,
                            String estadoCompra,
                            LocalDateTime fechaCompra,
                            BigDecimal totalCompra) {

        this.id = id;
        this.nombreProducto = nombreProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.talla = talla;
        this.compraId = compraId;
        this.estadoCompra = estadoCompra;
        this.fechaCompra = fechaCompra;
        this.totalCompra = totalCompra;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public String getTalla() {
        return talla;
    }

    public void setTalla(String talla) {
        this.talla = talla;
    }

    public Long getCompraId() {
        return compraId;
    }

    public void setCompraId(Long compraId) {
        this.compraId = compraId;
    }

    public String getEstadoCompra() {
        return estadoCompra;
    }

    public void setEstadoCompra(String estadoCompra) {
        this.estadoCompra = estadoCompra;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
    }

    public BigDecimal getTotalCompra() {
        return totalCompra;
    }

    public void setTotalCompra(BigDecimal totalCompra) {
        this.totalCompra = totalCompra;
    }
}