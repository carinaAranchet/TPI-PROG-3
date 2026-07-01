package com.tp.jpa;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.DetallePedido;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.Producto;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

public class Main {

    private static final Scanner scanner = new Scanner(System.in);

    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();

    public static void main(String[] args) {
        int opcion;

        do {
            System.out.println("\n===== MENU PRINCIPAL =====");
            System.out.println("1. Categorias");
            System.out.println("2. Productos");
            System.out.println("3. Usuarios");
            System.out.println("4. Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> menuCategorias();
                case 2 -> menuProductos();
                case 3 -> menuUsuarios();
                case 4 -> menuPedidos();
                case 5 -> menuReportes();
                case 0 -> System.out.println("Saliendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);

        JPAUtil.close();
    }

    // =========================
    // CATEGORIAS
    // =========================

    private static void menuCategorias() {
        int opcion;

        do {
            System.out.println("\n===== ABM CATEGORIAS =====");
            System.out.println("1. Alta");
            System.out.println("2. Modificacion");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaCategoria();
                case 2 -> modificarCategoria();
                case 3 -> bajaCategoria();
                case 4 -> listarCategorias();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);
    }

    private static void altaCategoria() {
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        if (nombre.isBlank()) {
            System.out.println("Error: el nombre no puede estar vacio.");
            return;
        }

        System.out.print("Descripcion: ");
        String descripcion = scanner.nextLine();

        Categoria categoria = Categoria.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .eliminado(false)
                .createdAt(LocalDateTime.now())
                .build();

        Categoria guardada = categoriaRepo.guardar(categoria);

        System.out.println("Categoria creada correctamente. ID generado: " + guardada.getId());
    }

    private static void modificarCategoria() {
        if (categoriaRepo.listarActivos().isEmpty()) {
            System.out.println("No hay categorias activas. No se puede modificar.");
            return;
        }

        listarCategorias();

        System.out.print("Ingrese ID de la categoria a modificar: ");
        Long id = leerLong();

        Optional<Categoria> categoriaOpt = categoriaRepo.buscarPorId(id);

        if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
            System.out.println("Error: categoria inexistente o dada de baja.");
            return;
        }

        Categoria categoria = categoriaOpt.get();

        System.out.println("Nombre actual: " + categoria.getNombre());
        System.out.print("Nuevo nombre (enter para conservar): ");
        String nuevoNombre = scanner.nextLine();

        System.out.println("Descripcion actual: " + categoria.getDescripcion());
        System.out.print("Nueva descripcion (enter para conservar): ");
        String nuevaDescripcion = scanner.nextLine();

        if (!nuevoNombre.isBlank()) {
            categoria.setNombre(nuevoNombre);
        }

        if (!nuevaDescripcion.isBlank()) {
            categoria.setDescripcion(nuevaDescripcion);
        }

        categoriaRepo.guardar(categoria);

        System.out.println("Categoria modificada correctamente.");
    }

    private static void bajaCategoria() {
        if (categoriaRepo.listarActivos().isEmpty()) {
            System.out.println("No hay categorias activas. No se puede dar de baja.");
            return;
        }

        listarCategorias();

        System.out.print("Ingrese ID de la categoria a dar de baja: ");
        Long id = leerLong();

        Optional<Categoria> categoriaOpt = categoriaRepo.buscarPorId(id);

        if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
            System.out.println("Error: categoria inexistente o ya dada de baja.");
            return;
        }

        String nombre = categoriaOpt.get().getNombre();

        if (!confirmar("Confirma la baja logica de la categoria '" + nombre + "'?")) {
            System.out.println("Operacion cancelada.");
            return;
        }

        boolean eliminado = categoriaRepo.eliminarLogico(id);

        if (eliminado) {
            System.out.println("Categoria dada de baja correctamente: " + nombre);
        } else {
            System.out.println("No se pudo dar de baja la categoria.");
        }
    }

    private static void listarCategorias() {
        List<Categoria> categorias = categoriaRepo.listarActivos();

        System.out.println("\n===== CATEGORIAS ACTIVAS =====");

        if (categorias.isEmpty()) {
            System.out.println("No hay categorias activas.");
            return;
        }

        for (Categoria c : categorias) {
            System.out.println("ID: " + c.getId()
                    + " | Nombre: " + c.getNombre()
                    + " | Descripcion: " + c.getDescripcion());
        }
    }

    // =========================
    // PRODUCTOS
    // =========================

    private static void menuProductos() {
        int opcion;

        do {
            System.out.println("\n===== ABM PRODUCTOS =====");
            System.out.println("1. Alta");
            System.out.println("2. Modificacion");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaProducto();
                case 2 -> modificarProducto();
                case 3 -> bajaProducto();
                case 4 -> listarProductos();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);
    }

    private static void altaProducto() {
        List<Categoria> categorias = categoriaRepo.listarActivos();

        if (categorias.isEmpty()) {
            System.out.println("No hay categorias activas. No se puede crear un producto.");
            return;
        }

        listarCategorias();

        System.out.print("Seleccione ID de categoria: ");
        Long categoriaId = leerLong();

        Optional<Categoria> categoriaOpt = categoriaRepo.buscarPorId(categoriaId);

        if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
            System.out.println("Error: categoria invalida.");
            return;
        }

        Categoria categoria = categoriaOpt.get();

        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        if (nombre.isBlank()) {
            System.out.println("Error: el nombre no puede estar vacio.");
            return;
        }

        System.out.print("Descripcion: ");
        String descripcion = scanner.nextLine();

        System.out.print("Precio: ");
        Double precio = leerDouble();

        if (precio <= 0) {
            System.out.println("Error: el precio debe ser mayor a 0.");
            return;
        }

        System.out.print("Stock: ");
        Integer stock = leerEntero();

        if (stock < 0) {
            System.out.println("Error: el stock no puede ser negativo.");
            return;
        }

        System.out.print("Imagen (opcional): ");
        String imagen = scanner.nextLine();

        System.out.print("Disponible? (S/N, default S): ");
        String disponibleTexto = scanner.nextLine();
        boolean disponible = !disponibleTexto.equalsIgnoreCase("N");

        Producto producto = Producto.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(precio)
                .stock(stock)
                .imagen(imagen)
                .disponible(disponible)
                .eliminado(false)
                .createdAt(LocalDateTime.now())
                .build();

        Producto productoGuardado = productoRepo.guardar(producto);

        categoria.getProductos().add(productoGuardado);
        categoriaRepo.guardar(categoria);

        System.out.println("Producto creado correctamente. ID: "
                + productoGuardado.getId()
                + " | Categoria: "
                + categoria.getNombre());
    }

