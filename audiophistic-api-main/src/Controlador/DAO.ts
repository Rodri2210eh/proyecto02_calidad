import { Client } from "pg";
import { Estilo } from "../Modelo/Estilo";
import { Producto } from "../Modelo/Producto";
import { Tipos_Producto } from "../Modelo/Tipos_Producto";
import { Tipos_Usuario } from "../Modelo/Tipos_Usuario";
import { Usuario } from "../Modelo/Usuario";
import { Categoria } from "../Modelo/Categoria";
import Manejador_Tokens from "./Manejador_Tokens";
import { Token } from "nodemailer/lib/xoauth2";
import { Carrito } from "../Modelo/Carrito";
import { Pedido } from "../Modelo/Pedido";
import { Direccion } from "../Modelo/Direccion";
import { Blog } from "../Modelo/Blog";
import { Resena } from "../Modelo/Resena";
import { Objeto_Calificacion } from "../Modelo/Objeto_Calificacion";
import { Comentario_Blog } from "../Modelo/Comentario_Blog";
import { Resenas_Producto } from "../Modelo/Resenas_Producto";

require('dotenv').config();

const connection = { //Se ponen todos los parametros en el archivo .env por seguridad
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

/*Clase basada en el modelo de Singleton, 
  se encarga de la conexion a la base de datos de postgres */
export default class DAO {
    cliente: Client

    private static instancia: DAO;

    private constructor() {
        this.cliente = new Client(connection);
        try {
            this.cliente.connect();
        } catch (err) {
            console.log(err)
        }
    }

    static get_instancia() {
        if (!DAO.instancia) {
            DAO.instancia = new DAO();
        }
        return DAO.instancia;
    }

    // Comprueba que el tipo de usuario exista
    async existe_tipo_usuario(id_tipo: number): Promise<number> {
        try {
            let res = await this.cliente.query('select * from existe_tipo_usuario($1)',
                [id_tipo]);
            if (res) {
                return res.rows[0].existe_tipo_usuario;
            } else {
                throw new Error("No se pudo verificar el tipo");
            }
        } catch (err) {
            throw err;
        }
    }

    // Registra a un usuario CONSUMIDOR
    async registrar_usuario(correo: string, nombre: string, contrasena: string): Promise<number> {
        try {
            let res = await this.cliente.query('select * from registrar_usuario($1,$2,$3)',
                [correo, nombre, contrasena]);
            if (res.rows[0]) {
                return res.rows[0].registrar_usuario;
            } else {
                throw new Error("No se pudo resgistrar al usuario");
            }
        } catch (err) {
            throw err;
        }
    }

    // Se crea un usuario consumidor
    async crear_usuario(tipo_usuario: number, correo: string, nombre: string, contrasena: string, caracteristicas: Tipos_Usuario): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_usuario($1,$2,$3,$4,$5)',
                [tipo_usuario, correo, nombre, contrasena, caracteristicas]);
            if (res.rows[0]) {
                return res.rows[0].crear_usuario;
            } else {
                throw new Error("No Se pudo registrar al usuario")
            }

        } catch (err) {
            throw err;
        }
    }

    // Reemplaza la contrasena de un usuario
    async cambiar_contrasena(id_usuario: number, contrasena: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from cambiar_contrasena($1::int,$2::character varying(60))', [id_usuario, contrasena]);
            if (res.rows[0].cambiar_contrasena) {
                return res.rows[0].cambiar_contrasena;
            } else {
                throw new Error("La contraseña no pudo ser cambiada");
            }
        } catch (err) {
            throw err;
        }
    }

    // Reemplaza la contrasena de un usuario pero con mail en lugar de ID
    async cambiar_contrasena_con_correo(correo: string, contrasena: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from cambiar_contrasena($1,$2)', [correo, contrasena]);
            if (res.rows[0].cambiar_contrasena) {
                return res.rows[0].cambiar_contrasena;
            } else {
                throw new Error("La contraseña no pudo ser cambiada");
            }
        } catch (err) {
            throw err;
        }
    }

    // Confirma un usuario CONSUMIDOR
    async confirmar_usuario(id_usuario: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from confirmar_usuario($1)',
                [id_usuario]);
            if (res) {
                return res.rows[0].confirmar_usuario;
            } else {
                throw new Error("No se pudo confirmar al usuario");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera a un usuario segun su correo
    async verificar_usuario(correo: string): Promise<Usuario> {
        try {
            let res = await this.cliente.query('select * from verificar_usuario($1)', [correo]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se pudo obtener el usuario");
            }
        } catch (err) {
            throw err;
        }
    }

    // Se edita un usuairo
    async editar_usuario(id_usuario: number, nombre: string, caracteristicas: Tipos_Usuario): Promise<string> {
        try {
            let res = await this.cliente.query('select * from editar_usuario($1, $2, $3)',
                [id_usuario, nombre, caracteristicas]);
            if (res.rows[0]) {
                return res.rows[0].editar_usuario;
            } else {
                throw new Error("No se pudo editar el usuario");
            }
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    // Recupera todos los usuarios confirmados y activos
    async consultar_usuarios(): Promise<Usuario[]> {
        try {
            let res = await this.cliente.query('select * from consultar_usuarios()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No se pudieron obtener los usuarios");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera un usuario y sus datos segun su id
    async consultar_usuario(id_usuario: number): Promise<Usuario> {
        try {
            let res = await this.cliente.query('select * from consultar_usuario($1)', [id_usuario]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El usuario no existe, no ha sido confirmado o fue eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera un usuario y sus datos segun su id
    async consultar_creador_contenido(id_usuario: number): Promise<Usuario> {
        try {
            let res = await this.cliente.query('select * from consultar_creador_contenido($1)', [id_usuario]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El usuario no existe, no ha sido confirmado o fue eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Eliminación de usuario. Este es un borrado lógico y NO físico. 
    async eliminar_usuario(id_usuario: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_usuario($1)', [id_usuario]);
            if (res.rows[0]) {
                return ("El usuario ha sido desactivado");
            } else {
                throw new Error("el usuario no se ha podido eliminar");
            }
        } catch (err) {
            throw err;
        }
    }

    // Crea un producto con los datos dados
    async crear_producto(id_creador: number, id_tipo: number, fecha_lanzamiento: number,
        titulo: string, precio: number, tiempo_envio: number, descripcion: string,
        caracteristicas: Tipos_Producto,
        estilos: Estilo[]): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_producto($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [id_creador, id_tipo, fecha_lanzamiento, titulo, precio, tiempo_envio,
                    descripcion, caracteristicas, estilos]);
            if (res.rows[0]) {
                return res.rows[0].crear_producto;
            } else {
                throw new Error("No se pudo insertar el producto");
            }
        } catch (err) {
            throw err;
        }
    }

    // Inserta el producto con los cambios dados
    async modificar_producto(id_producto: number, id_creador: number, fecha_lanzamiento: number,
        titulo: string, precio: number, tiempo_envio: number, descripcion: string,
        caracteristicas: Tipos_Producto,
        estilos: Estilo[]): Promise<string> {
        try {
            let res = await this.cliente.query('select * from modificar_producto($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [id_producto, id_creador, fecha_lanzamiento, titulo, precio, tiempo_envio,
                    descripcion, caracteristicas, estilos]);
            if (res.rows[0]) {
                return res.rows[0].modificar_producto;
            } else {
                throw new Error("No se pudo insertar el producto");
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    // Recupera todos los productos activos
    async consultar_productos(): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from consultar_productos()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No se pudieron obtener los productos");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera un producto y sus datos segun su id
    async productos_por_tipo(id_tipo: number): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from productos_por_tipo($1)', [id_tipo]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El producto no existe o fue eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera un producto y sus datos segun su id
    async consultar_producto(id_producto: number): Promise<Producto> {
        try {
            let res = await this.cliente.query('select * from consultar_producto($1)', [id_producto]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El producto no existe o fue eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    //Consulta los productos de un Creador de Contenido segun su ID
    async consultar_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from consultar_productos_por_creador($1)', [id_creador_contenido]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El usuario no tiene productos");
            }
        } catch (err) {
            throw err;
        }
    }

    //Consulta los productos de un Creador de Contenido segun su ID
    async consultar_productos_sin_blog_creador(id_creador_contenido: number): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from consultar_productos_sin_blog_creador($1)',
                [id_creador_contenido]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El usuario no tiene productos");
            }
        } catch (err) {
            throw err;
        }
    }

    //Consulta los productos, mas su foto, de un Creador de Contenido segun su ID
    async thumbnail_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from thumbnail_productos_por_creador($1)', [id_creador_contenido]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El usuario no tiene productos");
            }
        } catch (err) {
            throw err;
        }
    }

    // Cambia el estado de un producto a inactivo
    async eliminar_producto(id_producto: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_producto($1)', [id_producto]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_producto;
            } else {
                throw new Error("El producto no pudo ser eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Cambia el estado de un producto del creador a inactivo
    async eliminar_mi_producto(id_producto: number, id_creador: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_mi_producto($1, $2)',
                [id_producto, id_creador]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_mi_producto;
            } else {
                throw new Error("El producto no pudo ser eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Recupera un producto y sus datos segun su id
    async consultar_estilos(id_producto: number): Promise<Estilo[]> {
        try {
            let res = await this.cliente.query('select * from consultar_estilos_producto($1)', [id_producto]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El producto no existe o fue eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Cambia la existencia del producto dado en los estilos dados
    async modificar_existencia(id_creador: number, estilos: Estilo[]): Promise<string> {
        try {
            let res = await this.cliente.query('select * from modificar_existencia($1, $2)',
                [id_creador, estilos]);
            if (res.rows[0]) {
                return res.rows[0].modificar_existencia;
            } else {
                throw new Error("No se pudo insertar el producto");
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    // Agregar al carrito
    async agregar_al_carrito(id_usuario: number, id_producto: number, id_estilo: number, cantidad: number):
        Promise<string> {
        try {
            let res = await this.cliente.query('select * from agregar_al_carrito($1,$2,$3,$4)',
                [id_usuario, id_producto, id_estilo, cantidad]);
            if (res.rows[0]) {
                return res.rows[0].agregar_al_carrito;
            } else {
                throw new Error("El carrito no pudo ser accesado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Cambiar cantidad de productos al carrito
    async cambiar_cantidad_carrito(id_usuario: number, id_producto: number, id_estilo: number, cantidad: number):
        Promise<string> {
        try {
            let res = await this.cliente.query('select * from cambiar_cantidad_carrito($1,$2,$3,$4)',
                [id_usuario, id_producto, id_estilo, cantidad]);
            if (res.rows[0]) {
                return res.rows[0].cambiar_cantidad_carrito;
            } else {
                throw new Error("El carrito no pudo ser cambiado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Eliminar del carrito
    async eliminar_del_carrito(id_usuario: number, id_producto: number, id_estilo: number):
        Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_del_carrito($1,$2,$3)',
                [id_usuario, id_producto, id_estilo]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_del_carrito;
            } else {
                throw new Error("El carrito no pudo ser cambiado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Thumbnail al carrito
    async thumbnail_carrito(id_usuario: number): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        try {
            let res = await this.cliente.query('select * from thumbnail_carrito($1)', [id_usuario]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El carrito no pudo ser consultado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Consulta al carrito
    async consultar_carrito(id_usuario: number): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        try {
            let res = await this.cliente.query('select * from consultar_carrito($1)', [id_usuario]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El carrito no pudo ser consultado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Consulta al carrito
    async consultar_tipos_de_pago(): Promise<{
        id_tipo_pago: number, nombre: string,
        descripcion: string, comprobante: boolean
    }[]> {
        try {
            let res = await this.cliente.query('select * from consultar_tipos_de_pago()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El carrito no pudo ser consultado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Realizar el Checkout
    async realizar_checkout(id_usuario: number, carrito: Carrito[], monto_total: number, subtotal: number,
        costo_envio: number, correo: string, direccion: string, canton: string, provincia: string,
        cedula: string, telefono: string, nombre_consumidor: string): Promise<number> {
        try {
            let res = await this.cliente.query('select * from realizar_checkout($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                [id_usuario, carrito, monto_total, subtotal, costo_envio, correo, direccion,
                    canton, provincia, cedula, telefono, nombre_consumidor]);
            if (res.rows[0]) {
                return res.rows[0].realizar_checkout;
            } else {
                throw new Error("No se pudo realizar el checkout");
            }
        } catch (err) {
            throw err;
        }
    }

    // Realiza el pago, tiene un pedido como entrada
    async realizar_pago(id_pedido: number, id_tipo: number, monto_total: number, subtotal: number, costo_envio: number,
        comprobante: string, direccion: string, canton: string, provincia: string, cedula: string,
        telefono: string, nombre_consumidor: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from realizar_pago($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
                [id_pedido, id_tipo, monto_total, subtotal, costo_envio, comprobante, direccion,
                    canton, provincia, cedula, telefono, nombre_consumidor]);
            if (res.rows[0]) {
                return res.rows[0].realizar_pago;
            } else {
                throw new Error("Hubo un error a la hora de realizar el pago");
            }
        } catch (err) {
            throw err;
        }
    }

    // Se crea una categoria
    async crear_categoria(nombre: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_categoria($1)', [nombre]);
            if (res.rows[0]) {
                return res.rows[0].crear_categoria;
            } else {
                throw new Error("No se pudo crear la categoria");
            }

        } catch (err) {
            throw err;
        }
    }

    // Devuelve todas las categorias con metadatos para el administrador
    async consultar_categorias(): Promise<Categoria[]> {
        try {
            let res = await this.cliente.query('select * from consultar_categorias()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No se pudieron traer las categorias ");
            }

        } catch (err) {
            throw err;
        }
    }

    // Devuelve todas las categorias 
    async consultar_categorias_publico(): Promise<Categoria[]> {
        try {
            let res = await this.cliente.query('select * from consultar_categorias_publico()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No se pudieron traer las categorias");
            }

        } catch (err) {
            throw err;
        }
    }

    // Devuelve todas las categorias
    async eliminar_categoria(id_categoria: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_categoria($1)',
                [id_categoria]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_categoria;
            } else {
                throw new Error("No se pudieron traer las categorias ");
            }

        } catch (err) {
            throw err;
        }
    }

    // Crear Blog
    async crear_blog(id_creador: number, id_categoria: number, titulo: string, imagen: string,
        etiquetas: string[], contenido: string, productos: number[]): Promise<Blog> {
        try {
            let res = await this.cliente.query('select * from crear_blog($1, $2, $3, $4, $5, $6, $7)',
                [id_creador, id_categoria, titulo, imagen, etiquetas, contenido, productos]);
            if (res.rows[0]) {
                return res.rows[0].crear_blog;
            } else {
                throw new Error("No se pudo crear el Blog");
            }
        } catch (err) {
            throw err;
        }
    }

    // Modificar un Blog
    async modificar_blog(id_creador: number, id_blog: number, id_categoria: number, titulo: string, imagen: string,
        etiquetas: string[], contenido: string, productos: number[]): Promise<Blog> {
        try {
            let res = await this.cliente.query('select * from modificar_blog($1, $2, $3, $4, $5, $6, $7, $8)',
                [id_creador, id_blog, id_categoria, titulo, imagen, etiquetas, contenido, productos]);
            if (res.rows[0]) {
                return res.rows[0].modificar_blog;
            } else {
                throw new Error("No se pudo crear el Blog");
            }
        } catch (err) {
            throw err;
        }
    }

    // Consultar Blog
    async consultar_blog(id_blog: number): Promise<Blog> {
        try {
            let res = await this.cliente.query('select * from consultar_blog($1)', [id_blog]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("El Blog no existe o fue eliminado");
            }

        } catch (err) {
            throw err;
        }
    }

    //Consultar Blogs de un Creador en especifico
    async consultar_blogs_por_creador(id_autor: number): Promise<Blog[]> {
        try {
            let res = await this.cliente.query('select * from consultar_blogs_por_creador($1)', [id_autor]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El Autor no tiene blogs");
            }

        } catch (err) {
            throw err;
        }
    }

    // Consulta los blogs, mas su foto, de un Creador de Contenido segun su ID
    async thumbnail_blogs_por_creador(id_creador_contenido: number): Promise<Blog[]> {
        try {
            let res = await this.cliente.query('select * from thumbnail_blogs_por_creador($1)', [id_creador_contenido]);
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("El usuario no tiene blogs");
            }
        } catch (err) {
            throw err;
        }
    }

    // Consulta todos los blogs
    async consultar_blogs(): Promise<Blog[]> {
        try {
            let res = await this.cliente.query('select * from consultar_blogs()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay blogs");
            }

        } catch (err) {
            throw err;
        }
    }

    // Consulta todos los blogs
    async consultar_thumbnail_blogs(): Promise<Blog[]> {
        try {
            let res = await this.cliente.query('select * from consultar_thumbnail_blogs()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay blogs");
            }

        } catch (err) {
            throw err;
        }
    }

    // Cambia el estado de un producto a inactivo
    async eliminar_blog(id_blog: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_blog($1)', [id_blog]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_blog;
            } else {
                throw new Error("El Blog no pudo ser eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Cambia el estado de un producto del creador a inactivo
    async eliminar_mi_blog(id_blog: number, id_creador: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_mi_blog($1, $2)',
                [id_blog, id_creador]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_mi_blog;
            } else {
                throw new Error("El blog  no pudo ser eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Crear clasificación blog
    async crear_clasificación_blog(id_consumidor: number, id_origen: number, calificación: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_calificacion_blog($1,$2,$3)', [id_consumidor, id_origen, calificación]);
            if (res.rows[0]) {
                return res.rows[0].crear_calificacion_blog;
            } else {
                throw new Error("No se pudo crear la calificación");
            }

        } catch (err) {
            throw err;
        }

    }

    // Crear clasificación blog
    async consultar_calificacion_blog(id_consumidor: number, id_origen: number): Promise<number> {
        try {
            let res = await this.cliente.query('select * from consultar_calificacion_blog($1,$2)', [id_consumidor, id_origen]);
            if (res.rows[0]) {
                return res.rows[0].consultar_calificacion_blog;
            } else {
                throw new Error("No hay una calificación del usuario");
            }

        } catch (err) {
            throw err;
        }

    }

    //Crear Comentario de un blog
    async crear_comentario_blog(id_consumidor: number, id_origen: number, comentario: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_comentario_blog($1,$2,$3)', [id_consumidor, id_origen, comentario]);
            if (res.rows[0]) {
                return res.rows[0].crear_comentario_blog;
            } else {
                throw new Error("No se pudo crear el comentario");
            }
        } catch (err) {
            throw err;
        }
    }

    //Modifica el comentario de un blog
    async modificar_comentario_blog(id_consumidor: number, id_comentario: number, id_origen: number, comentario: string): Promise<string> {
        try {
            let res = await this.cliente.query('select * from modificar_comentario_blog($1,$2,$3,$4)',
                [id_consumidor, id_comentario, id_origen, comentario]);
            if (res.rows[0]) {
                return res.rows[0].modificar_comentario_blog;
            } else {
                throw new Error("No se pudo modificar el comentario");
            }
        } catch (err) {
            throw err;
        }
    }

    //Consulta los somentarios de un blog
    async consultar_comentarios_blog(id_consumidor: number | undefined, id_origen: number, cantidad_a_agregar: number,
        pagina: number): Promise<{ comentarios: Comentario_Blog[], cantidad_total: number }> {
        try {
            let res = await this.cliente.query('select * from consultar_comentarios_blog($1,$2,$3,$4)',
                [id_consumidor, id_origen, cantidad_a_agregar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No hay comentarios para este blog");
            }
        } catch (err) {
            throw err;
        }
    }

    // Eliminar comentario de un blog
    async eliminar_comentario_blog(id_consumidor: number, id_comentario: number, id_origen: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_comentario_blog($1,$2,$3)',
                [id_consumidor, id_comentario, id_origen]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_comentario_blog;
            } else {
                throw new Error("El comentario del blog no pudo ser eliminado");
            }
        } catch (err) {
            throw err;
        }
    }

    // Crear una resena del producto
    async crear_resena_producto(id_usuario: number, id_origen: number, comentario: string,
        calificaciones: Objeto_Calificacion[]): Promise<string> {
        try {
            let res = await this.cliente.query('select * from crear_resena_producto($1,$2,$3,$4)',
                [id_usuario, id_origen, comentario, calificaciones]);
            if (res.rows[0]) {
                return res.rows[0].crear_resena_producto;
            } else {
                throw new Error("La reseña del producto no pudo ser creada");
            }
        } catch (err) {
            throw err;
        }
    }

    // Consultar la resena de un producto
    async consultar_resenas_producto(id_consumidor: number | undefined, id_origen: number, cantidad_a_agregar: number,
        pagina: number): Promise<{
            cantidad_total: number,
            resenas: Resenas_Producto[]
        }> {
        try {
            let res = await this.cliente.query('select * from consultar_resenas_producto($1,$2,$3,$4)',
                [id_consumidor, id_origen, cantidad_a_agregar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No hay reseñas para este producto en la pagina " + pagina);
            }
        } catch (err) {
            throw err;
        }
    }

    // Eliminar la resena de un producto
    async eliminar_resena_producto(id_consumidor: number, id_origen: number): Promise<string> {
        try {
            let res = await this.cliente.query('select * from eliminar_resena_producto($1,$2)',
                [id_consumidor, id_origen]);
            if (res.rows[0]) {
                return res.rows[0].eliminar_resena_producto;
            } else {
                throw new Error("La reseña del producto no pudo ser eliminada");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda General
    async consultar_creadores_contenido(): Promise<Usuario[]> {
        try {
            let res = await this.cliente.query('select * from consultar_creadores_contenido()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay blogs");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de Parlantes
    async buscar_parlantes(titulo: string, marca: string | undefined, tipo_conexion: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        try {
            let res = await this.cliente.query('select * from buscar_parlantes($1,$2,$3,$4,$5,$6,$7)',
                [titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se encontraron parlantes");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de Audifonos
    async buscar_audifonos(titulo: string, marca: string | undefined, tipo_conexion: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        try {
            let res = await this.cliente.query('select * from buscar_audifonos($1,$2,$3,$4,$5,$6,$7)',
                [titulo, marca, tipo_conexion, precio_min, precio_max, cantidad_a_buscar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se encontraron audifonos");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de Albumes
    async buscar_albumes(titulo: string, presentacion: string | undefined, genero: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        try {
            let res = await this.cliente.query('select * from buscar_albumes($1,$2,$3,$4,$5,$6,$7)',
                [titulo, presentacion, genero, precio_min, precio_max, cantidad_a_buscar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se encontraron albumes");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de blogs
    async buscar_blogs(titulo: string, id_categoria: number | undefined, fecha_min: Date | undefined,
        fecha_max: Date | undefined, cantidad_a_buscar: number, pagina: number):
        Promise<{ blogs: Blog[], cantidad_total: number }> {
        try {
            let res = await this.cliente.query('select * from buscar_blogs($1,$2,$3,$4,$5,$6)',
                [titulo, id_categoria, fecha_min, fecha_max, cantidad_a_buscar, pagina]);
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se encontraron blogs");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de marcas audifonos
    async consultar_marcas_audifonos(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_marcas_audifonos()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay marcas");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de marcas parlantes
    async consultar_marcas_parlantes(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_marcas_parlantes()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay marcas");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de tipos de conexiones de audifonos
    async consultar_tipos_conexiones_audifonos(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_tipos_conexiones_audifonos()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay Tipos de conexiones");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de tipos de conexiones de parlantes
    async consultar_tipos_conexiones_parlantes(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_tipos_conexiones_parlantes()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay Tipos de conexiones");
            }
        } catch (err) {
            throw err;
        }
    }

    // Buscar limites inferiores y superiores de precios de audifonos
    async consultar_limites_precios_audifonos(): Promise<{limite_min: number, limite_max: number}>{
        try {
            let res = await this.cliente.query('select * from consultar_limites_precios_audifonos()');
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se pudo obtener los límites");
            }
        } catch (err) {
            throw err;
        }
    }

    // Buscar limites inferiores y superiores de precios de parlantes
    async consultar_limites_precios_parlantes(): Promise<{limite_min: number, limite_max: number}>{
        try {
            let res = await this.cliente.query('select * from consultar_limites_precios_parlantes()');
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se pudo obtener los límites");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de presentaciones
    async consultar_presentaciones_albumes(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_presentaciones_albumes()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay presentaciones");
            }
        } catch (err) {
            throw err;
        }
    }

    // Busqueda de Generos
    async consultar_generos_albumes(): Promise<string[]> {
        try {
            let res = await this.cliente.query('select * from consultar_generos_albumes()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay Generos");
            }
        } catch (err) {
            throw err;
        }
    }

    // Buscar limites inferiores y superiores de precios de albumes
    async consultar_limites_precios_albumes(): Promise<{limite_min: number, limite_max: number}>{
        try {
            let res = await this.cliente.query('select * from consultar_limites_precios_albumes()');
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se pudo obtener los límites");
            }
        } catch (err) {
            throw err;
        }
    }

    // Buscar limites inferiores y superiores de precios de albumes
    async consultar_limites_fechas_blogs(): Promise<{limite_min: Date, limite_max: Date}>{
        try {
            let res = await this.cliente.query('select * from consultar_limites_fechas_blogs()');
            if (res.rows[0]) {
                return res.rows[0];
            } else {
                throw new Error("No se pudo obtener los límites");
            }
        } catch (err) {
            throw err;
        }
    }

    //busqueda de todos los productos
    async thumbnail_productos(): Promise<Producto[]> {
        try {
            let res = await this.cliente.query('select * from thumbnail_productos()');
            if (res.rows[0]) {
                return res.rows;
            } else {
                throw new Error("No hay productos");
            }
        } catch (err) {
            throw err;
        }

    }

}


