import "./style.css";

import { renderLogin } from "./pages/auth/login";
import { renderRegister } from "./pages/auth/register";
import { renderHome } from "./pages/store/home";
import { getUsuarioLogueado } from "./utils/auth";
import { renderProductDetail } from "./pages/store/productDetail";
import { renderCart } from "./pages/store/cart";
import { renderMyOrders } from "./pages/client/orders";
import { renderAdminHome } from "./pages/admin/adminHome";
import { renderAdminCategories } from "./pages/admin/categories";
import { renderAdminProducts } from "./pages/admin/products";
import { renderAdminOrders } from "./pages/admin/orders";


function router() {
  const hash = location.hash || "#/login";
  const usuario = getUsuarioLogueado();

  if (hash === "#/login") {
    renderLogin();
    return;
  }

  if (hash === "#/register") {
    renderRegister();
    return;
  }

  if (!usuario) {
    location.hash = "#/login";
    return;
  }

  if (hash === "#/home") {
    renderHome();
    return;
  }

  if (hash.startsWith("#/product/")) {
    const id = Number(hash.replace("#/product/", ""));
    renderProductDetail(id);
    return;
  }

  if (hash === "#/cart") {
    renderCart();
    return;
  }

  if (hash === "#/my-orders") {
      renderMyOrders();
      return;
  }

  if (hash === "#/admin") {
    if (usuario.rol !== "ADMIN") {
      location.hash = "#/home";
      return;
    
    }

    renderAdminHome();
    return;
    
  }

  if (hash === "#/admin/categories") {
    if (usuario.rol !== "ADMIN") {
      location.hash = "#/home";
      return;
    }

    renderAdminCategories();
    return;
  }

  if (hash === "#/admin/products") {
  if (usuario.rol !== "ADMIN") {
    location.hash = "#/home";
    return;
  }

  renderAdminProducts();
  return;
}

if (hash === "#/admin/orders") {
  if (usuario.rol !== "ADMIN") {
    location.hash = "#/home";
    return;
  }

  renderAdminOrders();
  return;
}

  location.hash = "#/login";
}

window.addEventListener("hashchange", router);
router();