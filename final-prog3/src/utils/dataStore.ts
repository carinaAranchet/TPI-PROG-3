import type { Categoria, Pedido, Producto, Usuario } from "../types";
import { getData } from "./api";

export async function getCategoriasStore(): Promise<Categoria[]> {
  const local = localStorage.getItem("categorias");

  if (local) return JSON.parse(local);

  const categorias = await getData<Categoria>("categorias.json");
  localStorage.setItem("categorias", JSON.stringify(categorias));

  return categorias;
}

export function saveCategoriasStore(categorias: Categoria[]) {
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

export async function getProductosStore(): Promise<Producto[]> {
  const local = localStorage.getItem("productos");

  if (local) return JSON.parse(local);

  const productos = await getData<Producto>("productos.json");
  localStorage.setItem("productos", JSON.stringify(productos));

  return productos;
}

export function saveProductosStore(productos: Producto[]) {
  localStorage.setItem("productos", JSON.stringify(productos));
}

export async function getUsuariosStore(): Promise<Usuario[]> {
  const local = localStorage.getItem("usuarios");

  if (local) return JSON.parse(local);

  const usuarios = await getData<Usuario>("usuarios.json");
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  return usuarios;
}

export function saveUsuariosStore(usuarios: Usuario[]) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

export async function getPedidosStore(): Promise<Pedido[]> {
  const local = localStorage.getItem("pedidos");

  if (local) return JSON.parse(local);

  const pedidos = await getData<Pedido>("pedidos.json");
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  return pedidos;
}

export function savePedidosStore(pedidos: Pedido[]) {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}