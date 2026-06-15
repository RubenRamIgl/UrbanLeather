package backend.DTO;

import java.util.List;

public class CarritoDTO {

    private String username;
    private List<CarritoItemDTO> items;
    private double total;

    public CarritoDTO() {}

    public CarritoDTO(String username, List<CarritoItemDTO> items, double total) {
        this.username = username;
        this.items = items;
        this.total = total;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<CarritoItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CarritoItemDTO> items) {
        this.items = items;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
