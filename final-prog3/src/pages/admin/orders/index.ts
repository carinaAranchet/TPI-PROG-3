import type { Pedido, EstadoPedido } from "../../../types";
import { getPedidosStore, savePedidosStore, getUsuariosStore, getProductosStore, } from "../../../utils/dataStore";
import { getUsuarioLogueado, logout } from "../../../utils/auth";


async function cargarPedidos(): Promise<Pedido[]> {
  return await getPedidosStore();
}

function guardarPedidos(pedidos: Pedido[]) {
  savePedidosStore(pedidos);
}

export async function renderAdminOrders() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const usuarioLogueado = getUsuarioLogueado();

  let pedidos = await cargarPedidos();
  const usuarios = await getUsuariosStore();
  const productos = await getProductosStore();

  function getUsuarioNombre(id: number) {
    const u = usuarios.find((user) => user.id === id);
    return u ? `${u.nombre} ${u.apellido}` : "Usuario no encontrado";
  }

  function getProductoNombre(id: number) {
    return productos.find((p) => p.id === id)?.nombre ?? `Producto ID ${id}`;
  }

  function render(filtroEstado = "") {
    const pedidosFiltrados = filtroEstado
      ? pedidos.filter((p) => p.estado === filtroEstado)
      : pedidos;

    app.innerHTML = `
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goStore">Tienda</button>
          <button id="goDashboard">Panel Admin</button>
          <span class="nav-user">${usuarioLogueado?.nombre ?? ""} ${usuarioLogueado?.apellido ?? ""}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="admin-layout">
        <aside class="admin-sidebar">
          <h3>Administración</h3>
          <p class="sidebar-subtitle">Panel de control</p>
          <button id="goDashboardSide">📊 Dashboard</button>
          <button id="goCategoriesSide">📁 Categorías</button>
          <button id="goProductsSide">🍔 Productos</button>
          <button class="active-admin-link" id="goOrdersSide">📦 Pedidos</button>
          <button id="goStoreSide">🏪 Ir Tienda</button>
        </aside>

        <section class="admin-content">
          <div class="admin-header">
            <h2>Gestión de Pedidos</h2>

            <select id="estadoFiltro" class="filter-select">
              <option value="">Todos los pedidos</option>
              <option value="PENDIENTE" ${filtroEstado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
              <option value="CONFIRMADO" ${filtroEstado === "CONFIRMADO" ? "selected" : ""}>Confirmado</option>
              <option value="TERMINADO" ${filtroEstado === "TERMINADO" ? "selected" : ""}>Terminado</option>
              <option value="CANCELADO" ${filtroEstado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
            </select>
          </div>

          <div class="orders-list">
            ${
              pedidosFiltrados.length === 0
                ? `<p class="empty-msg">No hay pedidos para mostrar.</p>`
                : pedidosFiltrados
                    .sort((a, b) => b.id - a.id)
                    .map(
                      (pedido) => `
                        <article class="order-card">
                          <div class="order-card-header">
                            <div>
                              <h3>Pedido #ORD-${pedido.id}</h3>
                              <p>Cliente: ${getUsuarioNombre(pedido.idUsuario)}</p>
                              <p class="order-date">📅 ${pedido.fecha}</p>
                              <p>${pedido.detalles.length} producto(s)</p>
                            </div>
                            <div class="order-card-right">
                              <span class="status-badge status-${pedido.estado.toLowerCase()}">${pedido.estado}</span>
                              <strong class="order-total">$${pedido.total.toLocaleString("es-AR")}</strong>
                            </div>
                          </div>
                          <div class="order-actions">
                            <button class="detail-btn" data-id="${pedido.id}">Ver detalle</button>
                          </div>
                        </article>
                      `
                    )
                    .join("")
            }
          </div>
        </section>
      </main>

      <div id="modalContainer"></div>
    `;

    conectarNavegacion();

    document.querySelector("#estadoFiltro")?.addEventListener("change", (e) => {
      const value = (e.target as HTMLSelectElement).value;
      render(value);
    });

    document.querySelectorAll<HTMLButtonElement>(".detail-btn").forEach((btn) => {
      btn.addEventListener("click", () => abrirDetalle(Number(btn.dataset.id)));
    });
  }

  function conectarNavegacion() {
    document.querySelector("#goStore")?.addEventListener("click", () => location.hash = "#/home");
    document.querySelector("#goStoreSide")?.addEventListener("click", () => location.hash = "#/home");
    document.querySelector("#goDashboard")?.addEventListener("click", () => location.hash = "#/admin");
    document.querySelector("#goDashboardSide")?.addEventListener("click", () => location.hash = "#/admin");
    document.querySelector("#goCategoriesSide")?.addEventListener("click", () => location.hash = "#/admin/categories");
    document.querySelector("#goProductsSide")?.addEventListener("click", () => location.hash = "#/admin/products");
    document.querySelector("#goOrdersSide")?.addEventListener("click", () => location.hash = "#/admin/orders");

    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      logout();
      location.hash = "#/login";
    });
  }

  function abrirDetalle(id: number) {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    const subtotal = pedido.detalles.reduce((acc, d) => acc + d.subtotal, 0);
    const envio = pedido.total - subtotal;

    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Detalle del Pedido #ORD-${pedido.id}</h2>
            <button id="closeModal" class="modal-close">✕</button>
          </div>

          <div class="modal-detail-info">
            <p><strong>Cliente:</strong> ${getUsuarioNombre(pedido.idUsuario)}</p>
            <p><strong>Fecha:</strong> ${pedido.fecha}</p>
            <p><strong>Teléfono:</strong> ${usuarios.find(u => u.id === pedido.idUsuario)?.celular || "No disponible"}</p>
            <p><strong>Método de pago:</strong> ${pedido.formaPago}</p>
          </div>

          <hr />

          <h3>Productos:</h3>
          ${pedido.detalles
            .map(
              (d) => `
                <div class="order-product-row">
                  <span>${getProductoNombre(d.idProducto)}</span>
                  <span>Cantidad: ${d.cantidad}</span>
                  <strong>$${d.subtotal.toLocaleString("es-AR")}</strong>
                </div>
              `
            )
            .join("")}

          <div class="order-totals">
            <p><span>Subtotal:</span> <strong>$${subtotal.toLocaleString("es-AR")}</strong></p>
            <p><span>Envío:</span> <strong>$${envio.toLocaleString("es-AR")}</strong></p>
            <p class="order-total-final"><span>Total:</span> <strong>$${pedido.total.toLocaleString("es-AR")}</strong></p>
          </div>

          <hr />

          <form id="estadoForm">
            <label>Cambiar Estado:</label>
            <select id="nuevoEstado">
              <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>PENDIENTE</option>
              <option value="CONFIRMADO" ${pedido.estado === "CONFIRMADO" ? "selected" : ""}>CONFIRMADO</option>
              <option value="TERMINADO" ${pedido.estado === "TERMINADO" ? "selected" : ""}>TERMINADO</option>
              <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>CANCELADO</option>
            </select>

            <button type="submit" class="btn-primary btn-block">Actualizar Estado</button>
          </form>
        </section>
      </div>
    `;

    document.querySelector("#closeModal")?.addEventListener("click", cerrarModal);

    document.querySelector<HTMLFormElement>("#estadoForm")!.addEventListener("submit", (e) => {
      e.preventDefault();

      const nuevoEstado = document.querySelector<HTMLSelectElement>("#nuevoEstado")!
        .value as EstadoPedido;

      pedido.estado = nuevoEstado;
      guardarPedidos(pedidos);
      cerrarModal();
      render();
    });
  }

  function cerrarModal() {
    document.querySelector<HTMLDivElement>("#modalContainer")!.innerHTML = "";
  }

  render();
}