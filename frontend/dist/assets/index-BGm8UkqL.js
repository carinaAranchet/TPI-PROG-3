(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function e(e){let t=await fetch(`/data/${e}`);if(!t.ok)throw Error(`No se pudo cargar ${e}`);return await t.json()}async function t(){let t=localStorage.getItem(`categorias`);if(t)return JSON.parse(t);let n=await e(`categorias.json`);return localStorage.setItem(`categorias`,JSON.stringify(n)),n}function n(e){localStorage.setItem(`categorias`,JSON.stringify(e))}async function r(){let t=localStorage.getItem(`productos`);if(t)return JSON.parse(t);let n=await e(`productos.json`);return localStorage.setItem(`productos`,JSON.stringify(n)),n}function i(e){localStorage.setItem(`productos`,JSON.stringify(e))}async function a(){let t=localStorage.getItem(`usuarios`);if(t)return JSON.parse(t);let n=await e(`usuarios.json`);return localStorage.setItem(`usuarios`,JSON.stringify(n)),n}function o(e){localStorage.setItem(`usuarios`,JSON.stringify(e))}async function s(){let t=localStorage.getItem(`pedidos`);if(t)return JSON.parse(t);let n=await e(`pedidos.json`);return localStorage.setItem(`pedidos`,JSON.stringify(n)),n}function c(e){localStorage.setItem(`pedidos`,JSON.stringify(e))}var l=`usuarioLogueado`;function u(e){localStorage.setItem(l,JSON.stringify(e))}function d(){localStorage.removeItem(l)}function f(){let e=localStorage.getItem(l);return e?JSON.parse(e):null}function p(){let e=document.querySelector(`#app`);e.innerHTML=`
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
  `;let t=document.querySelector(`#loginForm`),n=document.querySelector(`#error`);document.querySelector(`#goRegister`).addEventListener(`click`,e=>{e.preventDefault(),location.hash=`#/register`}),t.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.querySelector(`#mail`).value.trim(),r=document.querySelector(`#password`).value.trim(),i=(await a()).find(e=>e.mail===t&&e.password===r);if(!i){n.textContent=`Credenciales incorrectas.`;return}u(i),i.rol===`ADMIN`?location.hash=`#/admin`:location.hash=`#/home`})}function m(){let e=document.querySelector(`#app`);e.innerHTML=`
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
  `;let t=document.querySelector(`#registerForm`),n=document.querySelector(`#error`);document.querySelector(`#goLogin`).addEventListener(`click`,e=>{e.preventDefault(),location.hash=`#/login`}),t.addEventListener(`submit`,async e=>{e.preventDefault();let t=await a(),r=document.querySelector(`#nombre`).value.trim(),i=document.querySelector(`#mail`).value.trim(),s=document.querySelector(`#password`).value.trim();if(t.some(e=>e.mail===i)){n.textContent=`Ya existe un usuario con ese email.`;return}let c={id:Date.now(),nombre:r,apellido:``,mail:i,celular:``,password:s,rol:`USUARIO`};t.push(c),o(t),u(c),location.hash=`#/home`})}var h=`carrito`;function g(){let e=localStorage.getItem(h);return e?JSON.parse(e):[]}function _(e){localStorage.setItem(h,JSON.stringify(e))}function v(){localStorage.removeItem(h)}function y(e,t){let n=g(),r=n.find(t=>t.producto.id===e.id);if(r){let n=r.cantidad+t;r.cantidad=Math.min(n,e.stock)}else n.push({producto:e,cantidad:t});_(n)}function b(e){_(g().filter(t=>t.producto.id!==e))}function x(e,t){let n=g(),r=n.find(t=>t.producto.id===e);if(r){if(t<=0){b(e);return}r.cantidad=Math.min(t,r.producto.stock),_(n)}}function S(){return g().reduce((e,t)=>e+t.producto.precio*t.cantidad,0)}async function C(){let e=document.querySelector(`#app`),n=f(),i=(await t()).filter(e=>!e.eliminado),a=(await r()).filter(e=>e.disponible&&!e.eliminado);e.innerHTML=`
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goHome">Inicio</button>
        <button id="goOrders">Mis Pedidos</button>
        ${n?.rol===`ADMIN`?`<button id="goAdmin">Administración</button>`:``}
        <button id="goCart">🛒 Cart <span class="cart-badge">${g().length}</span></button>
        <span class="nav-user">${n?.nombre??``} ${n?.apellido??``}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="store-layout">
      <aside class="sidebar">
        <h3>Categorías</h3>
        <p class="sidebar-subtitle">Filtrar por categoría</p>
        <button class="category-btn active" data-id="0">🍔 Todos los productos</button>
        ${i.map(e=>`
              <button class="category-btn" data-id="${e.id}">
                🍔 ${e.nombre}
              </button>
            `).join(``)}
      </aside>

      <section class="catalog">
        <div class="catalog-header">
          <h2 id="catalogTitle">Todos los Productos</h2>

          <div class="filters">
            <input id="searchInput" placeholder="🔍 Buscar productos..." />
            <select id="sortSelect">
              <option value="">Ordenar por</option>
              <option value="az">Nombre A-Z</option>
              <option value="za">Nombre Z-A</option>
              <option value="priceAsc">Precio menor a mayor</option>
              <option value="priceDesc">Precio mayor a menor</option>
            </select>
            <select id="catFilter">
              <option value="0">Todos</option>
              ${i.map(e=>`<option value="${e.id}">${e.nombre}</option>`).join(``)}
            </select>
          </div>
        </div>

        <p class="products-count" id="productsCount">${a.length} productos</p>

        <div id="productsGrid" class="products-grid"></div>
      </section>
    </main>
  `;let o=0,s=``,c=``,l=document.querySelector(`#productsGrid`),u=document.querySelector(`#searchInput`),p=document.querySelector(`#sortSelect`),m=document.querySelector(`#catFilter`),h=document.querySelector(`#catalogTitle`),_=document.querySelector(`#productsCount`);function v(){let e=[...a];if(o!==0&&(e=e.filter(e=>e.categoriaId===o)),s.trim()!==``&&(e=e.filter(e=>e.nombre.toLowerCase().includes(s.toLowerCase()))),c===`az`&&e.sort((e,t)=>e.nombre.localeCompare(t.nombre)),c===`za`&&e.sort((e,t)=>t.nombre.localeCompare(e.nombre)),c===`priceAsc`&&e.sort((e,t)=>e.precio-t.precio),c===`priceDesc`&&e.sort((e,t)=>t.precio-e.precio),_.textContent=`${e.length} productos`,e.length===0){l.innerHTML=`<p class="empty-msg">No hay productos disponibles.</p>`;return}l.innerHTML=e.map(e=>{let t=i.find(t=>t.id===e.categoriaId);return`
            <article class="product-card">
              <img src="${e.imagen}" alt="${e.nombre}" />
              <div class="product-card-body">
                <span class="badge">${t?.nombre??`General`}</span>
                <h3>${e.nombre}</h3>
                <p>${e.descripcion}</p>
                <strong>$${e.precio.toLocaleString(`es-AR`)}</strong>
                <button class="btn-add-cart" data-id="${e.id}">Agregar</button>
              </div>
            </article>
          `}).join(``),document.querySelectorAll(`.btn-add-cart`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=Number(e.dataset.id);location.hash=`#/product/${n}`})}),document.querySelectorAll(`.product-card`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.querySelector(`.btn-add-cart`);t&&(location.hash=`#/product/${t.dataset.id}`)})})}document.querySelectorAll(`.category-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.category-btn`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),o=Number(e.dataset.id),m.value=String(o),h.textContent=o===0?`Todos los Productos`:i.find(e=>e.id===o)?.nombre??`Productos`,v()})}),m.addEventListener(`change`,()=>{o=Number(m.value),document.querySelectorAll(`.category-btn`).forEach(e=>e.classList.remove(`active`)),document.querySelector(`.category-btn[data-id="${o}"]`)?.classList.add(`active`),h.textContent=o===0?`Todos los Productos`:i.find(e=>e.id===o)?.nombre??`Productos`,v()}),u.addEventListener(`input`,()=>{s=u.value,v()}),p.addEventListener(`change`,()=>{c=p.value,v()}),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`}),document.querySelector(`#goHome`)?.addEventListener(`click`,()=>{location.hash=`#/home`}),document.querySelector(`#goCart`)?.addEventListener(`click`,()=>{location.hash=`#/cart`}),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>{location.hash=`#/my-orders`}),document.querySelector(`#goAdmin`)?.addEventListener(`click`,()=>{location.hash=`#/admin`}),v()}async function w(e){let n=document.querySelector(`#app`),i=f(),a=await r(),o=await t(),s=a.find(t=>t.id===e&&!t.eliminado);if(!s){n.innerHTML=`
      <main class="page-container">
        <h2>Producto no encontrado</h2>
        <button id="backHome" class="btn-primary">Volver al catálogo</button>
      </main>
    `,document.querySelector(`#backHome`)?.addEventListener(`click`,()=>{location.hash=`#/home`});return}let c=o.find(e=>e.id===s.categoriaId);n.innerHTML=`
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goHome">Inicio</button>
        <button id="goOrders">Mis Pedidos</button>
        ${i?.rol===`ADMIN`?`<button id="goAdmin">Administración</button>`:``}
        <button id="goCart">🛒 Cart <span class="cart-badge">${g().length}</span></button>
        <span class="nav-user">${i?.nombre??``} ${i?.apellido??``}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="detail-page">
      <section class="detail-card">
        <img src="${s.imagen}" alt="${s.nombre}" class="detail-img" />

        <div class="detail-info">
          <h2>${s.nombre}</h2>
          <h3 class="detail-price">$${s.precio.toLocaleString(`es-AR`)}</h3>
          <span class="badge">${c?.nombre??`General`}</span>
          <p class="detail-desc">${s.descripcion}</p>

          <div class="detail-quantity">
            <label>Cantidad</label>
            <div class="quantity-control">
              <button id="qtyMinus">−</button>
              <span id="qtyValue">1</span>
              <button id="qtyPlus">+</button>
            </div>
          </div>

          <div class="detail-actions">
            <button id="addCart" class="btn-primary">Agregar al Carrito</button>
            <button id="backHome" class="btn-outline">Volver</button>
          </div>

          <p id="message" class="success-message"></p>
        </div>
      </section>
    </main>
  `;let l=1,u=document.querySelector(`#qtyValue`),p=document.querySelector(`#message`),m=document.querySelector(`#addCart`);(!s.disponible||s.stock<=0)&&(m.disabled=!0,m.textContent=`Producto no disponible`),document.querySelector(`#qtyMinus`)?.addEventListener(`click`,()=>{l>1&&(l--,u.textContent=String(l))}),document.querySelector(`#qtyPlus`)?.addEventListener(`click`,()=>{l<s.stock&&(l++,u.textContent=String(l))}),document.querySelector(`#backHome`)?.addEventListener(`click`,()=>{location.hash=`#/home`}),document.querySelector(`#goHome`)?.addEventListener(`click`,()=>{location.hash=`#/home`}),document.querySelector(`#goCart`)?.addEventListener(`click`,()=>{location.hash=`#/cart`}),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>{location.hash=`#/my-orders`}),document.querySelector(`#goAdmin`)?.addEventListener(`click`,()=>{location.hash=`#/admin`}),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`}),m.addEventListener(`click`,()=>{if(l<=0){p.textContent=`La cantidad debe ser mayor a 0.`;return}if(l>s.stock){p.textContent=`No hay stock suficiente.`;return}y(s,l),p.textContent=`Producto agregado al carrito correctamente.`})}var T=500;function E(){let e=document.querySelector(`#app`),t=g(),n=f();if(t.length===0){e.innerHTML=`
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goHome">Inicio</button>
          <button id="goOrders">Mis Pedidos</button>
          <span class="nav-user">${n?.nombre??``} ${n?.apellido??``}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="page-container">
        <section class="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos desde el catálogo.</p>
          <button id="goHome2" class="btn-primary">Ir a la tienda</button>
        </section>
      </main>
    `,document.querySelector(`#goHome`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goHome2`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>location.hash=`#/my-orders`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`});return}let r=S(),i=r+T;e.innerHTML=`
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goHome">Inicio</button>
        <button id="goOrders">Mis Pedidos</button>
        ${n?.rol===`ADMIN`?`<button id="goAdmin">Administración</button>`:``}
        <button id="goCart">🛒 Cart <span class="cart-badge">${t.length}</span></button>
        <span class="nav-user">${n?.nombre??``} ${n?.apellido??``}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="cart-page">
      <section class="cart-list">
        <h2>Mi Carrito</h2>

        ${t.map(e=>`
              <article class="cart-item">
                <img src="${e.producto.imagen}" alt="${e.producto.nombre}" />
                <div>
                  <h3>${e.producto.nombre}</h3>
                  <p>${e.producto.descripcion}</p>
                  <p class="cart-item-price">$${e.producto.precio.toLocaleString(`es-AR`)} c/u</p>
                </div>

                <div class="quantity-control">
                  <button class="qty-btn" data-action="minus" data-id="${e.producto.id}">−</button>
                  <span>${e.cantidad}</span>
                  <button class="qty-btn" data-action="plus" data-id="${e.producto.id}">+</button>
                </div>

                <strong class="cart-item-total">$${(e.producto.precio*e.cantidad).toLocaleString(`es-AR`)}</strong>

                <button class="remove-btn" data-id="${e.producto.id}">✕</button>
              </article>
            `).join(``)}
      </section>

      <aside class="checkout-card">
        <h2>Resumen del Pedido</h2>

        <p><span>Subtotal:</span> <strong>$${r.toLocaleString(`es-AR`)}</strong></p>
        <p><span>Envío:</span> <strong>$${T.toLocaleString(`es-AR`)}</strong></p>
        <hr />
        <p class="checkout-total"><span>Total:</span> <strong>$${i.toLocaleString(`es-AR`)}</strong></p>

        <button id="openCheckout" class="btn-primary btn-block">Procesar el Pago</button>
        <button id="clearCart" class="btn-outline btn-block">Vaciar Carrito</button>
      </aside>
    </main>

    <div id="modalContainer"></div>
  `,document.querySelector(`#goHome`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>location.hash=`#/my-orders`),document.querySelector(`#goCart`)?.addEventListener(`click`,()=>location.hash=`#/cart`),document.querySelector(`#goAdmin`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`}),document.querySelector(`#clearCart`)?.addEventListener(`click`,()=>{v(),E()}),document.querySelectorAll(`.remove-btn`).forEach(e=>{e.addEventListener(`click`,()=>{b(Number(e.dataset.id)),E()})}),document.querySelectorAll(`.qty-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.dataset.id),n=e.dataset.action,r=g().find(e=>e.producto.id===t);r&&(x(t,n===`plus`?r.cantidad+1:r.cantidad-1),E())})}),document.querySelector(`#openCheckout`)?.addEventListener(`click`,()=>{let e=document.querySelector(`#modalContainer`);e.innerHTML=`
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Completar Pedido</h2>
            <button id="closeModal" class="modal-close">✕</button>
          </div>

          <form id="checkoutForm">
            <label>Teléfono</label>
            <input type="text" id="telefono" required placeholder="Ej: +54 221 1234567" value="${n?.celular??``}" />

            <label>Dirección de Entrega</label>
            <input type="text" id="direccion" required placeholder="Calle, número, piso, depto" />

            <label>Método de Pago</label>
            <select id="formaPago" required>
              <option value="" disabled selected>Seleccione un método</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>

            <label>Notas adicionales (opcional)</label>
            <textarea id="notas" placeholder="Instrucciones especiales, timbre, etc."></textarea>

            <hr />
            <p class="checkout-total"><span>Total a pagar:</span> <strong>$${i.toLocaleString(`es-AR`)}</strong></p>

            <button type="submit" class="btn-primary btn-block">Confirmar Pedido</button>
          </form>
        </section>
      </div>
    `,document.querySelector(`#closeModal`)?.addEventListener(`click`,()=>{e.innerHTML=``}),document.querySelector(`#checkoutForm`).addEventListener(`submit`,e=>{e.preventDefault();let r=document.querySelector(`#formaPago`).value,a=localStorage.getItem(`pedidos`),o=a?JSON.parse(a):[],s={id:Date.now(),fecha:new Date().toLocaleString(`es-AR`),estado:`PENDIENTE`,formaPago:r,total:i,idUsuario:n.id,detalles:t.map(e=>({idProducto:e.producto.id,cantidad:e.cantidad,subtotal:e.producto.precio*e.cantidad}))};o.push(s),localStorage.setItem(`pedidos`,JSON.stringify(o)),v(),location.hash=`#/my-orders`})})}async function D(){let e=document.querySelector(`#app`),t=f(),n=await s(),i=await r(),a=n.filter(e=>e.idUsuario===t?.id);function o(e){return i.find(t=>t.id===e)?.nombre??`Producto ID ${e}`}function c(e){return i.find(t=>t.id===e)?.precio??0}function l(n=``){let r=n?a.filter(e=>e.estado===n):a;e.innerHTML=`
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goHome">Inicio</button>
          <button id="goOrders" class="nav-active">Mis Pedidos</button>
          <button id="goCart">🛒 Cart <span class="cart-badge">${g().length}</span></button>
          <span class="nav-user">${t?.nombre??``} ${t?.apellido??``}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="page-container">
        <div class="orders-header">
          <h2>Mis Pedidos</h2>
          <select id="filtroEstado">
            <option value="" ${n===``?`selected`:``}>Todos</option>
            <option value="PENDIENTE" ${n===`PENDIENTE`?`selected`:``}>Pendiente</option>
            <option value="CONFIRMADO" ${n===`CONFIRMADO`?`selected`:``}>Confirmado</option>
            <option value="TERMINADO" ${n===`TERMINADO`?`selected`:``}>Terminado</option>
            <option value="CANCELADO" ${n===`CANCELADO`?`selected`:``}>Cancelado</option>
          </select>
        </div>

        ${r.length===0?`<p class="empty-msg">Aún no realizaste ningún pedido.</p>`:`
              <div class="orders-list">
                ${r.sort((e,t)=>t.id-e.id).map(e=>`
                      <article class="order-card">
                        <div class="order-card-header">
                          <div>
                            <h3>Pedido #ORD-${e.id}</h3>
                            <p class="order-date">📅 ${e.fecha}</p>
                            <p>${e.detalles.length} producto(s)</p>
                          </div>
                          <div class="order-card-right">
                            <span class="status-badge status-${e.estado.toLowerCase()}">${e.estado}</span>
                            <strong class="order-total">$${e.total.toLocaleString(`es-AR`)}</strong>
                          </div>
                        </div>

                        <button class="detail-btn toggle-detail" data-id="${e.id}">▼ Detalle</button>

                        <div class="order-detail" id="detail-${e.id}" style="display:none">
                          <div class="order-delivery-info">
                            <h4>📍 Información de Entrega</h4>
                            <p><strong>Teléfono:</strong> ${t?.celular||`No especificado`}</p>
                            <p><strong>Método de pago:</strong> ${e.formaPago}</p>
                          </div>

                          <h4>🛒 Productos</h4>
                          ${e.detalles.map(e=>`
                                <div class="order-product-row">
                                  <span>${o(e.idProducto)}</span>
                                  <span>Cantidad: ${e.cantidad} × $${c(e.idProducto).toLocaleString(`es-AR`)}</span>
                                  <strong>$${e.subtotal.toLocaleString(`es-AR`)}</strong>
                                </div>
                              `).join(``)}

                          <div class="order-totals">
                            <p><span>Subtotal:</span> <strong>$${(e.total-500).toLocaleString(`es-AR`)}</strong></p>
                            <p><span>Envío:</span> <strong>$500</strong></p>
                            <p class="order-total-final"><span>Total:</span> <strong>$${e.total.toLocaleString(`es-AR`)}</strong></p>
                          </div>
                        </div>
                      </article>
                    `).join(``)}
              </div>
            `}
      </main>
    `,document.querySelector(`#goHome`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>location.hash=`#/my-orders`),document.querySelector(`#goCart`)?.addEventListener(`click`,()=>location.hash=`#/cart`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`}),document.querySelector(`#filtroEstado`)?.addEventListener(`change`,e=>{l(e.target.value)}),document.querySelectorAll(`.toggle-detail`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id,n=document.querySelector(`#detail-${t}`),r=n.style.display!==`none`;n.style.display=r?`none`:`block`,e.textContent=r?`▼ Detalle`:`▲ Ocultar`})})}l()}async function O(){let e=document.querySelector(`#app`),n=f(),i=await t(),a=await r(),o=await s(),c=i.filter(e=>!e.eliminado).length,l=a.filter(e=>!e.eliminado).length,u=a.filter(e=>e.disponible&&!e.eliminado).length,p=o.filter(e=>e.estado===`PENDIENTE`).length,m=o.filter(e=>e.estado===`CONFIRMADO`).length,h=o.filter(e=>e.estado===`TERMINADO`).length,g=o.filter(e=>e.estado===`CANCELADO`).length;e.innerHTML=`
    <header class="topbar">
      <h1>🍕 Food Store</h1>
      <nav>
        <button id="goStore">Tienda</button>
        <button id="goDashboard">Panel Admin</button>
        <span class="nav-user">${n?.nombre??``} ${n?.apellido??``}</span>
        <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
      </nav>
    </header>

    <main class="admin-layout">
      <aside class="admin-sidebar">
        <h3>Administración</h3>
        <p class="sidebar-subtitle">Panel de control</p>

        <button class="active-admin-link" id="goDashboardSide">📊 Dashboard</button>
        <button id="goCategories">📁 Categorías</button>
        <button id="goProducts">🍔 Productos</button>
        <button id="goOrders">📦 Pedidos</button>
        <button id="goStoreSide">🏪 Ir Tienda</button>
      </aside>

      <section class="admin-content">
        <h2 class="dashboard-title">Panel de Administración</h2>

        <div class="dashboard-cards">
          <article class="dashboard-card card-categories">
            <h3>📁 Categorías</h3>
            <strong>${c}</strong>
            <button id="manageCategories">Gestionar</button>
          </article>

          <article class="dashboard-card card-products">
            <h3>🍔 Productos</h3>
            <strong>${l}</strong>
            <button id="manageProducts">Gestionar</button>
          </article>

          <article class="dashboard-card card-orders">
            <h3>📦 Pedidos</h3>
            <strong>${o.length}</strong>
            <button id="manageOrders">Gestionar</button>
          </article>

          <article class="dashboard-card card-available">
            <h3>✅ Disponibles</h3>
            <strong>${u}</strong>
            <span>Productos activos</span>
          </article>
        </div>

        <section class="quick-summary">
          <h3>📊 Resumen Rápido</h3>
          <div class="summary-grid">
            <article class="summary-item">
              <span>Categorías activas</span>
              <strong>${c}</strong>
            </article>
            <article class="summary-item">
              <span>Productos activos</span>
              <strong>${l}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos pendientes</span>
              <strong>${p}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos confirmados</span>
              <strong>${m}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos terminados</span>
              <strong>${h}</strong>
            </article>
            <article class="summary-item">
              <span>Pedidos cancelados</span>
              <strong>${g}</strong>
            </article>
          </div>
        </section>
      </section>
    </main>
  `,document.querySelector(`#goStore`)?.addEventListener(`click`,()=>{location.hash=`#/home`}),document.querySelector(`#goStoreSide`)?.addEventListener(`click`,()=>{location.hash=`#/home`}),document.querySelector(`#goDashboard`)?.addEventListener(`click`,()=>{location.hash=`#/admin`}),document.querySelector(`#goDashboardSide`)?.addEventListener(`click`,()=>{location.hash=`#/admin`}),document.querySelector(`#goCategories`)?.addEventListener(`click`,()=>{location.hash=`#/admin/categories`}),document.querySelector(`#goProducts`)?.addEventListener(`click`,()=>{location.hash=`#/admin/products`}),document.querySelector(`#goOrders`)?.addEventListener(`click`,()=>{location.hash=`#/admin/orders`}),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`}),document.querySelector(`#manageCategories`)?.addEventListener(`click`,()=>{location.hash=`#/admin/categories`}),document.querySelector(`#manageProducts`)?.addEventListener(`click`,()=>{location.hash=`#/admin/products`}),document.querySelector(`#manageOrders`)?.addEventListener(`click`,()=>{location.hash=`#/admin/orders`})}async function k(){return await t()}function A(e){n(e)}async function j(){let e=document.querySelector(`#app`),t=f(),n=await k();function r(){let r=n.filter(e=>!e.eliminado);e.innerHTML=`
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goStore">Tienda</button>
          <button id="goDashboard">Panel Admin</button>
          <span class="nav-user">${t?.nombre??``} ${t?.apellido??``}</span>
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
            ${r.length===0?`<p>No hay categorías activas.</p>`:`
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
                      ${r.map(e=>`
                            <tr>
                              <td>${e.id}</td>
                              <td><img src="${e.imagen}" alt="${e.nombre}" class="table-img" /></td>
                              <td>${e.nombre}</td>
                              <td>${e.descripcion}</td>
                              <td class="table-actions">
                                <button class="edit-btn" data-id="${e.id}">Editar</button>
                                <button class="delete-btn" data-id="${e.id}">Eliminar</button>
                              </td>
                            </tr>
                          `).join(``)}
                    </tbody>
                  </table>
                `}
          </div>
        </section>
      </main>

      <div id="modalContainer"></div>
    `,i(),document.querySelector(`#newCategory`)?.addEventListener(`click`,()=>{a()}),document.querySelectorAll(`.edit-btn`).forEach(e=>{e.addEventListener(`click`,()=>{o(Number(e.dataset.id))})}),document.querySelectorAll(`.delete-btn`).forEach(e=>{e.addEventListener(`click`,()=>{s(Number(e.dataset.id))})})}function i(){document.querySelector(`#goStore`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goStoreSide`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goDashboard`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goDashboardSide`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goCategoriesSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/categories`),document.querySelector(`#goProductsSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/products`),document.querySelector(`#goOrdersSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/orders`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`})}function a(){let e=document.querySelector(`#modalContainer`);e.innerHTML=`
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
    `,document.querySelector(`#cancelModal`)?.addEventListener(`click`,c),document.querySelector(`#categoryForm`).addEventListener(`submit`,e=>{e.preventDefault();let t=document.querySelector(`#nombre`).value.trim(),i=document.querySelector(`#descripcion`).value.trim(),a=document.querySelector(`#imagen`).value.trim();if(!t||!i||!a){document.querySelector(`#categoryError`).textContent=`Todos los campos son obligatorios.`;return}let o={id:Date.now(),nombre:t,descripcion:i,imagen:a,eliminado:!1};n.push(o),A(n),c(),r()})}function o(e){let t=n.find(t=>t.id===e);if(!t)return;let i=document.querySelector(`#modalContainer`);i.innerHTML=`
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Editar Categoría</h2>
            <button id="cancelModal" class="modal-close">✕</button>
          </div>

          <form id="categoryForm">
            <label>Nombre</label>
            <input id="nombre" value="${t.nombre}" required />

            <label>Descripción</label>
            <textarea id="descripcion" required>${t.descripcion}</textarea>

            <label>URL de Imagen</label>
            <input id="imagen" value="${t.imagen}" required />

            <button type="submit" class="btn-primary btn-block">Guardar</button>
          </form>

          <p id="categoryError" class="error"></p>
        </section>
      </div>
    `,document.querySelector(`#cancelModal`)?.addEventListener(`click`,c),document.querySelector(`#categoryForm`).addEventListener(`submit`,e=>{e.preventDefault();let i=document.querySelector(`#nombre`).value.trim(),a=document.querySelector(`#descripcion`).value.trim(),o=document.querySelector(`#imagen`).value.trim();if(!i||!a||!o){document.querySelector(`#categoryError`).textContent=`Todos los campos son obligatorios.`;return}t.nombre=i,t.descripcion=a,t.imagen=o,A(n),c(),r()})}function s(e){let t=n.find(t=>t.id===e);t&&confirm(`¿Seguro que querés eliminar la categoría "${t.nombre}"?`)&&(t.eliminado=!0,A(n),r())}function c(){document.querySelector(`#modalContainer`).innerHTML=``}r()}async function M(){return await r()}async function N(){return await t()}function P(e){i(e)}async function F(){let e=document.querySelector(`#app`),t=f(),n=await M(),r=await N();function i(e){return r.find(t=>t.id===e)?.nombre??`Sin categoría`}function a(){let a=n.filter(e=>!e.eliminado),l=r.filter(e=>!e.eliminado);e.innerHTML=`
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goStore">Tienda</button>
          <button id="goDashboard">Panel Admin</button>
          <span class="nav-user">${t?.nombre??``} ${t?.apellido??``}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="admin-layout">
        <aside class="admin-sidebar">
          <h3>Administración</h3>
          <p class="sidebar-subtitle">Panel de control</p>
          <button id="goDashboardSide">📊 Dashboard</button>
          <button id="goCategoriesSide">📁 Categorías</button>
          <button class="active-admin-link" id="goProductsSide">🍔 Productos</button>
          <button id="goOrdersSide">📦 Pedidos</button>
          <button id="goStoreSide">🏪 Ir Tienda</button>
        </aside>

        <section class="admin-content">
          <div class="admin-header">
            <h2>Gestión de Productos</h2>
            <button id="newProduct" class="btn-new">+ Nuevo Producto</button>
          </div>

          <div class="table-card">
            ${a.length===0?`<p>No hay productos activos.</p>`:`
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
                      ${a.map(e=>`
                            <tr>
                              <td>${e.id}</td>
                              <td><img src="${e.imagen}" alt="${e.nombre}" class="table-img" /></td>
                              <td>${e.nombre}</td>
                              <td>${e.descripcion}</td>
                              <td>$${e.precio.toLocaleString(`es-AR`)}</td>
                              <td>${i(e.categoriaId)}</td>
                              <td>${e.stock}</td>
                              <td><span class="estado-indicator ${e.disponible?`estado-on`:`estado-off`}"></span></td>
                              <td class="table-actions">
                                <button class="edit-btn" data-id="${e.id}">Editar</button>
                                <button class="delete-btn" data-id="${e.id}">Eliminar</button>
                              </td>
                            </tr>
                          `).join(``)}
                    </tbody>
                  </table>
                `}
          </div>
        </section>
      </main>

      <div id="modalContainer"></div>
    `,o(),document.querySelector(`#newProduct`)?.addEventListener(`click`,()=>{s(l)}),document.querySelectorAll(`.edit-btn`).forEach(e=>{e.addEventListener(`click`,()=>{c(Number(e.dataset.id),l)})}),document.querySelectorAll(`.delete-btn`).forEach(e=>{e.addEventListener(`click`,()=>{u(Number(e.dataset.id))})})}function o(){document.querySelector(`#goStore`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goStoreSide`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goDashboard`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goDashboardSide`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goCategoriesSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/categories`),document.querySelector(`#goProductsSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/products`),document.querySelector(`#goOrdersSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/orders`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`})}function s(e){if(e.length===0){alert(`No hay categorías activas. Primero creá una categoría.`);return}l(null,e)}function c(e,t){let r=n.find(t=>t.id===e);r&&l(r,t)}function l(e,t){let r=document.querySelector(`#modalContainer`);r.innerHTML=`
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>${e?`Editar Producto`:`Nuevo Producto`}</h2>
            <button id="cancelModal" class="modal-close">✕</button>
          </div>

          <form id="productForm">
            <label>Nombre</label>
            <input id="nombre" required value="${e?.nombre??``}" placeholder="Nombre del producto" />

            <label>Descripción</label>
            <textarea id="descripcion" required placeholder="Descripción del producto">${e?.descripcion??``}</textarea>

            <label>Precio</label>
            <input id="precio" type="number" min="1" step="0.01" required value="${e?.precio??``}" placeholder="0.00" />

            <label>Stock</label>
            <input id="stock" type="number" min="0" required value="${e?.stock??``}" placeholder="0" />

            <label>Categoría</label>
            <select id="categoriaId" required>
              ${t.map(t=>`
                    <option value="${t.id}" ${e?.categoriaId===t.id?`selected`:``}>
                      ${t.nombre}
                    </option>
                  `).join(``)}
            </select>

            <label>URL de Imagen</label>
            <input id="imagen" required value="${e?.imagen??``}" placeholder="https://ejemplo.com/imagen.jpg" />

            <div class="checkbox-field">
              <input type="checkbox" id="disponible" ${e?.disponible===!1?``:`checked`} />
              <label for="disponible">Producto disponible</label>
            </div>

            <button type="submit" class="btn-primary btn-block">Guardar</button>
          </form>

          <p id="productError" class="error"></p>
        </section>
      </div>
    `,document.querySelector(`#cancelModal`)?.addEventListener(`click`,p),document.querySelector(`#productForm`).addEventListener(`submit`,t=>{t.preventDefault();let r=document.querySelector(`#nombre`).value.trim(),i=document.querySelector(`#descripcion`).value.trim(),o=Number(document.querySelector(`#precio`).value),s=Number(document.querySelector(`#stock`).value),c=Number(document.querySelector(`#categoriaId`).value),l=document.querySelector(`#imagen`).value.trim(),u=document.querySelector(`#disponible`).checked,d=document.querySelector(`#productError`);if(!r||!i||!l){d.textContent=`Todos los campos son obligatorios.`;return}if(o<=0){d.textContent=`El precio debe ser mayor a 0.`;return}if(s<0){d.textContent=`El stock no puede ser negativo.`;return}e?(e.nombre=r,e.descripcion=i,e.precio=o,e.stock=s,e.categoriaId=c,e.imagen=l,e.disponible=u):n.push({id:Date.now(),nombre:r,descripcion:i,precio:o,stock:s,categoriaId:c,imagen:l,disponible:u,eliminado:!1}),P(n),p(),a()})}function u(e){let t=n.find(t=>t.id===e);t&&confirm(`¿Seguro que querés eliminar el producto "${t.nombre}"?`)&&(t.eliminado=!0,P(n),a())}function p(){document.querySelector(`#modalContainer`).innerHTML=``}a()}async function I(){return await s()}function L(e){c(e)}async function R(){let e=document.querySelector(`#app`),t=f(),n=await I(),i=await a(),o=await r();function s(e){let t=i.find(t=>t.id===e);return t?`${t.nombre} ${t.apellido}`:`Usuario no encontrado`}function c(e){return o.find(t=>t.id===e)?.nombre??`Producto ID ${e}`}function l(r=``){let i=r?n.filter(e=>e.estado===r):n;e.innerHTML=`
      <header class="topbar">
        <h1>🍕 Food Store</h1>
        <nav>
          <button id="goStore">Tienda</button>
          <button id="goDashboard">Panel Admin</button>
          <span class="nav-user">${t?.nombre??``} ${t?.apellido??``}</span>
          <button id="logoutBtn" class="btn-logout">Cerrar Sesión</button>
        </nav>
      </header>

      <main class="admin-layout">
        <aside class="admin-sidebar">
          <h3>Administración</h3>
          <p class="sidebar-subtitle">Panel de control</p>
          <button id="goDashboardSide">📊 Dashboard</button>
          <button id="goCategoriesSide">📁 Categorías</button>
          <button id="goProductsSide">🍔 Productos</button>
          <button class="active-admin-link" id="goOrdersSide">📦 Pedidos</button>
          <button id="goStoreSide">🏪 Ir Tienda</button>
        </aside>

        <section class="admin-content">
          <div class="admin-header">
            <h2>Gestión de Pedidos</h2>

            <select id="estadoFiltro" class="filter-select">
              <option value="">Todos los pedidos</option>
              <option value="PENDIENTE" ${r===`PENDIENTE`?`selected`:``}>Pendiente</option>
              <option value="CONFIRMADO" ${r===`CONFIRMADO`?`selected`:``}>Confirmado</option>
              <option value="TERMINADO" ${r===`TERMINADO`?`selected`:``}>Terminado</option>
              <option value="CANCELADO" ${r===`CANCELADO`?`selected`:``}>Cancelado</option>
            </select>
          </div>

          <div class="orders-list">
            ${i.length===0?`<p class="empty-msg">No hay pedidos para mostrar.</p>`:i.sort((e,t)=>t.id-e.id).map(e=>`
                        <article class="order-card">
                          <div class="order-card-header">
                            <div>
                              <h3>Pedido #ORD-${e.id}</h3>
                              <p>Cliente: ${s(e.idUsuario)}</p>
                              <p class="order-date">📅 ${e.fecha}</p>
                              <p>${e.detalles.length} producto(s)</p>
                            </div>
                            <div class="order-card-right">
                              <span class="status-badge status-${e.estado.toLowerCase()}">${e.estado}</span>
                              <strong class="order-total">$${e.total.toLocaleString(`es-AR`)}</strong>
                            </div>
                          </div>
                          <div class="order-actions">
                            <button class="detail-btn" data-id="${e.id}">Ver detalle</button>
                          </div>
                        </article>
                      `).join(``)}
          </div>
        </section>
      </main>

      <div id="modalContainer"></div>
    `,u(),document.querySelector(`#estadoFiltro`)?.addEventListener(`change`,e=>{let t=e.target.value;l(t)}),document.querySelectorAll(`.detail-btn`).forEach(e=>{e.addEventListener(`click`,()=>p(Number(e.dataset.id)))})}function u(){document.querySelector(`#goStore`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goStoreSide`)?.addEventListener(`click`,()=>location.hash=`#/home`),document.querySelector(`#goDashboard`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goDashboardSide`)?.addEventListener(`click`,()=>location.hash=`#/admin`),document.querySelector(`#goCategoriesSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/categories`),document.querySelector(`#goProductsSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/products`),document.querySelector(`#goOrdersSide`)?.addEventListener(`click`,()=>location.hash=`#/admin/orders`),document.querySelector(`#logoutBtn`)?.addEventListener(`click`,()=>{d(),location.hash=`#/login`})}function p(e){let t=n.find(t=>t.id===e);if(!t)return;let r=t.detalles.reduce((e,t)=>e+t.subtotal,0),a=t.total-r,o=document.querySelector(`#modalContainer`);o.innerHTML=`
      <div class="modal-backdrop">
        <section class="modal">
          <div class="modal-header">
            <h2>Detalle del Pedido #ORD-${t.id}</h2>
            <button id="closeModal" class="modal-close">✕</button>
          </div>

          <div class="modal-detail-info">
            <p><strong>Cliente:</strong> ${s(t.idUsuario)}</p>
            <p><strong>Fecha:</strong> ${t.fecha}</p>
            <p><strong>Teléfono:</strong> ${i.find(e=>e.id===t.idUsuario)?.celular||`No disponible`}</p>
            <p><strong>Método de pago:</strong> ${t.formaPago}</p>
          </div>

          <hr />

          <h3>Productos:</h3>
          ${t.detalles.map(e=>`
                <div class="order-product-row">
                  <span>${c(e.idProducto)}</span>
                  <span>Cantidad: ${e.cantidad}</span>
                  <strong>$${e.subtotal.toLocaleString(`es-AR`)}</strong>
                </div>
              `).join(``)}

          <div class="order-totals">
            <p><span>Subtotal:</span> <strong>$${r.toLocaleString(`es-AR`)}</strong></p>
            <p><span>Envío:</span> <strong>$${a.toLocaleString(`es-AR`)}</strong></p>
            <p class="order-total-final"><span>Total:</span> <strong>$${t.total.toLocaleString(`es-AR`)}</strong></p>
          </div>

          <hr />

          <form id="estadoForm">
            <label>Cambiar Estado:</label>
            <select id="nuevoEstado">
              <option value="PENDIENTE" ${t.estado===`PENDIENTE`?`selected`:``}>PENDIENTE</option>
              <option value="CONFIRMADO" ${t.estado===`CONFIRMADO`?`selected`:``}>CONFIRMADO</option>
              <option value="TERMINADO" ${t.estado===`TERMINADO`?`selected`:``}>TERMINADO</option>
              <option value="CANCELADO" ${t.estado===`CANCELADO`?`selected`:``}>CANCELADO</option>
            </select>

            <button type="submit" class="btn-primary btn-block">Actualizar Estado</button>
          </form>
        </section>
      </div>
    `,document.querySelector(`#closeModal`)?.addEventListener(`click`,m),document.querySelector(`#estadoForm`).addEventListener(`submit`,e=>{e.preventDefault(),t.estado=document.querySelector(`#nuevoEstado`).value,L(n),m(),l()})}function m(){document.querySelector(`#modalContainer`).innerHTML=``}l()}function z(){let e=location.hash||`#/login`,t=f();if(e===`#/login`){p();return}if(e===`#/register`){m();return}if(!t){location.hash=`#/login`;return}if(e===`#/home`){C();return}if(e.startsWith(`#/product/`)){w(Number(e.replace(`#/product/`,``)));return}if(e===`#/cart`){E();return}if(e===`#/my-orders`){D();return}if(e===`#/admin`){if(t.rol!==`ADMIN`){location.hash=`#/home`;return}O();return}if(e===`#/admin/categories`){if(t.rol!==`ADMIN`){location.hash=`#/home`;return}j();return}if(e===`#/admin/products`){if(t.rol!==`ADMIN`){location.hash=`#/home`;return}F();return}if(e===`#/admin/orders`){if(t.rol!==`ADMIN`){location.hash=`#/home`;return}R();return}location.hash=`#/login`}window.addEventListener(`hashchange`,z),z();