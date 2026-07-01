import type { Categoria, Producto } from "../../../types";
import { getCategoriasStore, getProductosStore } from "../../../utils/dataStore";
import { logout, getUsuarioLogueado } from "../../../utils/auth";
import { getCart } from "../../../utils/cart";

export async function renderHome() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const usuario = getUsuarioLogueado();

const categorias = (await getCategoriasStore()).filter((c) => !c.eliminado);

const productos = (await getProductosStore()).filter(
  (p) => p.disponible && !p.eliminado
);

  app.innerHTML = `
    <header class="topbar">
      <h1>Food Store</h1>
      <nav>
        <button id="goOrders">Mis pedidos</button>
        <button id="goCart">Carrito (${getCart().length})</button>
        <button id="logoutBtn">Salir</button>
      </nav>
    </header>

    <main class="store-layout">
      <aside class="sidebar">
        <h3>Categorías</h3>
        <button class="category-btn active" data-id="0">Todas</button>
        ${categorias
          .map(
            (c) => `
              <button class="category-btn" data-id="${c.id}">
                ${c.nombre}
              </button>
            `
          )
          .join("")}
      </aside>

      <section class="catalog">
        <div class="catalog-header">
          <div>
            <h2>Hola, ${usuario?.nombre}</h2>
            <p>Elegí tus productos favoritos</p>
          </div>

          <div class="filters">
            <input id="searchInput" placeholder="Buscar producto..." />
            <select id="sortSelect">
              <option value="">Ordenar</option>
              <option value="az">Nombre A-Z</option>
              <option value="za">Nombre Z-A</option>
              <option value="priceAsc">Precio menor a mayor</option>
              <option value="priceDesc">Precio mayor a menor</option>
            </select>
          </div>
        </div>

        <div id="productsGrid" class="products-grid"></div>
      </section>
    </main>
  `;

  let categoriaSeleccionada = 0;
  let busqueda = "";
  let orden = "";

  const grid = document.querySelector<HTMLDivElement>("#productsGrid")!;
  const searchInput = document.querySelector<HTMLInputElement>("#searchInput")!;
  const sortSelect = document.querySelector<HTMLSelectElement>("#sortSelect")!;

  function pintarProductos() {
    let filtrados = [...productos];

    if (categoriaSeleccionada !== 0) {
      filtrados = filtrados.filter((p) => p.categoriaId === categoriaSeleccionada);
    }

    if (busqueda.trim() !== "") {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (orden === "az") {
      filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    if (orden === "za") {
      filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    if (orden === "priceAsc") {
      filtrados.sort((a, b) => a.precio - b.precio);
    }

    if (orden === "priceDesc") {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    if (filtrados.length === 0) {
      grid.innerHTML = `<p>No hay productos disponibles.</p>`;
      return;
    }

    grid.innerHTML = filtrados
      .map(
        (p) => `
          <article class="product-card" data-id="${p.id}">
            <img src="${p.imagen}" alt="${p.nombre}" />
            <div>
              <span class="badge">Disponible</span>
              <h3>${p.nombre}</h3>
              <p>${p.descripcion}</p>
              <strong>$${p.precio}</strong>
            </div>
          </article>
        `
      )
      .join("");

    document.querySelectorAll<HTMLElement>(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        location.hash = `#/product/${id}`;
      });
    });
  }

  document.querySelectorAll<HTMLButtonElement>(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");
      categoriaSeleccionada = Number(btn.dataset.id);
      pintarProductos();
    });
  });

  searchInput.addEventListener("input", () => {
    busqueda = searchInput.value;
    pintarProductos();
  });

  sortSelect.addEventListener("change", () => {
    orden = sortSelect.value;
    pintarProductos();
  });

  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    logout();
    location.hash = "#/login";
  });

  document.querySelector("#goCart")?.addEventListener("click", () => {
    location.hash = "#/cart";
  });

  document.querySelector("#goOrders")?.addEventListener("click", () => {
    location.hash = "#/my-orders";
  });

  pintarProductos();
}