# Food Store - Frontend

## Descripción

Frontend web del sistema Food Store desarrollado con Vite, TypeScript, HTML5 y CSS3.

La aplicación permite iniciar sesión con distintos roles, navegar un catálogo de productos, ver detalle de producto, gestionar un carrito de compras, confirmar pedidos y consultar el historial de pedidos.

También incluye un panel de administración para gestionar categorías, productos y pedidos.

## Tecnologías utilizadas

- Vite
- TypeScript
- HTML5
- CSS3
- LocalStorage
- Fetch API

## Fuente de datos

La aplicación consume datos desde archivos JSON locales ubicados en:

- public/data/categorias.json
- public/data/productos.json
- public/data/usuarios.json
- public/data/pedidos.json

Las operaciones de escritura se realizan en memoria y LocalStorage, según lo solicitado para esta iteración educativa.

## Integración futura con API REST

Actualmente el frontend consume archivos JSON locales mediante fetch desde la carpeta public/data.

Esta decisión permite simular el comportamiento de una API y probar los flujos del sistema sin depender todavía de un backend REST.

La carga de datos está centralizada en src/utils/api.ts, por lo que en una futura iteración se podrían reemplazar las rutas actuales:

fetch("/data/productos.json")

por endpoints reales como:

fetch("/api/productos")

De esta forma, las pantallas principales no deberían reescribirse, sino solamente adaptar la capa de acceso a datos.

Ejemplo de equivalencias futuras:

- GET /data/productos.json -> GET /api/productos
- GET /data/categorias.json -> GET /api/categorias
- GET /data/usuarios.json -> GET /api/usuarios
- GET /data/pedidos.json -> GET /api/pedidos

Las operaciones de alta, modificación y baja que hoy se resuelven en memoria o LocalStorage podrían reemplazarse por métodos HTTP como POST, PUT/PATCH y DELETE.

## Credenciales de prueba

### Administrador

Email:

admin@foodstore.com

Contraseña:

admin123

### Usuario cliente

Email:

cliente@foodstore.com

Contraseña:

cliente123

## Envío

Para esta iteración se definió el costo de envío como:

ENVIO = 500

El total del pedido se calcula como:

subtotal + envío

## Instrucciones de ejecución

1. Abrir una terminal en la carpeta del proyecto.
2. Instalar dependencias:

npm install

3. Ejecutar el servidor de desarrollo:

npm run dev

4. Abrir la URL indicada por Vite en el navegador.

## Funcionalidades principales

### Usuario

- Login
- Registro
- Catálogo de productos
- Filtro por categoría
- Búsqueda por nombre
- Ordenamiento por nombre y precio
- Detalle de producto
- Carrito de compras
- Checkout
- Mis pedidos

### Administrador

- Dashboard
- CRUD de categorías
- CRUD de productos
- Gestión de pedidos
- Cambio de estado de pedidos