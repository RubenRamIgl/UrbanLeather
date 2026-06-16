package backend.security;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Autowired
    private RsaKeyProperties rsaKeys;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Autowired
    private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeys.publicKey()).build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        JWK jwk = new RSAKey.Builder(rsaKeys.publicKey())
                .privateKey(rsaKeys.privateKey())
                .build();

        JWKSource<SecurityContext> jwks =
                new ImmutableJWKSet<>(new JWKSet(jwk));

        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(AbstractHttpConfigurer::disable)
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults()))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/files/**").permitAll()

                        // AUTENTICACIÓN
                        .requestMatchers("/login", "/register").permitAll()


                        // USUARIO
                        .requestMatchers(HttpMethod.PUT, "/usuarioUpdate").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/usuarioDelete/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/borrarMiCuenta").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/updateMiPerfil").authenticated()


                        // PRODUCTOS
                        .requestMatchers(HttpMethod.GET, "/productos/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/productos").permitAll()
                        .requestMatchers(HttpMethod.POST, "/productoRegister").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/productoUpdate/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productoDelete/**").hasRole("ADMIN")


                        // CATEGORÍAS
                        .requestMatchers(HttpMethod.GET, "/categorias").permitAll()
                        .requestMatchers(HttpMethod.POST, "/categoriaRegister").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categoriaUpdate/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categoriaDelete/**").hasRole("ADMIN")


                        // TALLAS
                        .requestMatchers(HttpMethod.GET, "/tallas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/tallas/producto/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/tallaRegister").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/tallaUpdate/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/tallaDelete/**").hasRole("ADMIN")


                        // CARRITO
                        .requestMatchers("/carrito/**").authenticated()
                        .requestMatchers("/carrito/item/**").authenticated()


                        // COMPRAS
                        .requestMatchers("/compraRegister").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/eliminarCompra/**").hasRole("ADMIN")

                        .requestMatchers("/registerMiCompra").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/eliminarMiCompra/**").authenticated()
                        .requestMatchers("/misCompras").authenticated()


                        // DIRECCIONES
                        .requestMatchers(HttpMethod.POST, "/direccionRegister").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/direccionUpdate").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/eliminarDireccion/**").hasRole("ADMIN")

                        .requestMatchers("/registerMiDireccion").authenticated()
                        .requestMatchers("/updateMiDireccion").authenticated()
                        .requestMatchers("/deleteMiDireccion").authenticated()


                        // DETALLE COMPRA
                        .requestMatchers("/detalleCompra/misDetalles").authenticated()
                        .requestMatchers(HttpMethod.POST, "/detalleCompra/add").authenticated()
                        .requestMatchers(HttpMethod.GET, "/detalleCompra/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/detalleCompra/**").hasRole("ADMIN")


                        // RESTO
                        .anyRequest().authenticated()
                )
                .exceptionHandling(handling -> handling
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthorityPrefix("");
        converter.setAuthoritiesClaimName("roles");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);

        return jwtConverter;
    }
}