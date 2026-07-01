import type { Categoria } from "../../../types";
import { getCategoriasStore, saveCategoriasStore } from "../../../utils/dataStore";
import { logout } from "../../../utils/auth";



async function cargarCategorias(): Promise<Categoria[]> {
  return await getCategoriasStore();
}

function guardarCategorias(categorias: Categoria[]) {
  saveCategoriasStore(categorias);
}

export async function renderAdminCategories() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  let categorias = await cargarCategorias();

  function render() {
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
              <h2>Gestión de Categorías</h2>
              <p>Alta, edición y baja lógica de categorías.</p>
            </div>
            <button id="newCategory" class="btn-primary">+ Nueva categoría</button>
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
                              <td>
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
    document.querySelector("#goDashboard")?.addEventListener("click", () => location.hash = "#/admin");
    document.querySelector("#goCategories")?.addEventListener("click", () => location.hash = "#/admin/categories");
    document.querySelector("#goProducts")?.addEventListener("click", () => location.hash = "#/admin/products");
    document.querySelector("#goOrders")?.addEventListener("click", () => location.hash = "#/admin/orders");

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
          <h2>Nueva Categoría</h2>

          <form id="categoryForm">
            <label>Nombre</label>
            <input id="nombre" required />

            <label>Descripción</label>
            <textarea id="descripcion" required></textarea>

            <label>URL de imagen</label>
            <input id="imagen" required />

            <div class="modal-actions">
              <button type="button" id="cancelModal">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar</button>
            </div>
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
          <h2>Editar Categoría</h2>

          <form id="categoryForm">
            <label>Nombre</label>
            <input id="nombre" value="${categoria.nombre}" required />

            <label>Descripción</label>
            <textarea id="descripcion" required>${categoria.descripcion}</textarea>

            <label>URL de imagen</label>
            <input id="imagen" value="${categoria.imagen}" required />

            <div class="modal-actions">
              <button type="button" id="cancelModal">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar cambios</button>
            </div>
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