import type { Categoria, Pedido, Producto } from "../../../types";
import { getCategoriasStore, getPedidosStore, getProductosStore } from "../../../utils/dataStore";
import { logout } from "../../../utils/auth";

export async function renderAdminHome() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  const categorias = await getCategoriasStore();
  const productos = await getProductosStore();
  const pedidos = await getPedidosStore();

  const categoriasActivas = categorias.filter(c => !c.eliminado).length;
  const productosActivos = productos.filter(p => !p.eliminado).length;
  const productosDisponibles = productos.filter(p => p.disponible && !p.eliminado).length;

  app.innerHTML = `
    <header class="topbar">
      <h1>Food Store Admin</h1>
      <nav>
        <button id="goStore">Ver tienda</button>
        <button id="logoutBtn">Salir</button>
      </nav>
    </header>

    <main class="admin-layout">
      <aside class="admin-sidebar">
        <h3>Panel</h3>
        <button id="goDashboard">Dashboard</button>
        <button id="goCategories">Categorías</button>
        <button id="goProducts">Productos</button>
        <button id="goOrders">Pedidos</button>
      </aside>

      <section class="admin-content">
        <h2>Dashboard</h2>

        <div class="stats-grid">
          <article class="stat-card">
            <h3>${categorias.length}</h3>
            <p>Total categorías</p>
          </article>

          <article class="stat-card">
            <h3>${productos.length}</h3>
            <p>Total productos</p>
          </article>

          <article class="stat-card">
            <h3>${pedidos.length}</h3>
            <p>Total pedidos</p>
          </article>

          <article class="stat-card">
            <h3>${productosDisponibles}</h3>
            <p>Productos disponibles</p>
          </article>
        </div>

        <section class="admin-summary">
          <h3>Resumen del sistema</h3>
          <p>Categorías activas: ${categoriasActivas}</p>
          <p>Productos activos: ${productosActivos}</p>
          <p>Pedidos pendientes: ${pedidos.filter(p => p.estado === "PENDIENTE").length}</p>
          <p>Pedidos confirmados: ${pedidos.filter(p => p.estado === "CONFIRMADO").length}</p>
          <p>Pedidos terminados: ${pedidos.filter(p => p.estado === "TERMINADO").length}</p>
          <p>Pedidos cancelados: ${pedidos.filter(p => p.estado === "CANCELADO").length}</p>
        </section>
      </section>
    </main>
  `;

  document.querySelector("#goStore")?.addEventListener("click", () => location.hash = "#/home");
  document.querySelector("#goDashboard")?.addEventListener("click", () => location.hash = "#/admin");
  document.querySelector("#goCategories")?.addEventListener("click", () => location.hash = "#/admin/categories");
  document.querySelector("#goProducts")?.addEventListener("click", () => location.hash = "#/admin/products");
  document.querySelector("#goOrders")?.addEventListener("click", () => location.hash = "#/admin/orders");

  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    logout();
    location.hash = "#/login";
  });
}