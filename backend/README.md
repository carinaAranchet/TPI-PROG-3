# Food Store - Backend JPA / Consola

## Alumna
Carina Aranchet

## Descripción
Backend de consola para el sistema **Food Store**, desarrollado con Java, JPA, Hibernate y H2 en archivo.

Permite gestionar las entidades principales del dominio: `Categoria`, `Producto`, `Usuario`, `Pedido` y `DetallePedido`, aplicando relaciones JPA unidireccionales, baja lógica, repositorios, consultas JPQL personalizadas y transacciones.

## Tecnologías utilizadas

- Java 24
- Gradle
- JPA / Jakarta Persistence
- Hibernate ORM
- H2 Database
- Lombok

## Arquitectura de paquetes

```text
src/main/java/com/tp/jpa/
├── Main.java
├── dtos/
├── model/
│   ├── Base.java
│   ├── Calculable.java
│   ├── Categoria.java
│   ├── Producto.java
│   ├── Usuario.java
│   ├── Pedido.java
│   ├── DetallePedido.java
│   └── enums/
│       ├── Rol.java
│       ├── Estado.java
│       └── FormaPago.java
├── repository/
│   ├── BaseRepository.java
│   ├── CategoriaRepository.java
│   ├── ProductoRepository.java
│   ├── UsuarioRepository.java
│   └── PedidoRepository.java
└── util/
    └── JPAUtil.java
```

## Funcionalidades implementadas

### Categorías
- Alta
- Modificación
- Baja lógica con confirmación
- Listado de categorías activas
- Consulta JPQL de productos por categoría

### Productos
- Alta asociada a una categoría
- Modificación
- Baja lógica con confirmación
- Listado de productos activos

### Usuarios
- Alta
- Modificación
- Baja lógica con confirmación
- Listado de usuarios activos
- Búsqueda por mail mediante JPQL

### Pedidos
- Alta de pedido en una única transacción
- Validación de usuario, productos, disponibilidad y stock
- Descuento de stock al confirmar el pedido
- Cálculo automático del total desde los subtotales
- Cambio de estado con confirmación
- Baja lógica con confirmación
- Listado de pedidos activos
- Consultas por usuario y por estado

### Reportes
- Productos por categoría
- Pedidos por usuario
- Pedidos por estado
- Total facturado sobre pedidos terminados

## Base de datos

La aplicación usa H2 en modo archivo. Hibernate genera/actualiza las tablas automáticamente al ejecutar el proyecto.

Configuración principal en:

```text
src/main/resources/META-INF/persistence.xml
```

## Ejecución

1. Abrir el proyecto en IntelliJ IDEA.
2. Sincronizar Gradle.
3. Ejecutar la clase:

```text
com.tp.jpa.Main
```

4. Usar el menú de consola.

## Notas de entrega

Se excluyen archivos generados o locales como `.git`, `.gradle`, `.idea`, `build/` y la base H2 generada en `data/`.

## Autor
Carina Aranchet  
Tecnicatura Universitaria en Programación - UTN
