import type { Usuario } from "../../../types";
import { getUsuariosStore, saveUsuariosStore } from "../../../utils/dataStore";
import { login } from "../../../utils/auth";

export function renderRegister() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <h1>Food Store</h1>
        <h2>Registro</h2>

        <form id="registerForm">
          <label>Nombre</label>
          <input type="text" id="nombre" required />

          <label>Apellido</label>
          <input type="text" id="apellido" required />

          <label>Email</label>
          <input type="email" id="mail" required />

          <label>Celular</label>
          <input type="text" id="celular" required />

          <label>Contraseña</label>
          <input type="password" id="password" required minlength="6" />

          <button type="submit">Registrarme</button>
        </form>

        <p id="error" class="error"></p>

        <p class="auth-link">
          ¿Ya tenés cuenta?
          <a href="#" id="goLogin">Iniciar sesión</a>
        </p>
      </section>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>("#registerForm")!;
  const error = document.querySelector<HTMLParagraphElement>("#error")!;
  const goLogin = document.querySelector<HTMLAnchorElement>("#goLogin")!;

  goLogin.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = "#/login";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarios = await getUsuariosStore();

    const nombre = (document.querySelector<HTMLInputElement>("#nombre")!).value.trim();
    const apellido = (document.querySelector<HTMLInputElement>("#apellido")!).value.trim();
    const mail = (document.querySelector<HTMLInputElement>("#mail")!).value.trim();
    const celular = (document.querySelector<HTMLInputElement>("#celular")!).value.trim();
    const password = (document.querySelector<HTMLInputElement>("#password")!).value.trim();

    const existe = usuarios.some((u) => u.mail === mail);

    if (existe) {
      error.textContent = "Ya existe un usuario con ese email.";
      return;
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre,
      apellido,
      mail,
      celular,
      password,
      rol: "USUARIO",
    };

    usuarios.push(nuevoUsuario);
    await saveUsuariosStore(usuarios);

    login(nuevoUsuario);
    location.hash = "#/home";
  });
}