    private static void modificarProducto() {
        if (productoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay productos activos. No se puede modificar.");
            return;
        }

        listarProductos();

        System.out.print("Ingrese ID del producto a modificar: ");
        Long id = leerLong();

        Optional<Producto> productoOpt = productoRepo.buscarPorId(id);

        if (productoOpt.isEmpty() || productoOpt.get().isEliminado()) {
            System.out.println("Error: producto inexistente o dado de baja.");
            return;
        }

        Producto producto = productoOpt.get();

        System.out.println("Nombre actual: " + producto.getNombre());
        System.out.print("Nuevo nombre (enter para conservar): ");
        String nuevoNombre = scanner.nextLine();

        System.out.println("Precio actual: " + producto.getPrecio());
        System.out.print("Nuevo precio (enter para conservar): ");
        String nuevoPrecioTexto = scanner.nextLine();

        System.out.println("Stock actual: " + producto.getStock());
        System.out.print("Nuevo stock (enter para conservar): ");
        String nuevoStockTexto = scanner.nextLine();

        System.out.println("Disponible actual: " + producto.getDisponible());
        System.out.print("Disponible? S/N (enter para conservar): ");
        String disponibleTexto = scanner.nextLine();

        if (!nuevoNombre.isBlank()) {
            producto.setNombre(nuevoNombre);
        }

        if (!nuevoPrecioTexto.isBlank()) {
            Double nuevoPrecio = Double.parseDouble(nuevoPrecioTexto);

            if (nuevoPrecio <= 0) {
                System.out.println("Error: el precio debe ser mayor a 0.");
                return;
            }

            producto.setPrecio(nuevoPrecio);
        }

        if (!nuevoStockTexto.isBlank()) {
            Integer nuevoStock = Integer.parseInt(nuevoStockTexto);

            if (nuevoStock < 0) {
                System.out.println("Error: el stock no puede ser negativo.");
                return;
            }

            producto.setStock(nuevoStock);
        }

        if (!disponibleTexto.isBlank()) {
            producto.setDisponible(disponibleTexto.equalsIgnoreCase("S"));
        }

        productoRepo.guardar(producto);

        System.out.println("Producto modificado correctamente.");
    }

