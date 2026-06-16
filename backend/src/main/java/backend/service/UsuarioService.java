package backend.service;

import backend.DTO.UsuarioPerfilDTO;
import backend.DTO.UsuarioRegisterDTO;
import backend.DTO.UsuarioUpdateDTO;
import backend.error.excepciones.DuplicadoException;
import backend.error.excepciones.NoEncontradoException;
import backend.error.excepciones.PeticionIncorrectaException;
import backend.model.Usuario;
import backend.model.Usuario.Roles;
import backend.model.Direccion;
import backend.model.Compra;
import backend.repository.UsuarioRepository;
import backend.repository.DireccionRepository;
import backend.repository.CompraRepository;
import backend.repository.DetalleCompraRepository;
import backend.repository.CarritoRepository;
import backend.repository.CarritoItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Carga un usuario por su username para autenticación en Spring Security.
     *
     * @param username nombre de usuario
     * @return UserDetails con username, password y roles
     * @throws UsernameNotFoundException si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        GrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + usuario.getRoles().name());

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(List.of(authority))
                .build();
    }

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param dto datos del usuario a registrar
     * @return true si el registro fue exitoso
     * @throws DuplicadoException si el username ya existe
     * @throws PeticionIncorrectaException si las contraseñas no coinciden
     */
    public boolean register(UsuarioRegisterDTO dto) {

        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new DuplicadoException("El usuario ya existe");
        }

        if (!dto.getPassword().equals(dto.getRepetirPassword())) {
            throw new PeticionIncorrectaException("Las contraseñas no coinciden");
        }

        Roles roleEnum;
        try {
            roleEnum = Roles.valueOf(dto.getRoles().toUpperCase());
        } catch (Exception e) {
            roleEnum = Roles.USER;
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        Usuario usuario = new Usuario(
                dto.getNombre(),
                dto.getApellido(),
                dto.getEmail(),
                dto.getUsername(),
                hashedPassword,
                roleEnum
        );

        usuarioRepository.save(usuario);
        return true;
    }

    /**
     * Actualiza los datos básicos de un usuario.
     *
     * @param dto datos a actualizar
     * @return UsuarioUpdateDTO actualizado
     * @throws NoEncontradoException si el usuario no existe
     */
    public UsuarioUpdateDTO actualizarUsuario(UsuarioUpdateDTO dto) {

        Usuario usuario = usuarioRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setEmail(dto.getEmail());

        usuarioRepository.save(usuario);

        return dto;
    }

    /**
     * Elimina completamente un usuario y todas sus relaciones en el orden correcto:
     * 1. CarritoItem (items del carrito) - HIJO DE CARRITO
     * 2. Carrito (carrito) - HIJO DE USUARIO
     * 3. DetalleCompra (detalles de compras) - HIJO DE COMPRA
     * 4. Compra (compras) - HIJO DE USUARIO
     * 5. Direccion (dirección) - HIJO DE USUARIO
     * 6. Usuario (usuario) - PADRE
     *
     * @param username usuario a eliminar
     * @return true si se eliminó correctamente
     * @throws NoEncontradoException si el usuario no existe
     */
    @Transactional
    public boolean borrarUsuario(String username) {

        logger.info("=== INICIO borrarUsuario ===");
        logger.info("Username a eliminar: {}", username);

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado: " + username));

        Long usuarioId = usuario.getId();
        logger.info("Usuario encontrado con ID: {}", usuarioId);

        // ==========================================
        // ORDEN DE ELIMINACIÓN CORRECTO (DE HIJO A PADRE)
        // ==========================================

        // 1. PRIMERO: Eliminar items del carrito (CarritoItem)
        try {
            logger.info("1. Eliminando items del carrito para usuario ID: {}", usuarioId);
            carritoItemRepository.deleteByUsuarioId(usuarioId);
            logger.info("Items del carrito eliminados");
        } catch (Exception e) {
            logger.warn("No se encontraron items de carrito o ya estaban eliminados: {}", e.getMessage());
        }

        // 2. SEGUNDO: Eliminar el carrito (Carrito)
        try {
            logger.info("2. Eliminando carrito para usuario ID: {}", usuarioId);
            carritoRepository.deleteByUsuarioId(usuarioId);
            logger.info("Carrito eliminado");
        } catch (Exception e) {
            logger.warn("No se encontró carrito o ya estaba eliminado: {}", e.getMessage());
        }

        // 3. TERCERO: Eliminar detalles de compra (DetalleCompra)
        try {
            logger.info("3. Eliminando detalles de compra para usuario ID: {}", usuarioId);
            detalleCompraRepository.deleteByUsuarioId(usuarioId);
            logger.info("Detalles de compra eliminados");
        } catch (Exception e) {
            logger.warn("No se encontraron detalles de compra o ya estaban eliminados: {}", e.getMessage());
        }

        // 4. CUARTO: Eliminar compras (Compra)
        try {
            logger.info("4. Eliminando compras para usuario ID: {}", usuarioId);
            compraRepository.deleteByUsuarioId(usuarioId);
            logger.info("Compras eliminadas");
        } catch (Exception e) {
            logger.warn("No se encontraron compras o ya estaban eliminadas: {}", e.getMessage());
        }

        // 5. QUINTO: Eliminar dirección (Direccion)
        try {
            logger.info("5. Eliminando direccion para usuario ID: {}", usuarioId);
            direccionRepository.deleteByUsuarioId(usuarioId);
            logger.info("Direccion eliminada");
        } catch (Exception e) {
            logger.warn("No se encontró dirección o ya estaba eliminada: {}", e.getMessage());
        }

        // 6. FINALMENTE: Eliminar el usuario (Usuario)
        logger.info("6. Eliminando usuario con ID: {}", usuarioId);
        usuarioRepository.delete(usuario);

        logger.info("=== USUARIO Y TODOS SUS DATOS ELIMINADOS CORRECTAMENTE ===");
        return true;
    }

    /**
     * Permite a un usuario autenticado eliminar su propia cuenta.
     *
     * @param authUser usuario autenticado
     * @param username usuario objetivo
     * @return true si la eliminación fue exitosa
     * @throws RuntimeException si intenta borrar otra cuenta
     */
    public boolean borrarMiCuenta(String authUser, String username) {

        if (!authUser.equals(username)) {
            throw new RuntimeException("No puedes borrar otra cuenta");
        }

        return borrarUsuario(username);
    }

    /**
     * Permite a un usuario autenticado actualizar su propio perfil.
     *
     * @param authUser usuario autenticado
     * @param dto datos a actualizar
     * @return UsuarioUpdateDTO actualizado
     * @throws RuntimeException si intenta modificar otro usuario
     */
    public UsuarioUpdateDTO actualizarMiPerfil(String authUser, UsuarioUpdateDTO dto) {

        if (!authUser.equals(dto.getUsername())) {
            throw new RuntimeException("No puedes modificar otro usuario");
        }

        return actualizarUsuario(dto);
    }

    /**
     * Obtiene la información pública del perfil de un usuario.
     *
     * @param username nombre del usuario
     * @return datos del perfil en formato DTO
     * @throws NoEncontradoException si el usuario no existe
     */
    public UsuarioPerfilDTO obtenerPerfil(String username) {

        Usuario u = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new NoEncontradoException("Usuario no encontrado"));

        return new UsuarioPerfilDTO(
                u.getNombre(),
                u.getApellido(),
                u.getEmail(),
                u.getUsername(),
                u.getRoles().name()
        );
    }
}