import { getUsuariosStore } from "../../../utils/dataStore";
import { login } from "../../../utils/auth";

export function renderLogin() {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <h1>SuperFood</h1>
        <h2>Iniciar Sesión</h2>

        <form id="loginForm">
          <label>Email</label>
          <input type="email" id="mail" required placeholder="correo@ejemplo.com" />

          <label>Contraseña</label>
          <input type="password" id="password" required placeholder="Tu contraseña" />

          <button type="submit">Ingresar</button>
        </form>

        <p id="error" class="error"></p>

        <p class="auth-link">
          ¿No tenés cuenta?
          <a href="#" id="goRegister">Registrarse</a>
        </p>

        <div class="auth-hints">
          <p><strong>Usuarios de prueba:</strong></p>
          <p>Admin: admin@foodstore.com / admin123</p>
          <p>Cliente: cliente@foodstore.com / cliente123</p>
        </div>
      </section>
    </main>
  `;

  const form = document.querySelector<HTMLFormElement>("#loginForm")!;
  const error = document.querySelector<HTMLParagraphElement>("#error")!;
  const goRegister = document.querySelector<HTMLAnchorElement>("#goRegister")!;

  goRegister.addEventListener("click", (e) => {
    e.preventDefault();
    location.hash = "#/register";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mail = (document.querySelector<HTMLInputElement>("#mail")!).value.trim();
    const password = (document.querySelector<HTMLInputElement>("#password")!).value.trim();

    const usuarios = await getUsuariosStore();
    const usuario = usuarios.find(
      (u) => u.mail === mail && u.password === password
    );

    if (!usuario) {
      error.textContent = "Credenciales incorrectas.";
      return;
    }

    login(usuario);

    if (usuario.rol === "ADMIN") {
      location.hash = "#/admin";
    } else {
      location.hash = "#/home";
    }
  });
}