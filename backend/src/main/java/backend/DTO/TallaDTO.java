package backend.DTO;

public class TallaDTO {

    private Long id;
    private String nombre;
    private int stock;

    public TallaDTO() {}

    public TallaDTO(Long id, String nombre, int stock) {
        this.id = id;
        this.nombre = nombre;
        this.stock = stock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}