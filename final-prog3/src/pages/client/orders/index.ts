import type { Pedido, Producto } from "../../../types";
import { getUsuarioLogueado } from "../../../utils/auth";
import { getPedidosStore, getProductosStore } from "../../../utils/dataStore";

export async function renderMyOrders() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  const usuario = getUsuarioLogueado();

  const pedidos: Pedido[] = await getPedidosStore();
  const productos: Producto[] = await getProductosStore();

  const misPedidos = pedidos.filter((p) => p.idUsuario === usuario?.id);

  function getProductoNombre(id: number): string {
    return productos.find((p) => p.id === id)?.nombre ?? `Producto ID ${id}`;
  }

  app.innerHTML = `
    <header class="topbar">
      <h1>Food Store</h1>

      <nav>
        <button id="goHome">Inicio</button>
      </nav>
    </header>

    <main class="page-container">
      <h2>Mis pedidos</h2>

      ${
        misPedidos.length === 0
          ? `<p>Aún no realizaste ningún pedido.</p>`
          : `
            <div class="orders-grid">
              ${misPedidos
                .map(
                  (pedido) => `
                    <article class="order-card">
                      <h3>Pedido #${pedido.id}</h3>

                      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                      <p><strong>Estado:</strong> ${pedido.estado}</p>
                      <p><strong>Forma de pago:</strong> ${pedido.formaPago}</p>
                      <p><strong>Total:</strong> $${pedido.total}</p>

                      <hr>

                      <h4>Detalle de productos</h4>

                      ${pedido.detalles
                        .map(
                          (detalle) => `
                            <p>
                              ${getProductoNombre(detalle.idProducto)}
                              × ${detalle.cantidad}
                              — $${detalle.subtotal}
                            </p>
                          `
                        )
                        .join("")}
                    </article>
                  `
                )
                .join("")}
            </div>
          `
      }
    </main>
  `;

  document.querySelector("#goHome")?.addEventListener("click", () => {
    location.hash = "#/home";
  });
}