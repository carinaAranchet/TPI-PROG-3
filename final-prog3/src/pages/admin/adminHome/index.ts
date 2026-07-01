import type { Categoria, Pedido, Producto } from "../../../types";
import {
  getCategoriasStore,
  getPedidosStore,
  getProductosStore,
} from "../../../utils/dataStore";
import { getUsuarioLogueado, logout } from "../../../utils/auth";

export async function renderAdminHome() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const usuario = getUsuarioLogueado();

  const categorias: Categoria[] = await getCategoriasStore();
  const productos: Producto[] = await getProductosStore();
  const pedidos: Pedido[] = await getPedidosStore();

  const categoriasActivas = categorias.filter((c) => !c.eliminado).length;
  const productosActivos = productos.filter((p) => !p.eliminado).length;
  const productosDisponibles = productos.filter(
    (p) => p.disponible && !p.eliminado
  ).length;

  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "PENDIENTE"
  ).length;
  const pedidosConfirmados = pedidos.filter(
    (p) => p.estado === "CONFIRMADO"
  ).length;
  const pedidosTerminados = pedidos.filter(
    (p) => p.estado === "TERMINADO"
  ).length;
  const pedidosCancelados = pedidos.filter(
    (p) => p.estado === "CANCELADO"
  ).length;

  app.innerHTML = `
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goStore">Tienda</button>
        <button id="goDashboard">Panel Admin</button>
        <span class="nav-user">${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="admin-layout">
      <aside class="admin-sidebar">
        <h3>Administración</h3>
        <p class="sidebar-subtitle">Panel de control</p>

        <button class="active-admin-link" id="goDashboardSide">📊 Dashboard</button>
        <button id="goCategories">📁 Categorías</button>
        <button id="goProducts">🍔 Productos</button>
        <button id="goOrders">📦 Pedidos</button>
        <button id="goStoreSide">🏪 Ir Tienda</button>
      </aside>

      <section class="admin-content">
        <h2 class="dashboard-title">Panel de Administración</h2>

        <div class="dashboard-cards">
          <article class="dashboard-card card-categories">
            <h3>📁 Categorías</h3>
            <strong>${categoriasActivas}</strong>
            <button id="manageCategories">Gestionar</button>
          </article>

          <article class="dashboard-card card-products">
            <h3>🍔 Productos</h3>
            <strong>${productosActivos}</strong>
            <button id="manageProducts">Gestionar</button>
          </article>

          <article class="dashboard-card card-orders">
            <h3>📦 Pedidos</h3>
            <strong>${pedidos.length}</strong>
            <button id="manageOrders">Gestionar</button>
          </article>

          <article class="dashboard-card card-available">
            <h3>✅ Disponibles</h3>
            <strong>${productosDisponibles}</strong>
            <span>Productos activos</span>
          </article>
        </div>

        <section class="quick-summary">
          <h3>📊 Resumen Rápido</h3>
          <div class="summary-grid">
            <article class="summary-item">
              <span>Categorías activas</span>
              <strong>${categoriasActivas}</strong>
            </article>
            <article class="summary-item">
              <span>Productos activos</span>
              <strong>${productosActivos}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos pendientes</span>
              <strong>${pedidosPendientes}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos confirmados</span>
              <strong>${pedidosConfirmados}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos terminados</span>
              <strong>${pedidosTerminados}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos cancelados</span>
              <strong>${pedidosCancelados}</strong>
            </article>
          </div>
        </section>
      </section>
    </main>
  `;

  document.querySelector("#goStore")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#goStoreSide")?.addEventListener("click", () => {
    location.hash = "#/home";
  });

  document.querySelector("#goDashboard")?.addEventListener("click", () => {
    location.hash = "#/admin";
  });

  document.querySelector("#goDashboardSide")?.addEventListener("click", () => {
    location.hash = "#/admin";
  });

  document.querySelector("#goCategories")?.addEventListener("click", () => {
    location.hash = "#/admin/categories";
  });

  document.querySelector("#goProducts")?.addEventListener("click", () => {
    location.hash = "#/admin/products";
  });

  document.querySelector("#goOrders")?.addEventListener("click", () => {
    location.hash = "#/admin/orders";
  });

  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    logout();
    location.hash = "#/login";
  });

  document.querySelector("#manageCategories")?.addEventListener("click", () => {
    location.hash = "#/admin/categories";
  });

  document.querySelector("#manageProducts")?.addEventListener("click", () => {
    location.hash = "#/admin/products";
  });

  document.querySelector("#manageOrders")?.addEventListener("click", () => {
    location.hash = "#/admin/orders";
  });
}