    private static void bajaProducto() {
        if (productoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay productos activos. No se puede dar de baja.");
            return;
        }

        listarProductos();

        System.out.print("Ingrese ID del producto a dar de baja: ");
        Long id = leerLong();

        Optional<Producto> productoOpt = productoRepo.buscarPorId(id);

        if (productoOpt.isEmpty() || productoOpt.get().isEliminado()) {
            System.out.println("Error: producto inexistente o ya dado de baja.");
            return;
        }

        String nombre = productoOpt.get().getNombre();

        if (!confirmar("Confirma la baja logica del producto '" + nombre + "'?")) {
            System.out.println("Operacion cancelada.");
            return;
        }

        boolean eliminado = productoRepo.eliminarLogico(id);

        if (eliminado) {
            System.out.println("Producto dado de baja correctamente: " + nombre);
        } else {
            System.out.println("No se pudo dar de baja el producto.");
        }
    }

    private static void listarProductos() {
        List<Producto> productos = productoRepo.listarActivos();

        System.out.println("\n===== PRODUCTOS ACTIVOS =====");

        if (productos.isEmpty()) {
            System.out.println("No hay productos activos.");
            return;
        }

        for (Producto p : productos) {
            String categoriaNombre = obtenerNombreCategoriaDeProducto(p.getId());

            System.out.println("ID: " + p.getId()
                    + " | Nombre: " + p.getNombre()
                    + " | Precio: " + p.getPrecio()
                    + " | Stock: " + p.getStock()
                    + " | Disponible: " + p.getDisponible()
                    + " | Categoria: " + categoriaNombre);
        }
    }

    // =========================
    // USUARIOS
    // =========================

    private static void menuUsuarios() {
        int opcion;

        do {
            System.out.println("\n===== ABM USUARIOS =====");
            System.out.println("1. Alta");
            System.out.println("2. Modificacion");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaUsuario();
                case 2 -> modificarUsuario();
                case 3 -> bajaUsuario();
                case 4 -> listarUsuarios();
                case 5 -> buscarUsuarioPorMail();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);
    }

    private static void altaUsuario() {
        System.out.print("Nombre: ");
        String nombre = scanner.nextLine();

        if (nombre.isBlank()) {
            System.out.println("Error: el nombre no puede estar vacio.");
            return;
        }

        System.out.print("Apellido: ");
        String apellido = scanner.nextLine();

        if (apellido.isBlank()) {
            System.out.println("Error: el apellido no puede estar vacio.");
            return;
        }

        System.out.print("Mail: ");
        String mail = scanner.nextLine();

        if (mail.isBlank()) {
            System.out.println("Error: el mail no puede estar vacio.");
            return;
        }

        Optional<Usuario> existente = usuarioRepo.buscarPorMail(mail);

        if (existente.isPresent()) {
            System.out.println("Error: ya existe un usuario activo con ese mail.");
            return;
        }

        System.out.print("Celular (opcional): ");
        String celular = scanner.nextLine();

        System.out.print("Contrasenia: ");
        String contrasenia = scanner.nextLine();

        if (contrasenia.isBlank()) {
            System.out.println("Error: la contrasenia no puede estar vacia.");
            return;
        }

        Rol rol = seleccionarRol();

        if (rol == null) {
            System.out.println("Error: rol invalido.");
            return;
        }

        Usuario usuario = Usuario.builder()
                .nombre(nombre)
                .apellido(apellido)
                .mail(mail)
                .celular(celular)
                .contrasenia(contrasenia)
                .rol(rol)
                .eliminado(false)
                .createdAt(LocalDateTime.now())
                .build();

        Usuario guardado = usuarioRepo.guardar(usuario);

        System.out.println("Usuario creado correctamente. ID generado: " + guardado.getId());
    }

    private static void modificarUsuario() {
        if (usuarioRepo.listarActivos().isEmpty()) {
            System.out.println("No hay usuarios activos. No se puede modificar.");
            return;
        }

        listarUsuarios();

        System.out.print("Ingrese ID del usuario a modificar: ");
        Long id = leerLong();

        Optional<Usuario> usuarioOpt = usuarioRepo.buscarPorId(id);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().isEliminado()) {
            System.out.println("Error: usuario inexistente o dado de baja.");
            return;
        }

