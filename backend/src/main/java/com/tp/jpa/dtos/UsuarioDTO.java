package com.tp.jpa.dtos;

public record UsuarioDTO(
        String nombre,
        String apellido,
        String mail,
        String celular
) {
}
