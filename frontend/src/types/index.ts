export type Rol = "ADMIN" | "USUARIO";

export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "TERMINADO"
  | "CANCELADO";

export type FormaPago =
  | "EFECTIVO"
  | "TARJETA"
  | "TRANSFERENCIA";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  eliminado: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
  eliminado: boolean;
  categoriaId: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  password: string;
  rol: Rol;
}

export interface DetallePedido {
  idProducto: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  estado: EstadoPedido;
  formaPago: FormaPago;
  total: number;
  idUsuario: number;
  detalles: DetallePedido[];
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}