        Usuario usuario = usuarioOpt.get();

        System.out.println("Nombre actual: " + usuario.getNombre());
        System.out.print("Nuevo nombre (enter para conservar): ");
        String nuevoNombre = scanner.nextLine();

        System.out.println("Apellido actual: " + usuario.getApellido());
        System.out.print("Nuevo apellido (enter para conservar): ");
        String nuevoApellido = scanner.nextLine();

        System.out.println("Mail actual: " + usuario.getMail());
        System.out.print("Nuevo mail (enter para conservar): ");
        String nuevoMail = scanner.nextLine();

        System.out.println("Celular actual: " + usuario.getCelular());
        System.out.print("Nuevo celular (enter para conservar): ");
        String nuevoCelular = scanner.nextLine();

        System.out.print("Nueva contrasenia (enter para conservar): ");
        String nuevaContrasenia = scanner.nextLine();

        if (!nuevoNombre.isBlank()) {
            usuario.setNombre(nuevoNombre);
        }

        if (!nuevoApellido.isBlank()) {
            usuario.setApellido(nuevoApellido);
        }

        if (!nuevoMail.isBlank()) {
            Optional<Usuario> usuarioConEseMail = usuarioRepo.buscarPorMail(nuevoMail);

            if (usuarioConEseMail.isPresent()
                    && !usuarioConEseMail.get().getId().equals(usuario.getId())) {
                System.out.println("Error: el mail ya esta en uso por otro usuario.");
                return;
            }

            usuario.setMail(nuevoMail);
        }

        if (!nuevoCelular.isBlank()) {
            usuario.setCelular(nuevoCelular);
        }

        if (!nuevaContrasenia.isBlank()) {
            usuario.setContrasenia(nuevaContrasenia);
        }

        usuarioRepo.guardar(usuario);

