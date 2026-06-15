// backend/DTO/DetalleCompraResponseDTO.java
package backend.DTO;

public class DetalleCompraResponseDTO {
    private String nombreProducto;
    private String talla;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;

    public DetalleCompraResponseDTO() {}

    public DetalleCompraResponseDTO(String nombreProducto, String talla,
                                    int cantidad, double precioUnitario, double subtotal) {
        this.nombreProducto = nombreProducto;
        this.talla = talla;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    // Getters y Setters
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
