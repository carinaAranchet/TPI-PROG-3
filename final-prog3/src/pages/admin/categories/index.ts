import type { Categoria } from "../../../types";
import { getCategoriasStore, saveCategoriasStore } from "../../../utils/dataStore";
import { getUsuarioLogueado, logout } from "../../../utils/auth";



async function cargarCategorias(): Promise<Categoria[]> {
  return await getCategoriasStore();
}

function guardarCategorias(categorias: Categoria[]) {
  saveCategoriasStore(categorias);
}

export async function renderAdminCategories() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const usuario = getUsuarioLogueado();
  let categorias = await cargarCategorias();

  function render() {
    const categoriasActivas = categorias.filter((c) => !c.eliminado);

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
          <button id="goDashboardSide">📊 Dashboard</button>
          <button class="active-admin-link" id="goCategoriesSide">📁 Categorías</button>
          <button id="goProductsSide">🍔 Productos</button>
          <button id="goOrdersSide">📦 Pedidos</button>
          <button id="goStoreSide">🏪 Ir Tienda</button>
        </aside>

        <section class="admin-content">
          <div class="admin-header">
            <h2>Gestión de Categorías</h2>
            <button id="newCategory" class="btn-new">+ Nueva Categoría</button>
          </div>

          <div class="table-card">
            ${
              categoriasActivas.length === 0
                ? `<p>No hay categorías activas.</p>`
                : `
                  <table class="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${categoriasActivas
                        .map(
                          (c) => `
                            <tr>
                              <td>${c.id}</td>
                              <td><img src="${c.imagen}" alt="${c.nombre}" class="table-img" /></td>
                              <td>${c.nombre}</td>
                              <td>${c.descripcion}</td>
                              <td class="table-actions">
                                <button class="edit-btn" data-id="${c.id}">Editar</button>
                                <button class="delete-btn" data-id="${c.id}">Eliminar</button>
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

    document.querySelector("#newCategory")?.addEventListener("click", () => {
      abrirModalCrear();
    });

    document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        abrirModalEditar(id);
      });
    });

    document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        eliminarCategoria(id);
      });
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

  function abrirModalCrear() {
    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Nueva Categoría</h2>
            <button id="cancelModal" class="modal-close">✕</button>
          </div>

          <form id="categoryForm">
            <label>Nombre</label>
            <input id="nombre" required placeholder="Nombre de la categoría" />

            <label>Descripción</label>
            <textarea id="descripcion" required placeholder="Descripción de la categoría"></textarea>

            <label>URL de Imagen</label>
            <input id="imagen" required placeholder="https://ejemplo.com/imagen.jpg" />

            <button type="submit" class="btn-primary btn-block">Crear</button>
          </form>

          <p id="categoryError" class="error"></p>
        </section>
      </div>
    `;

    document.querySelector("#cancelModal")?.addEventListener("click", cerrarModal);

    document.querySelector<HTMLFormElement>("#categoryForm")!.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = (document.querySelector<HTMLInputElement>("#nombre")!).value.trim();
      const descripcion = (document.querySelector<HTMLTextAreaElement>("#descripcion")!).value.trim();
      const imagen = (document.querySelector<HTMLInputElement>("#imagen")!).value.trim();

      if (!nombre || !descripcion || !imagen) {
        document.querySelector<HTMLParagraphElement>("#categoryError")!.textContent =
          "Todos los campos son obligatorios.";
        return;
      }

      const nuevaCategoria: Categoria = {
        id: Date.now(),
        nombre,
        descripcion,
        imagen,
        eliminado: false,
      };

      categorias.push(nuevaCategoria);
      guardarCategorias(categorias);
      cerrarModal();
      render();
    });
  }

  function abrirModalEditar(id: number) {
    const categoria = categorias.find((c) => c.id === id);

    if (!categoria) return;

    const modal = document.querySelector<HTMLDivElement>("#modalContainer")!;

    modal.innerHTML = `
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Editar Categoría</h2>
            <button id="cancelModal" class="modal-close">✕</button>
          </div>

          <form id="categoryForm">
            <label>Nombre</label>
            <input id="nombre" value="${categoria.nombre}" required />

            <label>Descripción</label>
            <textarea id="descripcion" required>${categoria.descripcion}</textarea>

            <label>URL de Imagen</label>
            <input id="imagen" value="${categoria.imagen}" required />

            <button type="submit" class="btn-primary btn-block">Guardar</button>
          </form>

          <p id="categoryError" class="error"></p>
        </section>
      </div>
    `;

    document.querySelector("#cancelModal")?.addEventListener("click", cerrarModal);

    document.querySelector<HTMLFormElement>("#categoryForm")!.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = (document.querySelector<HTMLInputElement>("#nombre")!).value.trim();
      const descripcion = (document.querySelector<HTMLTextAreaElement>("#descripcion")!).value.trim();
      const imagen = (document.querySelector<HTMLInputElement>("#imagen")!).value.trim();

      if (!nombre || !descripcion || !imagen) {
        document.querySelector<HTMLParagraphElement>("#categoryError")!.textContent =
          "Todos los campos son obligatorios.";
        return;
      }

      categoria.nombre = nombre;
      categoria.descripcion = descripcion;
      categoria.imagen = imagen;

      guardarCategorias(categorias);
      cerrarModal();
      render();
    });
  }

  function eliminarCategoria(id: number) {
    const categoria = categorias.find((c) => c.id === id);

    if (!categoria) return;

    const confirmar = confirm(`¿Seguro que querés eliminar la categoría "${categoria.nombre}"?`);

    if (!confirmar) return;

    categoria.eliminado = true;
    guardarCategorias(categorias);
    render();
  }

  function cerrarModal() {
    document.querySelector<HTMLDivElement>("#modalContainer")!.innerHTML = "";
  }

  render();
}