        System.out.println("Usuario modificado correctamente.");
    }

    private static void bajaUsuario() {
        if (usuarioRepo.listarActivos().isEmpty()) {
            System.out.println("No hay usuarios activos. No se puede dar de baja.");
            return;
        }

        listarUsuarios();

        System.out.print("Ingrese ID del usuario a dar de baja: ");
        Long id = leerLong();

        Optional<Usuario> usuarioOpt = usuarioRepo.buscarPorId(id);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().isEliminado()) {
            System.out.println("Error: usuario inexistente o ya dado de baja.");
            return;
        }

        String nombreCompleto = usuarioOpt.get().getNombre() + " " + usuarioOpt.get().getApellido();

        if (!confirmar("Confirma la baja logica del usuario '" + nombreCompleto + "'?")) {
            System.out.println("Operacion cancelada.");
            return;
        }

        boolean eliminado = usuarioRepo.eliminarLogico(id);

        if (eliminado) {
            System.out.println("Usuario dado de baja correctamente: " + nombreCompleto);
        } else {
            System.out.println("No se pudo dar de baja el usuario.");
        }
    }

    private static void listarUsuarios() {
        List<Usuario> usuarios = usuarioRepo.listarActivos();

        System.out.println("\n===== USUARIOS ACTIVOS =====");

        if (usuarios.isEmpty()) {
            System.out.println("No hay usuarios activos.");
            return;
        }

        for (Usuario u : usuarios) {
            System.out.println("ID: " + u.getId()
                    + " | Nombre: " + u.getNombre() + " " + u.getApellido()
                    + " | Mail: " + u.getMail()
                    + " | Rol: " + u.getRol());
        }
    }

    private static void buscarUsuarioPorMail() {
        if (usuarioRepo.listarActivos().isEmpty()) {
            System.out.println("No hay usuarios activos. No se puede buscar por mail.");
            return;
        }

        System.out.print("Ingrese mail: ");
        String mail = scanner.nextLine();

        if (mail.isBlank()) {
            System.out.println("Error: el mail no puede estar vacio.");
            return;
        }

        Optional<Usuario> usuarioOpt = usuarioRepo.buscarPorMail(mail);

        if (usuarioOpt.isEmpty()) {
            System.out.println("No existe usuario activo con ese mail.");
            return;
        }

        Usuario u = usuarioOpt.get();

        System.out.println("\n===== USUARIO ENCONTRADO =====");
        System.out.println("ID: " + u.getId());
        System.out.println("Nombre: " + u.getNombre());
        System.out.println("Apellido: " + u.getApellido());
        System.out.println("Mail: " + u.getMail());
        System.out.println("Celular: " + u.getCelular());
        System.out.println("Rol: " + u.getRol());
    }

    // =========================
    // PEDIDOS
    // =========================

    private static void menuPedidos() {
        int opcion;

        do {
            System.out.println("\n===== PEDIDOS =====");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> altaPedido();
                case 2 -> cambiarEstadoPedido();
                case 3 -> bajaPedido();
                case 4 -> listarPedidos();
                case 5 -> pedidosPorUsuario();
                case 6 -> pedidosPorEstado();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);
    }

    private static void altaPedido() {
        if (usuarioRepo.listarActivos().isEmpty()) {
            System.out.println("No hay usuarios activos. No se puede crear un pedido.");
            return;
        }

        if (productoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay productos activos. No se puede crear un pedido.");
            return;
        }

        listarUsuarios();

        System.out.print("Seleccione ID de usuario: ");
        Long usuarioId = leerLong();

        Optional<Usuario> usuarioOpt = usuarioRepo.buscarPorId(usuarioId);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().isEliminado()) {
            System.out.println("Error: usuario invalido.");
            return;
        }

        FormaPago formaPago = seleccionarFormaPago();

        if (formaPago == null) {
            System.out.println("Error: forma de pago invalida.");
            return;
        }

        List<ItemPedidoTemp> items = new ArrayList<>();
        boolean agregarOtro;

        do {
            listarProductos();

            System.out.print("Ingrese ID del producto: ");
            Long productoId = leerLong();

            Optional<Producto> productoOpt = productoRepo.buscarPorId(productoId);

            if (productoOpt.isEmpty() || productoOpt.get().isEliminado()) {
                System.out.println("Error: producto inexistente o dado de baja.");
                agregarOtro = preguntarSiAgregaOtro();
                continue;
            }

            Producto producto = productoOpt.get();

            if (producto.getDisponible() == null || !producto.getDisponible()) {
                System.out.println("Error: el producto no esta disponible.");
                agregarOtro = preguntarSiAgregaOtro();
                continue;
            }

            System.out.print("Cantidad: ");
            Integer cantidad = leerEntero();

            if (cantidad <= 0) {
                System.out.println("Error: la cantidad debe ser mayor a cero.");
                agregarOtro = preguntarSiAgregaOtro();
                continue;
            }

            if (producto.getStock() < cantidad) {
                System.out.println("Error: stock insuficiente. Stock disponible: " + producto.getStock());
                agregarOtro = preguntarSiAgregaOtro();
                continue;
            }

            items.add(new ItemPedidoTemp(productoId, cantidad));

            agregarOtro = preguntarSiAgregaOtro();

        } while (agregarOtro);

        if (items.isEmpty()) {
            System.out.println("Error: el pedido debe tener al menos un detalle.");
            return;
        }

        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            em.getTransaction().begin();

            Usuario usuarioGestionado = em.find(Usuario.class, usuarioId);

            if (usuarioGestionado == null || usuarioGestionado.isEliminado()) {
                throw new IllegalArgumentException("Usuario invalido.");
            }

            Pedido pedido = Pedido.builder()
                    .fecha(LocalDate.now())
                    .estado(Estado.PENDIENTE)
                    .formaPago(formaPago)
                    .total(0.0)
                    .eliminado(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            for (ItemPedidoTemp item : items) {
                Producto productoGestionado = em.find(Producto.class, item.productoId());

                if (productoGestionado == null || productoGestionado.isEliminado()) {
                    throw new IllegalArgumentException("Producto invalido.");
                }

                if (productoGestionado.getDisponible() == null || !productoGestionado.getDisponible()) {
                    throw new IllegalArgumentException("Producto no disponible: " + productoGestionado.getNombre());
                }

                if (productoGestionado.getStock() < item.cantidad()) {
                    throw new IllegalArgumentException("Stock insuficiente para: " + productoGestionado.getNombre());
                }

                pedido.addDetallePedido(item.cantidad(), productoGestionado);

                productoGestionado.setStock(productoGestionado.getStock() - item.cantidad());
            }

            pedido.calcularTotal();

            usuarioGestionado.getPedidos().add(pedido);
            em.merge(usuarioGestionado);

            em.getTransaction().commit();

            System.out.println("\nPedido creado correctamente.");
            System.out.println("ID generado: " + pedido.getId());
            System.out.println("Fecha: " + pedido.getFecha());
            System.out.println("Usuario: " + usuarioGestionado.getNombre() + " " + usuarioGestionado.getApellido());
            System.out.println("Forma de pago: " + pedido.getFormaPago());
            System.out.println("Estado: " + pedido.getEstado());

            System.out.println("\nDetalle:");
            for (DetallePedido d : pedido.getDetalles()) {
                System.out.println("- " + d.getProducto().getNombre()
                        + " | Cantidad: " + d.getCantidad()
                        + " | Subtotal: " + d.getSubtotal());
            }

            System.out.println("TOTAL: " + pedido.getTotal());

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }

            System.out.println("Error al crear el pedido. Se realizo rollback.");
            System.out.println("Detalle: " + e.getMessage());

        } finally {
            em.close();
        }
    }

    private static void cambiarEstadoPedido() {
        if (pedidoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay pedidos activos. No se puede cambiar el estado.");
            return;
        }

        listarPedidos();

        System.out.print("Ingrese ID del pedido: ");
        Long id = leerLong();

        Optional<Pedido> pedidoOpt = pedidoRepo.buscarPorId(id);

        if (pedidoOpt.isEmpty() || pedidoOpt.get().isEliminado()) {
            System.out.println("Error: pedido inexistente o dado de baja.");
            return;
        }

        Pedido pedido = pedidoOpt.get();

        System.out.println("Estado actual: " + pedido.getEstado());

        Estado nuevoEstado = seleccionarEstado();

        if (nuevoEstado == null) {
            System.out.println("Error: estado invalido.");
            return;
        }

        if (!confirmar("Confirma cambiar el estado del pedido " + pedido.getId() + " a " + nuevoEstado + "?")) {
            System.out.println("Operacion cancelada.");
            return;
        }

        pedido.setEstado(nuevoEstado);

        pedidoRepo.guardar(pedido);

        System.out.println("Pedido actualizado correctamente. ID: "
                + pedido.getId()
                + " | Nuevo estado: "
                + nuevoEstado);
    }

    private static void bajaPedido() {
        if (pedidoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay pedidos activos. No se puede dar de baja.");
            return;
        }

        listarPedidos();

        System.out.print("Ingrese ID del pedido a dar de baja: ");
        Long id = leerLong();

        Optional<Pedido> pedidoOpt = pedidoRepo.buscarPorId(id);

        if (pedidoOpt.isEmpty() || pedidoOpt.get().isEliminado()) {
            System.out.println("Error: pedido inexistente o ya dado de baja.");
            return;
        }

        Double total = pedidoOpt.get().getTotal();

        if (!confirmar("Confirma la baja logica del pedido " + id + "?")) {
            System.out.println("Operacion cancelada.");
            return;
        }

        boolean eliminado = pedidoRepo.eliminarLogico(id);

        if (eliminado) {
            System.out.println("Pedido dado de baja correctamente. ID: " + id + " | Total: " + total);
        } else {
            System.out.println("No se pudo dar de baja el pedido.");
        }
    }

    private static void listarPedidos() {
        List<Pedido> pedidos = pedidoRepo.listarActivos();

        System.out.println("\n===== PEDIDOS ACTIVOS =====");

        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos activos.");
            return;
        }

        for (Pedido p : pedidos) {
            String nombreUsuario = obtenerNombreUsuarioDePedido(p.getId());

            System.out.println("ID: " + p.getId()
                    + " | Fecha: " + p.getFecha()
                    + " | Estado: " + p.getEstado()
                    + " | Forma de pago: " + p.getFormaPago()
                    + " | Usuario: " + nombreUsuario
                    + " | Total: " + p.getTotal());
        }
    }

    private static void pedidosPorUsuario() {
        List<Usuario> usuarios = usuarioRepo.listarActivos();

        if (usuarios.isEmpty()) {
            System.out.println("No hay usuarios registrados.");
            return;
        }

        listarUsuarios();

        System.out.print("Ingrese ID de usuario: ");
        Long idUsuario = leerLong();

        Optional<Usuario> usuarioOpt = usuarioRepo.buscarPorId(idUsuario);

        if (usuarioOpt.isEmpty() || usuarioOpt.get().isEliminado()) {
            System.out.println("Error: usuario invalido.");
            return;
        }

        List<Pedido> pedidos = usuarioRepo.buscarPedidosPorUsuario(idUsuario);

        System.out.println("\n===== PEDIDOS POR USUARIO =====");

        if (pedidos.isEmpty()) {
            System.out.println("El usuario no tiene pedidos activos.");
            return;
        }

        for (Pedido p : pedidos) {
            System.out.println("ID: " + p.getId()
                    + " | Fecha: " + p.getFecha()
                    + " | Estado: " + p.getEstado()
                    + " | Forma de pago: " + p.getFormaPago()
                    + " | Total: " + p.getTotal());
        }
    }

    private static void pedidosPorEstado() {
        if (pedidoRepo.listarActivos().isEmpty()) {
            System.out.println("No hay pedidos activos. No se puede consultar por estado.");
            return;
        }

        Estado estado = seleccionarEstado();

        if (estado == null) {
            System.out.println("Error: estado invalido.");
            return;
        }

        List<Pedido> pedidos = pedidoRepo.buscarPorEstado(estado);

        System.out.println("\n===== PEDIDOS POR ESTADO =====");

        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos activos con ese estado.");
            return;
        }

        for (Pedido p : pedidos) {
            String nombreUsuario = obtenerNombreUsuarioDePedido(p.getId());

            System.out.println("ID: " + p.getId()
                    + " | Fecha: " + p.getFecha()
                    + " | Usuario: " + nombreUsuario
                    + " | Total: " + p.getTotal());
        }
    }

    // =========================
    // REPORTES
    // =========================

    private static void menuReportes() {
        int opcion;

        do {
            System.out.println("\n===== REPORTES =====");
            System.out.println("1. Productos por categoria");
            System.out.println("2. Pedidos por usuario");
            System.out.println("3. Pedidos por estado");
            System.out.println("4. Total facturado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");

            opcion = leerEntero();

            switch (opcion) {
                case 1 -> productosPorCategoria();
                case 2 -> pedidosPorUsuario();
                case 3 -> pedidosPorEstado();
                case 4 -> totalFacturado();
                case 0 -> System.out.println("Volviendo...");
                default -> System.out.println("Opcion invalida.");
            }

        } while (opcion != 0);
    }

    private static void productosPorCategoria() {
        if (categoriaRepo.listarActivos().isEmpty()) {
            System.out.println("No hay categorias activas. No se puede consultar productos por categoria.");
            return;
        }

        listarCategorias();

        System.out.print("Ingrese ID de categoria: ");
        Long categoriaId = leerLong();

        Optional<Categoria> categoriaOpt = categoriaRepo.buscarPorId(categoriaId);

        if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
            System.out.println("Error: categoria invalida.");
            return;
        }

        List<Producto> productos = categoriaRepo.buscarProductosPorCategoria(categoriaId);

        System.out.println("\n===== PRODUCTOS POR CATEGORIA =====");

        if (productos.isEmpty()) {
            System.out.println("No hay productos activos para esa categoria.");
            return;
        }

        for (Producto p : productos) {
            System.out.println("ID: " + p.getId()
                    + " | Nombre: " + p.getNombre()
                    + " | Precio: " + p.getPrecio()
                    + " | Stock: " + p.getStock());
        }
    }

    private static void totalFacturado() {
        List<Pedido> pedidosTerminados = pedidoRepo.buscarPorEstado(Estado.TERMINADO);

        System.out.println("\n===== TOTAL FACTURADO =====");

        if (pedidosTerminados.isEmpty()) {
            System.out.println("No hay pedidos terminados. Total facturado: $0.00");
            return;
        }

        double total = pedidosTerminados.stream()
                .mapToDouble(p -> p.getTotal() != null ? p.getTotal() : 0.0)
                .sum();

        System.out.printf("Total facturado: $%.2f%n", total);
    }

    // =========================
    // SELECTORES
    // =========================

    private static Rol seleccionarRol() {
        System.out.println("Seleccione rol:");
        System.out.println("1. ADMIN");
        System.out.println("2. USUARIO");
        System.out.print("Opcion: ");

        int opcion = leerEntero();

        return switch (opcion) {
            case 1 -> Rol.ADMIN;
            case 2 -> Rol.USUARIO;
            default -> null;
        };
    }

    private static FormaPago seleccionarFormaPago() {
        System.out.println("Seleccione forma de pago:");
        System.out.println("1. TARJETA");
        System.out.println("2. TRANSFERENCIA");
        System.out.println("3. EFECTIVO");
        System.out.print("Opcion: ");

        int opcion = leerEntero();

        return switch (opcion) {
            case 1 -> FormaPago.TARJETA;
            case 2 -> FormaPago.TRANSFERENCIA;
            case 3 -> FormaPago.EFECTIVO;
            default -> null;
        };
    }

    private static Estado seleccionarEstado() {
        System.out.println("Seleccione estado:");
        System.out.println("1. PENDIENTE");
        System.out.println("2. CONFIRMADO");
        System.out.println("3. TERMINADO");
        System.out.println("4. CANCELADO");
        System.out.print("Opcion: ");

        int opcion = leerEntero();

        return switch (opcion) {
            case 1 -> Estado.PENDIENTE;
            case 2 -> Estado.CONFIRMADO;
            case 3 -> Estado.TERMINADO;
            case 4 -> Estado.CANCELADO;
            default -> null;
        };
    }

    // =========================
    // HELPERS
    // =========================

    private static boolean confirmar(String mensaje) {
        System.out.print(mensaje + " (S/N): ");
        String respuesta = scanner.nextLine();
        return respuesta.equalsIgnoreCase("S");
    }

    private static boolean preguntarSiAgregaOtro() {
        System.out.print("Desea agregar otro producto? (S/N): ");
        String respuesta = scanner.nextLine();
        return respuesta.equalsIgnoreCase("S");
    }

    private static String obtenerNombreCategoriaDeProducto(Long productoId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            List<Categoria> categorias = em.createQuery(
                            "SELECT c FROM Categoria c JOIN c.productos p WHERE p.id = :pid",
                            Categoria.class
                    )
                    .setParameter("pid", productoId)
                    .getResultList();

            if (categorias.isEmpty()) {
                return "Sin categoria";
            }

            return categorias.get(0).getNombre();

        } finally {
            em.close();
        }
    }

    private static String obtenerNombreUsuarioDePedido(Long pedidoId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();

        try {
            List<Usuario> usuarios = em.createQuery(
                            "SELECT u FROM Usuario u JOIN u.pedidos p WHERE p.id = :pid",
                            Usuario.class
                    )
                    .setParameter("pid", pedidoId)
                    .getResultList();

            if (usuarios.isEmpty()) {
                return "Sin usuario";
            }

            Usuario u = usuarios.get(0);
            return u.getNombre() + " " + u.getApellido();

        } finally {
            em.close();
        }
    }

    // =========================
    // LECTURA
    // =========================

    private static String leerTextoNoVacio(String mensaje) {
        String texto;

        do {
            System.out.print(mensaje);
            texto = scanner.nextLine().trim();

            if (texto.isEmpty()) {
                System.out.println("El campo no puede estar vacio.");
            }

        } while (texto.isEmpty());

        return texto;
    }

    private static Long leerLong() {
        while (true) {
            String entrada = scanner.nextLine().trim();

            if (entrada.isEmpty()) {
                System.out.println("Debe ingresar un numero.");
                System.out.print("Ingrese nuevamente: ");
                continue;
            }

            try {
                return Long.parseLong(entrada);
            } catch (NumberFormatException e) {
                System.out.println("Valor invalido. Ingrese un numero.");
                System.out.print("Ingrese nuevamente: ");
            }
        }
    }

    private static Integer leerEntero() {
        while (true) {
            String entrada = scanner.nextLine().trim();

            if (entrada.isEmpty()) {
                System.out.println("Debe ingresar un numero.");
                System.out.print("Ingrese nuevamente: ");
                continue;
            }

            try {
                return Integer.parseInt(entrada);
            } catch (NumberFormatException e) {
                System.out.println("Valor invalido. Ingrese un numero entero.");
                System.out.print("Ingrese nuevamente: ");
            }
        }
    }

    private static Double leerDouble() {
        while (true) {
            String entrada = scanner.nextLine().trim().replace(",", ".");

            if (entrada.isEmpty()) {
                System.out.println("Debe ingresar un numero.");
                System.out.print("Ingrese nuevamente: ");
                continue;
            }

            try {
                return Double.parseDouble(entrada);
            } catch (NumberFormatException e) {
                System.out.println("Valor invalido. Ingrese un numero decimal.");
                System.out.print("Ingrese nuevamente: ");
            }
        }
    }

    private record ItemPedidoTemp(Long productoId, Integer cantidad) {
    }
}
