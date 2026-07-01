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

    <main class="store-layout">
      <aside class="sidebar">
        <h3>Categorías</h3>
        <p class="sidebar-subtitle">Filtrar por categoría</p>
        <button class="category-btn active" data-id="0">🍔 Todos los productos</button>
        ${categorias
          .map(
            (c) => `
              <button class="category-btn" data-id="${c.id}">
                🍔 ${c.nombre}
              </button>
            `
          )
          .join("")}
      </aside>

      <section class="catalog">
        <div class="catalog-header">
          <h2 id="catalogTitle">Todos los Productos</h2>

          <div class="filters">
            <input id="searchInput" placeholder="🔍 Buscar productos..." />
            <select id="sortSelect">
              <option value="">Ordenar por</option>
              <option value="az">Nombre A-Z</option>
              <option value="za">Nombre Z-A</option>
              <option value="priceAsc">Precio menor a mayor</option>
              <option value="priceDesc">Precio mayor a menor</option>
            </select>
            <select id="catFilter">
              <option value="0">Todos</option>
              ${categorias.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}
            </select>
          </div>
        </div>

        <p class="products-count" id="productsCount">${productos.length} productos</p>

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
  const catFilter = document.querySelector<HTMLSelectElement>("#catFilter")!;
  const catalogTitle = document.querySelector<HTMLHeadingElement>("#catalogTitle")!;
  const productsCount = document.querySelector<HTMLParagraphElement>("#productsCount")!;

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

    if (orden === "az") filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (orden === "za") filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    if (orden === "priceAsc") filtrados.sort((a, b) => a.precio - b.precio);
    if (orden === "priceDesc") filtrados.sort((a, b) => b.precio - a.precio);

    productsCount.textContent = `${filtrados.length} productos`;

    if (filtrados.length === 0) {
      grid.innerHTML = `<p class="empty-msg">No hay productos disponibles.</p>`;
      return;
    }

    grid.innerHTML = filtrados
      .map(
        (p) => {
          const cat = categorias.find((c) => c.id === p.categoriaId);
          return `
            <article class="product-card">
              <img src="${p.imagen}" alt="${p.nombre}" />
              <div class="product-card-body">
                <span class="badge">${cat?.nombre ?? "General"}</span>
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <strong>$${p.precio.toLocaleString("es-AR")}</strong>
                <button class="btn-add-cart" data-id="${p.id}">Agregar</button>
              </div>
            </article>
          `;
        }
      )
      .join("");

    document.querySelectorAll<HTMLButtonElement>(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        location.hash = `#/product/${id}`;
      });
    });

    document.querySelectorAll<HTMLElement>(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const btn = card.querySelector<HTMLButtonElement>(".btn-add-cart");
        if (btn) location.hash = `#/product/${btn.dataset.id}`;
      });
    });
  }

  document.querySelectorAll<HTMLButtonElement>(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      categoriaSeleccionada = Number(btn.dataset.id);
      catFilter.value = String(categoriaSeleccionada);

      const catNombre = categoriaSeleccionada === 0
        ? "Todos los Productos"
        : categorias.find((c) => c.id === categoriaSeleccionada)?.nombre ?? "Productos";
      catalogTitle.textContent = catNombre;

      pintarProductos();
    });
  });

  catFilter.addEventListener("change", () => {
    categoriaSeleccionada = Number(catFilter.value);
    document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
    const activeBtn = document.querySelector<HTMLButtonElement>(`.category-btn[data-id="${categoriaSeleccionada}"]`);
    activeBtn?.classList.add("active");

    const catNombre = categoriaSeleccionada === 0
      ? "Todos los Productos"
      : categorias.find((c) => c.id === categoriaSeleccionada)?.nombre ?? "Productos";
    catalogTitle.textContent = catNombre;

    pintarProductos();
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

  pintarProductos();
}