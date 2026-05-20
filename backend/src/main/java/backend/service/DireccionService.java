package backend.service;

import backend.DTO.DireccionRegisterDTO;
import backend.DTO.DireccionAdminDTO;
import backend.DTO.DireccionDTO;
import backend.error.excepciones.DuplicadoException;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.Direccion;
import backend.model.Usuario;
import backend.repository.DireccionRepository;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Registra una dirección asociada a un usuario (modo administrador).
     *
     * @param dto datos de la dirección a registrar
     * @return true si la dirección fue creada correctamente
     * @throws PeticionIncorrectaException si los datos son inválidos
     * @throws NoEncontradoException si el usuario no existe
     * @throws DuplicadoException si el usuario ya tiene una dirección
     */
    public boolean registerDireccion(DireccionAdminDTO dto) {

        validar(dto.getNumero(), dto.getCp(), dto.getProvincia(), dto.getMunicipio());

        Usuario usuario = usuarioRepository.findByUsername(dto.getUserName())
                .orElseThrow(() -> new NoEncontradoException("Ese usuario no existe"));

        Optional<Direccion> existente =
                direccionRepository.findByUsuarioUsername(dto.getUserName());

        if (existente.isPresent()) {
            throw new DuplicadoException("Ya existe una dirección para este usuario");
        }

        Direccion direccion = new Direccion(
                dto.getCalle(),
                dto.getNumero(),
                dto.getCp(),
                dto.getProvincia(),
                dto.getMunicipio(),
                usuario
        );

        direccionRepository.save(direccion);

        return true;
    }

    /**
     * Actualiza la dirección de un usuario (modo administrador).
     *
     * @param dto datos actualizados de la dirección
     * @return DTO con los datos actualizados
     * @throws PeticionIncorrectaException si los datos son inválidos
     * @throws NoEncontradoException si la dirección no existe
     */
    public DireccionAdminDTO actualizarDireccion(DireccionAdminDTO dto) {

        validar(dto.getNumero(), dto.getCp(), dto.getProvincia(), dto.getMunicipio());

        Direccion direccion = direccionRepository.findByUsuarioUsername(dto.getUserName())
                .orElseThrow(() -> new NoEncontradoException("No existe dirección"));

        direccion.setCalle(dto.getCalle());
        direccion.setNumero(dto.getNumero());
        direccion.setCp(dto.getCp());
        direccion.setProvincia(dto.getProvincia());
        direccion.setMunicipio(dto.getMunicipio());

        direccionRepository.save(direccion);

        return new DireccionAdminDTO(
                dto.getCalle(),
                dto.getNumero(),
                dto.getCp(),
                dto.getProvincia(),
                dto.getMunicipio(),
                dto.getUserName()
        );
    }

    /**
     * Elimina la dirección de un usuario (modo administrador).
     *
     * @param username nombre de usuario
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si la dirección no existe
     */
    public boolean eliminarDireccion(String username) {

        Direccion direccion = direccionRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("No existe una dirección"));

        direccionRepository.delete(direccion);

        return true;
    }

    /**
     * Registra la dirección del usuario autenticado.
     *
     * @param dto datos de la dirección
     * @return true si la dirección fue creada correctamente
     * @throws PeticionIncorrectaException si los datos son inválidos
     * @throws NoEncontradoException si el usuario no existe
     * @throws DuplicadoException si el usuario ya tiene dirección
     */
    public boolean registerMiDireccion(DireccionRegisterDTO dto) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Usuario no existe"));

        validar(dto.getNumero(), dto.getCp(), dto.getProvincia(), dto.getMunicipio());

        Optional<Direccion> existente =
                direccionRepository.findByUsuarioUsername(username);

        if (existente.isPresent()) {
            throw new DuplicadoException("Ya existe una dirección para este usuario");
        }

        Direccion direccion = new Direccion(
                dto.getCalle(),
                dto.getNumero(),
                dto.getCp(),
                dto.getProvincia(),
                dto.getMunicipio(),
                usuario
        );

        direccionRepository.save(direccion);

        return true;
    }

    /**
     * Actualiza la dirección del usuario autenticado.
     *
     * @param dto nuevos datos de la dirección
     * @return DTO con los datos actualizados
     * @throws PeticionIncorrectaException si los datos son inválidos
     * @throws NoEncontradoException si la dirección no existe
     */
    public DireccionRegisterDTO actualizarMiDireccion(DireccionRegisterDTO dto) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Direccion direccion = direccionRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("No existe dirección"));

        validar(dto.getNumero(), dto.getCp(), dto.getProvincia(), dto.getMunicipio());

        direccion.setCalle(dto.getCalle());
        direccion.setNumero(dto.getNumero());
        direccion.setCp(dto.getCp());
        direccion.setProvincia(dto.getProvincia());
        direccion.setMunicipio(dto.getMunicipio());

        direccionRepository.save(direccion);

        return dto;
    }

    /**
     * Elimina la dirección del usuario autenticado.
     *
     * @return true si la eliminación fue correcta
     * @throws NoEncontradoException si no existe dirección
     */
    public boolean eliminarMiDireccion() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Direccion direccion = direccionRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("No existe dirección"));

        direccionRepository.delete(direccion);

        return true;
    }

    /**
     * Obtiene la dirección del usuario autenticado.
     *
     * @return dirección en formato DTO
     * @throws NoEncontradoException si no existe dirección
     */
    public DireccionDTO obtenerMiDireccion() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Direccion d = direccionRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("No existe dirección"));

        return new DireccionDTO(
                d.getCalle(),
                d.getNumero(),
                d.getCp(),
                d.getProvincia(),
                d.getMunicipio()
        );
    }

    /**
     * Obtiene la dirección del usuario autenticado.
     *
     * @return dirección en formato DTO
     * @throws NoEncontradoException si no existe dirección
     */
    public DireccionDTO obtenerDireccion(String username) {

        Direccion d = direccionRepository.findByUsuarioUsername(username)
                .orElseThrow(() -> new NoEncontradoException("No existe dirección"));

        return new DireccionDTO(
                d.getCalle(),
                d.getNumero(),
                d.getCp(),
                d.getProvincia(),
                d.getMunicipio()
        );
    }

    /**
     * Valida los campos de una dirección.
     *
     * @param numero número de la calle
     * @param cp código postal (debe tener 5 dígitos)
     * @param provincia nombre de la provincia
     * @param municipio nombre del municipio
     * @throws PeticionIncorrectaException si algún campo es inválido
     */
    private void validar(int numero, String cp, String provincia, String municipio) {

        if (numero <= 0) {
            throw new PeticionIncorrectaException("El número debe ser mayor a 0");
        }

        if (cp == null || cp.length() != 5) {
            throw new PeticionIncorrectaException("El CP debe de tener 5 dígitos");
        }

        if (provincia == null || provincia.isEmpty()) {
            throw new PeticionIncorrectaException("La provincia es obligatoria");
        }

        if (municipio == null || municipio.isEmpty()) {
            throw new PeticionIncorrectaException("El municipio es obligatorio");
        }
    }
}