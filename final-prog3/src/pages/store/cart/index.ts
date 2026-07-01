import type { FormaPago, Pedido } from "../../../types";
import { getUsuarioLogueado, logout } from "../../../utils/auth";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeFromCart,
  updateQuantity,
} from "../../../utils/cart";

const ENVIO = 500;

export function renderCart() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const cart = getCart();
  const usuario = getUsuarioLogueado();

  if (cart.length === 0) {
    app.innerHTML = `
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goHome">Inicio</button>
          <button id="goOrders">Mis Pedidos</button>
          <span class="nav-user">${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="page-container">
        <section class="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos desde el catálogo.</p>
          <button id="goHome2" class="btn-primary">Ir a la tienda</button>
        </section>
      </main>
    `;

    document.querySelector("#goHome")?.addEventListener("click", () => location.hash = "#/home");
    document.querySelector("#goHome2")?.addEventListener("click", () => location.hash = "#/home");
    document.querySelector("#goOrders")?.addEventListener("click", () => location.hash = "#/my-orders");
    document.querySelector("#logoutBtn")?.addEventListener("click", () => { logout(); location.hash = "#/login"; });

    return;
  }

  const subtotal = getCartTotal();
  const total = subtotal + ENVIO;

  app.innerHTML = `
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goHome">Inicio</button>
        <button id="goOrders">Mis Pedidos</button>
        ${usuario?.rol === "ADMIN" ? '<button id="goAdmin">Administración</button>' : ""}
        <button id="goCart">🛒 Cart <span class="cart-badge">${cart.length}</span></button>
        <span class="nav-user">${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="cart-page">
      <section class="cart-list">
        <h2>Mi Carrito</h2>

        ${cart
          .map(
            (item) => `
              <article class="cart-item">
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}" />
                <div>
                  <h3>${item.producto.nombre}</h3>
                  <p>${item.producto.descripcion}</p>
                  <p class="cart-item-price">$${item.producto.precio.toLocaleString("es-AR")} c/u</p>
                </div>

                <div class="quantity-control">
                  <button class="qty-btn" data-action="minus" data-id="${item.producto.id}">−</button>
                  <span>${item.cantidad}</span>
                  <button class="qty-btn" data-action="plus" data-id="${item.producto.id}">+</button>
                </div>

                <strong class="cart-item-total">$${(item.producto.precio * item.cantidad).toLocaleString("es-AR")}</strong>

                <button class="remove-btn" data-id="${item.producto.id}">✕</button>
              </article>
            `
          )
          .join("")}
      </section>

      <aside class="checkout-card">
        <h2>Resumen del Pedido</h2>

        <p><span>Subtotal:</span> <strong>$${subtotal.toLocaleString("es-AR")}</strong></p>
        <p><span>Envío:</span> <strong>$${ENVIO.toLocaleString("es-AR")}</strong></p>
        <hr />
        <p class="checkout-total"><span>Total:</span> <strong>$${total.toLocaleString("es-AR")}</strong></p>

        <button id="openCheckout" class="btn-primary btn-block">Procesar el Pago</button>
        <button id="clearCart" class="btn-outline btn-block">Vaciar Carrito</button>
      </aside>
    </main>

    <div id="modalContainer"></div>
  `;

  document.querySelector("#goHome")?.addEventListener("click", () => location.hash = "#/home");
  document.querySelector("#goOrders")?.addEventListener("click", () => location.hash = "#/my-orders");
  document.querySelector("#goCart")?.addEventListener("click", () => location.hash = "#/cart");
  document.querySelector("#goAdmin")?.addEventListener("click", () => location.hash = "#/admin");
  document.querySelector("#logoutBtn")?.addEventListener("click", () => { logout(); location.hash = "#/login"; });

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

  document.querySelector("#openCheckout")?.addEventListener("click", () => {
    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Completar Pedido</h2>
            <button id="closeModal" class="modal-close">✕</button>
          </div>

          <form id="checkoutForm">
            <label>Teléfono</label>
            <input type="text" id="telefono" required placeholder="Ej: +54 221 1234567" value="${usuario?.celular ?? ""}" />

            <label>Dirección de Entrega</label>
            <input type="text" id="direccion" required placeholder="Calle, número, piso, depto" />

            <label>Método de Pago</label>
            <select id="formaPago" required>
              <option value="" disabled selected>Seleccione un método</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>

            <label>Notas adicionales (opcional)</label>
            <textarea id="notas" placeholder="Instrucciones especiales, timbre, etc."></textarea>

            <hr />
            <p class="checkout-total"><span>Total a pagar:</span> <strong>$${total.toLocaleString("es-AR")}</strong></p>

            <button type="submit" class="btn-primary btn-block">Confirmar Pedido</button>
          </form>
        </section>
      </div>
    `;

    document.querySelector("#closeModal")?.addEventListener("click", () => {
      modal.innerHTML = "";
    });

    document.querySelector<HTMLFormElement>("#checkoutForm")!.addEventListener("submit", (e) => {
      e.preventDefault();

      const formaPago = document.querySelector<HTMLSelectElement>("#formaPago")!.value as FormaPago;

      const pedidosGuardados = localStorage.getItem("pedidos");
      const pedidos: Pedido[] = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];

      const nuevoPedido: Pedido = {
        id: Date.now(),
        fecha: new Date().toLocaleString("es-AR"),
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
  });
}