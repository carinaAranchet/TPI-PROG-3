import type { Producto } from "../types";

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

const KEY = "carrito";

export function getCart(): CartItem[] {
  const cart = localStorage.getItem(KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(KEY);
}

export function addToCart(producto: Producto, cantidad: number) {
  const cart = getCart();
  const item = cart.find((i) => i.producto.id === producto.id);

  if (item) {
    const nuevaCantidad = item.cantidad + cantidad;
    item.cantidad = Math.min(nuevaCantidad, producto.stock);
  } else {
    cart.push({ producto, cantidad });
  }

  saveCart(cart);
}

export function removeFromCart(productoId: number) {
  const cart = getCart().filter((item) => item.producto.id !== productoId);
  saveCart(cart);
}

export function updateQuantity(productoId: number, cantidad: number) {
  const cart = getCart();

  const item = cart.find((i) => i.producto.id === productoId);

  if (!item) return;

  if (cantidad <= 0) {
    removeFromCart(productoId);
    return;
  }

  item.cantidad = Math.min(cantidad, item.producto.stock);
  saveCart(cart);
}

export function getCartCount(): number {
  return getCart().reduce((acc, item) => acc + item.cantidad, 0);
}

export function getCartTotal(): number {
  return getCart().reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );
}