import type { Usuario } from "../types";

const KEY = "usuarioLogueado";

export function login(usuario: Usuario) {
  localStorage.setItem(KEY, JSON.stringify(usuario));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getUsuarioLogueado(): Usuario | null {
  const usuario = localStorage.getItem(KEY);

  if (!usuario) return null;

  return JSON.parse(usuario);
}

export function estaLogueado(): boolean {
  return getUsuarioLogueado() !== null;
}