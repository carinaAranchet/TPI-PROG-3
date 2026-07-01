import { getCategoriasStore, getProductosStore } from "../../../utils/dataStore";
import { addToCart } from "../../../utils/cart";
import { getUsuarioLogueado, logout } from "../../../utils/auth";
import { getCart } from "../../../utils/cart";

export async function renderProductDetail(id: number) {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const usuario = getUsuarioLogueado();

  const productos = await getProductosStore();
  const categorias = await getCategoriasStore();

  const producto = productos.find((p) => p.id === id && !p.eliminado);

  if (!producto) {
    app.innerHTML = `
      <main class="page-container">
        <h2>Producto no encontrado</h2>
        <button id="backHome" class="btn-primary">Volver al catálogo</button>
      </main>
    `;

    document.querySelector("#backHome")?.addEventListener("click", () => {
      location.hash = "#/home";
    });

    return;
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId);

  app.innerHTML = `
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goHome">Inicio</button>
        <button id="goOrders">Mis Pedidos</button>
        ${usuario?.rol === "ADMIN" ? '<button id="goAdmin">Administración</button>' : ""}
        <button id="goCart">🛒 Cart <span class="cart-badge">${getCart().length}</span></button>
        <span class="nav-user">${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="detail-page">
      <section class="detail-card">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="detail-img" />

        <div class="detail-info">
          <h2>${producto.nombre}</h2>
          <h3 class="detail-price">$${producto.precio.toLocaleString("es-AR")}</h3>
          <span class="badge">${categoria?.nombre ?? "General"}</span>
          <p class="detail-desc">${producto.descripcion}</p>

          <div class="detail-quantity">
            <label>Cantidad</label>
            <div class="quantity-control">
              <button id="qtyMinus">−</button>
              <span id="qtyValue">1</span>
              <button id="qtyPlus">+</button>
            </div>
          </div>

          <div class="detail-actions">
            <button id="addCart" class="btn-primary">Agregar al Carrito</button>
            <button id="backHome" class="btn-outline">Volver</button>
          </div>

          <p id="message" class="success-message"></p>
        </div>
      </section>
    </main>
  `;

  let cantidad = 1;
  const qtyValue = document.querySelector<HTMLSpanElement>("#qtyValue")!;
  const message = document.querySelector<HTMLParagraphElement>("#message")!;
  const addBtn = document.querySelector<HTMLButtonElement>("#addCart")!;

  if (!producto.disponible || producto.stock <= 0) {
    addBtn.disabled = true;
    addBtn.textContent = "Producto no disponible";
  }

  document.querySelector("#qtyMinus")?.addEventListener("click", () => {
    if (cantidad > 1) {
      cantidad--;
      qtyValue.textContent = String(cantidad);
    }
  });

  document.querySelector("#qtyPlus")?.addEventListener("click", () => {
    if (cantidad < producto.stock) {
      cantidad++;
      qtyValue.textContent = String(cantidad);
    }
  });

  document.querySelector("#backHome")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#goHome")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#goCart")?.addEventListener("click", () => {
    location.hash = "#/cart";
  });

  document.querySelector("#goOrders")?.addEventListener("click", () => {
    location.hash = "#/my-orders";
  });

  document.querySelector("#goAdmin")?.addEventListener("click", () => {
    location.hash = "#/admin";
  });

  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    logout();
    location.hash = "#/login";
  });

  addBtn.addEventListener("click", () => {
    if (cantidad <= 0) {
      message.textContent = "La cantidad debe ser mayor a 0.";
      return;
    }

    if (cantidad > producto.stock) {
      message.textContent = "No hay stock suficiente.";
      return;
    }

    addToCart(producto, cantidad);
    message.textContent = "Producto agregado al carrito correctamente.";
  });
}