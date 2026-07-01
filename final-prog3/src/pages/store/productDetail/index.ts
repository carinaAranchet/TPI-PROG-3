import type { Categoria, Producto } from "../../../types";
import { getCategoriasStore, getProductosStore } from "../../../utils/dataStore";
import { addToCart } from "../../../utils/cart";

export async function renderProductDetail(id: number) {
  const app = document.querySelector<HTMLDivElement>("#app")!;

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
      <h1>Food Store</h1>
      <nav>
        <button id="backHome">Volver</button>
        <button id="goCart">Carrito</button>
      </nav>
    </header>

    <main class="detail-page">
      <section class="detail-card">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="detail-img" />

        <div class="detail-info">
          <span class="badge">${producto.disponible ? "Disponible" : "No disponible"}</span>
          <h2>${producto.nombre}</h2>
          <p>${producto.descripcion}</p>

          <p><strong>Categoría:</strong> ${categoria?.nombre ?? "Sin categoría"}</p>
          <p><strong>Stock:</strong> ${producto.stock}</p>

          <h3>$${producto.precio}</h3>

          <label>Cantidad</label>
          <input type="number" id="cantidad" min="1" max="${producto.stock}" value="1" />

          <button id="addCart" class="btn-primary">
            Agregar al carrito
          </button>

          <p id="message" class="success-message"></p>
        </div>
      </section>
    </main>
  `;

  const cantidadInput = document.querySelector<HTMLInputElement>("#cantidad")!;
  const message = document.querySelector<HTMLParagraphElement>("#message")!;
  const addBtn = document.querySelector<HTMLButtonElement>("#addCart")!;

  if (!producto.disponible || producto.stock <= 0) {
    addBtn.disabled = true;
    addBtn.textContent = "Producto no disponible";
  }

  document.querySelector("#backHome")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#goCart")?.addEventListener("click", () => {
    location.hash = "#/cart";
  });

  addBtn.addEventListener("click", () => {
    const cantidad = Number(cantidadInput.value);

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