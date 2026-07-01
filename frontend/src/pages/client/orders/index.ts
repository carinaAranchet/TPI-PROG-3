import type { Pedido, Producto } from "../../../types";
import { getUsuarioLogueado, logout } from "../../../utils/auth";
import { getPedidosStore, getProductosStore } from "../../../utils/dataStore";
import { getCart } from "../../../utils/cart";

export async function renderMyOrders() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  const usuario = getUsuarioLogueado();

  const pedidos: Pedido[] = await getPedidosStore();
  const productos: Producto[] = await getProductosStore();

  const misPedidos = pedidos.filter((p) => p.idUsuario === usuario?.id);

  function getProductoNombre(id: number): string {
    return productos.find((p) => p.id === id)?.nombre ?? `Producto ID ${id}`;
  }

  function getProductoPrecio(id: number): number {
    return productos.find((p) => p.id === id)?.precio ?? 0;
  }

  function render(filtro = "") {
    const filtrados = filtro
      ? misPedidos.filter((p) => p.estado === filtro)
      : misPedidos;

    app.innerHTML = `
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goHome">Inicio</button>
          <button id="goOrders" class="nav-active">Mis Pedidos</button>
          <button id="goCart">🛒 Cart <span class="cart-badge">${getCart().length}</span></button>
          <span class="nav-user">${usuario?.nombre ?? ""} ${usuario?.apellido ?? ""}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="page-container">
        <div class="orders-header">
          <h2>Mis Pedidos</h2>
          <select id="filtroEstado">
            <option value="" ${filtro === "" ? "selected" : ""}>Todos</option>
            <option value="PENDIENTE" ${filtro === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
            <option value="CONFIRMADO" ${filtro === "CONFIRMADO" ? "selected" : ""}>Confirmado</option>
            <option value="TERMINADO" ${filtro === "TERMINADO" ? "selected" : ""}>Terminado</option>
            <option value="CANCELADO" ${filtro === "CANCELADO" ? "selected" : ""}>Cancelado</option>
          </select>
        </div>

        ${
          filtrados.length === 0
            ? `<p class="empty-msg">Aún no realizaste ningún pedido.</p>`
            : `
              <div class="orders-list">
                ${filtrados
                  .sort((a, b) => b.id - a.id)
                  .map(
                    (pedido) => `
                      <article class="order-card">
                        <div class="order-card-header">
                          <div>
                            <h3>Pedido #ORD-${pedido.id}</h3>
                            <p class="order-date">📅 ${pedido.fecha}</p>
                            <p>${pedido.detalles.length} producto(s)</p>
                          </div>
                          <div class="order-card-right">
                            <span class="status-badge status-${pedido.estado.toLowerCase()}">${pedido.estado}</span>
                            <strong class="order-total">$${pedido.total.toLocaleString("es-AR")}</strong>
                          </div>
                        </div>

                        <button class="detail-btn toggle-detail" data-id="${pedido.id}">▼ Detalle</button>

                        <div class="order-detail" id="detail-${pedido.id}" style="display:none">
                          <div class="order-delivery-info">
                            <h4>📍 Información de Entrega</h4>
                            <p><strong>Teléfono:</strong> ${usuario?.celular || "No especificado"}</p>
                            <p><strong>Método de pago:</strong> ${pedido.formaPago}</p>
                          </div>

                          <h4>🛒 Productos</h4>
                          ${pedido.detalles
                            .map(
                              (d) => `
                                <div class="order-product-row">
                                  <span>${getProductoNombre(d.idProducto)}</span>
                                  <span>Cantidad: ${d.cantidad} × $${getProductoPrecio(d.idProducto).toLocaleString("es-AR")}</span>
                                  <strong>$${d.subtotal.toLocaleString("es-AR")}</strong>
                                </div>
                              `
                            )
                            .join("")}

                          <div class="order-totals">
                            <p><span>Subtotal:</span> <strong>$${(pedido.total - 500).toLocaleString("es-AR")}</strong></p>
                            <p><span>Envío:</span> <strong>$500</strong></p>
                            <p class="order-total-final"><span>Total:</span> <strong>$${pedido.total.toLocaleString("es-AR")}</strong></p>
                          </div>
                        </div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            `
        }
      </main>
    `;

    document.querySelector("#goHome")?.addEventListener("click", () => location.hash = "#/home");
    document.querySelector("#goOrders")?.addEventListener("click", () => location.hash = "#/my-orders");
    document.querySelector("#goCart")?.addEventListener("click", () => location.hash = "#/cart");
    document.querySelector("#logoutBtn")?.addEventListener("click", () => { logout(); location.hash = "#/login"; });

    document.querySelector("#filtroEstado")?.addEventListener("change", (e) => {
      render((e.target as HTMLSelectElement).value);
    });

    document.querySelectorAll<HTMLButtonElement>(".toggle-detail").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const detail = document.querySelector<HTMLDivElement>(`#detail-${id}`)!;
        const visible = detail.style.display !== "none";
        detail.style.display = visible ? "none" : "block";
        btn.textContent = visible ? "▼ Detalle" : "▲ Ocultar";
      });
    });
  }

  render();
}