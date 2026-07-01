import type { FormaPago, Pedido } from "../../../types";
import { getUsuarioLogueado } from "../../../utils/auth";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
} from "../../../utils/cart";

const ENVIO = 0;

export function renderCart() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const cart = getCart();
  const usuario = getUsuarioLogueado();

  if (cart.length === 0) {
    app.innerHTML = `
      <header class="topbar">
        <h1>Food Store</h1>
        <nav>
          <button id="backHome">Volver a tienda</button>
        </nav>
      </header>

      <main class="page-container">
        <section class="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos desde el catálogo.</p>
          <button id="goHome" class="btn-primary">Ir a la tienda</button>
        </section>
      </main>
    `;

    document.querySelector("#backHome")?.addEventListener("click", () => {
      location.hash = "#/home";
    });

    document.querySelector("#goHome")?.addEventListener("click", () => {
      location.hash = "#/home";
    });

    return;
  }

  const subtotal = getCartTotal();
  const total = subtotal + ENVIO;

  app.innerHTML = `
    <header class="topbar">
      <h1>Food Store</h1>
      <nav>
        <button id="backHome">Volver</button>
        <button id="clearCart">Vaciar carrito</button>
      </nav>
    </header>

    <main class="cart-page">
      <section class="cart-list">
        <h2>Carrito de compras</h2>

        ${cart
          .map(
            (item) => `
              <article class="cart-item">
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}" />
                <div>
                  <h3>${item.producto.nombre}</h3>
                  <p>$${item.producto.precio} c/u</p>
                  <p>Stock disponible: ${item.producto.stock}</p>
                </div>

                <div class="quantity-control">
                  <button class="qty-btn" data-action="minus" data-id="${item.producto.id}">-</button>
                  <span>${item.cantidad}</span>
                  <button class="qty-btn" data-action="plus" data-id="${item.producto.id}">+</button>
                </div>

                <strong>$${item.producto.precio * item.cantidad}</strong>

                <button class="remove-btn" data-id="${item.producto.id}">Eliminar</button>
              </article>
            `
          )
          .join("")}
      </section>

      <aside class="checkout-card">
        <h2>Resumen</h2>

        <p>Subtotal: <strong>$${subtotal}</strong></p>
        <p>Envío: <strong>$${ENVIO}</strong></p>
        <hr />
        <p>Total: <strong>$${total}</strong></p>

        <form id="checkoutForm">
          <label>Teléfono</label>
          <input type="text" id="telefono" required value="${usuario?.celular ?? ""}" />

          <label>Forma de pago</label>
          <select id="formaPago" required>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
          </select>

          <button type="submit" class="btn-primary">Confirmar pedido</button>
        </form>

        <p id="message" class="success-message"></p>
      </aside>
    </main>
  `;

  document.querySelector("#backHome")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#clearCart")?.addEventListener("click", () => {
    clearCart();
    renderCart();
  });

  document.querySelectorAll<HTMLButtonElement>(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.id));
      renderCart();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const item = getCart().find((i) => i.producto.id === id);

      if (!item) return;

      const nuevaCantidad =
        action === "plus" ? item.cantidad + 1 : item.cantidad - 1;

      updateQuantity(id, nuevaCantidad);
      renderCart();
    });
  });

  document.querySelector<HTMLFormElement>("#checkoutForm")!.addEventListener("submit", (e) => {
    e.preventDefault();

    const formaPago = document.querySelector<HTMLSelectElement>("#formaPago")!
      .value as FormaPago;

    const pedidosGuardados = localStorage.getItem("pedidos");
    const pedidos: Pedido[] = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];

    const nuevoPedido: Pedido = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      estado: "PENDIENTE",
      formaPago,
      total,
      idUsuario: usuario!.id,
      detalles: cart.map((item) => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad,
      })),
    };

    pedidos.push(nuevoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    clearCart();

    location.hash = "#/my-orders";
  });
}