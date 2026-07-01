import type { Pedido, Producto, Usuario, EstadoPedido } from "../../../types";
import { getPedidosStore, savePedidosStore, getUsuariosStore, getProductosStore, } from "../../../utils/dataStore";
import { logout } from "../../../utils/auth";


async function cargarPedidos(): Promise<Pedido[]> {
  return await getPedidosStore();
}

function guardarPedidos(pedidos: Pedido[]) {
  savePedidosStore(pedidos);
}

export async function renderAdminOrders() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

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
          <div class="admin-header">
            <div>
              <h2>Gestión de Pedidos</h2>
              <p>Listado, filtro por estado y cambio de estado.</p>
            </div>

            <select id="estadoFiltro">
              <option value="">Todos</option>
              <option value="PENDIENTE" ${filtroEstado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
              <option value="CONFIRMADO" ${filtroEstado === "CONFIRMADO" ? "selected" : ""}>Confirmado</option>
              <option value="TERMINADO" ${filtroEstado === "TERMINADO" ? "selected" : ""}>Terminado</option>
              <option value="CANCELADO" ${filtroEstado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
            </select>
          </div>

          <div class="orders-grid">
            ${
              pedidosFiltrados.length === 0
                ? `<p>No hay pedidos para mostrar.</p>`
                : pedidosFiltrados
                    .sort((a, b) => b.fecha.localeCompare(a.fecha))
                    .map(
                      (pedido) => `
                        <article class="order-card">
                          <h3>Pedido #${pedido.id}</h3>
                          <p><strong>Cliente:</strong> ${getUsuarioNombre(pedido.idUsuario)}</p>
                          <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                          <p><strong>Estado:</strong> <span class="status-badge">${pedido.estado}</span></p>
                          <p><strong>Productos:</strong> ${pedido.detalles.length}</p>
                          <p><strong>Total:</strong> $${pedido.total}</p>

                          <div class="order-actions">
                            <button class="detail-btn" data-id="${pedido.id}">Ver detalle</button>
                            <button class="edit-btn" data-id="${pedido.id}">Cambiar estado</button>
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

    document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => abrirCambioEstado(Number(btn.dataset.id)));
    });
  }

  function conectarNavegacion() {
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

  function abrirDetalle(id: number) {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <h2>Detalle Pedido #${pedido.id}</h2>

          <p><strong>Cliente:</strong> ${getUsuarioNombre(pedido.idUsuario)}</p>
          <p><strong>Fecha:</strong> ${pedido.fecha}</p>
          <p><strong>Estado:</strong> ${pedido.estado}</p>
          <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>

          <hr />

          <h3>Productos</h3>

          ${pedido.detalles
            .map(
              (d) => `
                <p>
                  ${getProductoNombre(d.idProducto)}
                  x ${d.cantidad}
                  — $${d.subtotal}
                </p>
              `
            )
            .join("")}

          <hr />

          <h3>Total: $${pedido.total}</h3>

          <div class="modal-actions">
            <button id="closeModal">Cerrar</button>
          </div>
        </section>
      </div>
    `;

    document.querySelector("#closeModal")?.addEventListener("click", cerrarModal);
  }

  function abrirCambioEstado(id: number) {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <h2>Cambiar estado</h2>

          <p><strong>Pedido:</strong> #${pedido.id}</p>
          <p><strong>Estado actual:</strong> ${pedido.estado}</p>

          <form id="estadoForm">
            <label>Nuevo estado</label>
            <select id="nuevoEstado">
              <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>PENDIENTE</option>
              <option value="CONFIRMADO" ${pedido.estado === "CONFIRMADO" ? "selected" : ""}>CONFIRMADO</option>
              <option value="TERMINADO" ${pedido.estado === "TERMINADO" ? "selected" : ""}>TERMINADO</option>
              <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>CANCELADO</option>
            </select>

            <div class="modal-actions">
              <button type="button" id="cancelModal">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar</button>
            </div>
          </form>
        </section>
      </div>
    `;

    document.querySelector("#cancelModal")?.addEventListener("click", cerrarModal);

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