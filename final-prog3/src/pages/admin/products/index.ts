import type { Categoria, Producto } from "../../../types";
import { getCategoriasStore, getProductosStore, saveProductosStore,} from "../../../utils/dataStore";
import { logout } from "../../../utils/auth";



async function cargarProductos(): Promise<Producto[]> {
  return await getProductosStore();
}

async function cargarCategorias(): Promise<Categoria[]> {
  return await getCategoriasStore();
}

function guardarProductos(productos: Producto[]) {
  saveProductosStore(productos);
}

export async function renderAdminProducts() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  let productos = await cargarProductos();
  let categorias = await cargarCategorias();

  function getCategoriaNombre(id: number) {
    return categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
  }

  function render() {
    const productosActivos = productos.filter((p) => !p.eliminado);
    const categoriasActivas = categorias.filter((c) => !c.eliminado);

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
              <h2>Gestión de Productos</h2>
              <p>Alta, edición y baja lógica de productos.</p>
            </div>
            <button id="newProduct" class="btn-primary">+ Nuevo producto</button>
          </div>

          <div class="table-card">
            ${
              productosActivos.length === 0
                ? `<p>No hay productos activos.</p>`
                : `
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productosActivos
                        .map(
                          (p) => `
                            <tr>
                              <td>${p.id}</td>
                              <td><img src="${p.imagen}" alt="${p.nombre}" class="table-img" /></td>
                              <td>${p.nombre}</td>
                              <td>${p.descripcion}</td>
                              <td>$${p.precio}</td>
                              <td>${getCategoriaNombre(p.categoriaId)}</td>
                              <td>${p.stock}</td>
                              <td>${p.disponible ? "Disponible" : "No disponible"}</td>
                              <td>
                                <button class="edit-btn" data-id="${p.id}">Editar</button>
                                <button class="delete-btn" data-id="${p.id}">Eliminar</button>
                              </td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                `
            }
          </div>
        </section>
      </main>

      <div id="modalContainer"></div>
    `;

    conectarNavegacion();

    document.querySelector("#newProduct")?.addEventListener("click", () => {
      abrirModalCrear(categoriasActivas);
    });

    document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        abrirModalEditar(Number(btn.dataset.id), categoriasActivas);
      });
    });

    document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        eliminarProducto(Number(btn.dataset.id));
      });
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

  function abrirModalCrear(categoriasActivas: Categoria[]) {
    if (categoriasActivas.length === 0) {
      alert("No hay categorías activas. Primero creá una categoría.");
      return;
    }

    abrirModalProducto(null, categoriasActivas);
  }

  function abrirModalEditar(id: number, categoriasActivas: Categoria[]) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    abrirModalProducto(producto, categoriasActivas);
  }

  function abrirModalProducto(producto: Producto | null, categoriasActivas: Categoria[]) {
    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <h2>${producto ? "Editar Producto" : "Nuevo Producto"}</h2>

          <form id="productForm">
            <label>Nombre</label>
            <input id="nombre" required value="${producto?.nombre ?? ""}" />

            <label>Descripción</label>
            <textarea id="descripcion" required>${producto?.descripcion ?? ""}</textarea>

            <label>Precio</label>
            <input id="precio" type="number" min="1" step="0.01" required value="${producto?.precio ?? ""}" />

            <label>Stock</label>
            <input id="stock" type="number" min="0" required value="${producto?.stock ?? ""}" />

            <label>Categoría</label>
            <select id="categoriaId" required>
              ${categoriasActivas
                .map(
                  (c) => `
                    <option value="${c.id}" ${producto?.categoriaId === c.id ? "selected" : ""}>
                      ${c.nombre}
                    </option>
                  `
                )
                .join("")}
            </select>

            <label>URL de imagen</label>
            <input id="imagen" required value="${producto?.imagen ?? ""}" />

            <label>Disponible</label>
            <select id="disponible">
              <option value="true" ${producto?.disponible !== false ? "selected" : ""}>Sí</option>
              <option value="false" ${producto?.disponible === false ? "selected" : ""}>No</option>
            </select>

            <div class="modal-actions">
              <button type="button" id="cancelModal">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar</button>
            </div>
          </form>

          <p id="productError" class="error"></p>
        </section>
      </div>
    `;

    document.querySelector("#cancelModal")?.addEventListener("click", cerrarModal);

    document.querySelector<HTMLFormElement>("#productForm")!.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = (document.querySelector<HTMLInputElement>("#nombre")!).value.trim();
      const descripcion = (document.querySelector<HTMLTextAreaElement>("#descripcion")!).value.trim();
      const precio = Number((document.querySelector<HTMLInputElement>("#precio")!).value);
      const stock = Number((document.querySelector<HTMLInputElement>("#stock")!).value);
      const categoriaId = Number((document.querySelector<HTMLSelectElement>("#categoriaId")!).value);
      const imagen = (document.querySelector<HTMLInputElement>("#imagen")!).value.trim();
      const disponible = (document.querySelector<HTMLSelectElement>("#disponible")!).value === "true";

      const error = document.querySelector<HTMLParagraphElement>("#productError")!;

      if (!nombre || !descripcion || !imagen) {
        error.textContent = "Todos los campos son obligatorios.";
        return;
      }

      if (precio <= 0) {
        error.textContent = "El precio debe ser mayor a 0.";
        return;
      }

      if (stock < 0) {
        error.textContent = "El stock no puede ser negativo.";
        return;
      }

      if (producto) {
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.stock = stock;
        producto.categoriaId = categoriaId;
        producto.imagen = imagen;
        producto.disponible = disponible;
      } else {
        productos.push({
          id: Date.now(),
          nombre,
          descripcion,
          precio,
          stock,
          categoriaId,
          imagen,
          disponible,
          eliminado: false,
        });
      }

      guardarProductos(productos);
      cerrarModal();
      render();
    });
  }

  function eliminarProducto(id: number) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    const confirmar = confirm(`¿Seguro que querés eliminar el producto "${producto.nombre}"?`);
    if (!confirmar) return;

    producto.eliminado = true;
    guardarProductos(productos);
    render();
  }

  function cerrarModal() {
    document.querySelector<HTMLDivElement>("#modalContainer")!.innerHTML = "";
  }

  render();
}