import type { Usuario } from "../../../types";
import { getUsuariosStore, saveUsuariosStore } from "../../../utils/dataStore";
import { login } from "../../../utils/auth";

export function renderRegister() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <h1>SuperFood</h1>
        <h2>Registro</h2>

        <form id="registerForm">
          <label>Nombre</label>
          <input type="text" id="nombre" required placeholder="Ingresá tu nombre completo" />

          <label>Email</label>
          <input type="email" id="mail" required placeholder="correo@ejemplo.com" />

          <label>Contraseña</label>
          <input type="password" id="password" required minlength="6" placeholder="Mínimo 6 caracteres" />

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
    const mail = (document.querySelector<HTMLInputElement>("#mail")!).value.trim();
    const password = (document.querySelector<HTMLInputElement>("#password")!).value.trim();

    const existe = usuarios.some((u) => u.mail === mail);

    if (existe) {
      error.textContent = "Ya existe un usuario con ese email.";
      return;
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre,
      apellido: "",
      mail,
      celular: "",
      password,
      rol: "USUARIO",
    };

    usuarios.push(nuevoUsuario);
    saveUsuariosStore(usuarios);

    login(nuevoUsuario);
    location.hash = "#/home";
  });
}