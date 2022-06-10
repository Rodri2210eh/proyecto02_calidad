import fs from 'fs';
import util from 'util'
import generator from 'generate-password'
import Gestor_Usuarios from "./Gestor_Usuarios";
import Gestor_Prodcuctos from "./Gestor_Productos";
import Enviador_Correos from "./Enviador_Correos";
import bcrypt from 'bcrypt';
import { Producto } from "../Modelo/Producto";
import { Usuario } from "../Modelo/Usuario";
import { Categoria } from '../Modelo/Categoria';
import Manejador_Tokens from './Manejador_Tokens';
import Gestor_Estilos from './Gestor_Estilos';
import Gestor_Categorias from './Gestor_Categorias';
import { Estilo } from '../Modelo/Estilo';
import { Tipos_Usuario } from '../Modelo/Tipos_Usuario';
import { Carrito } from '../Modelo/Carrito';
import Gestor_Carrito from './Gestor_Carrito';
import { Pedido } from '../Modelo/Pedido';
import Gestor_Pedidos from './Gestor_Pedidos';
import { Direccion } from "../Modelo/Direccion";
import Gestor_Blogs from './Gestor_Blogs';
import { Blog } from '../Modelo/Blog';
import Gestor_Resenas from './Gestor_Resenas';
import { Resena } from '../Modelo/Resena';
import { Objeto_Calificacion } from '../Modelo/Objeto_Calificacion';
import { Comentario_Blog } from '../Modelo/Comentario_Blog';
import { Resenas_Producto } from '../Modelo/Resenas_Producto';

/* Se encarga de coordinar las funcionalidades 
   De la pagina web con sus clases respectivas*/
export default class Controlador {
    private envio_correos: Enviador_Correos;
    private manejador_token: Manejador_Tokens;
    private gestor_productos: Gestor_Prodcuctos;
    private gestor_usuarios: Gestor_Usuarios;
    private gestor_estilos: Gestor_Estilos;
    private gestor_categorias: Gestor_Categorias;
    private gestor_carrito: Gestor_Carrito;
    private gestor_pedidos: Gestor_Pedidos;
    private gestor_blogs: Gestor_Blogs;
    private gestor_resenas: Gestor_Resenas;
    //El numero de salts para el hash
    private salts = 10;

    constructor() {
        this.envio_correos = Enviador_Correos.get_instancia();
        this.manejador_token = Manejador_Tokens.get_instancia();
        this.gestor_productos = new Gestor_Prodcuctos();
        this.gestor_usuarios = new Gestor_Usuarios();
        this.gestor_estilos = new Gestor_Estilos();
        this.gestor_categorias = new Gestor_Categorias();
        this.gestor_carrito = new Gestor_Carrito();
        this.gestor_pedidos = new Gestor_Pedidos();
        this.gestor_blogs = new Gestor_Blogs();
        this.gestor_resenas = new Gestor_Resenas();
    }

    // Registra a un consumidor
    async registrar_usuario(correo: string, nombre: string, contrasena: string): Promise<string> {
        //Genera el hash y guarda al usuario en la base de datos
        correo = correo.toLowerCase();
        let hash: string = bcrypt.hashSync(contrasena, this.salts);
        let id: number = await this.gestor_usuarios.registrar_usuario(correo, nombre, hash);

        //Genera el token y lo adjunta al correo
        let token = this.manejador_token.crear_token_registro(id);
        let link = `http://localhost:4200/cuenta?token=${token}`
        console.log(token, link);
        let cuerpo_correo: string = fs.readFileSync('assets/html/correo_activar.html',
            { encoding: 'utf8', flag: 'r' });
        cuerpo_correo = util.format(cuerpo_correo, link, link, link);
        return this.envio_correos.enviar_correo(correo, 'Confirmar cuenta — Audiophistic', cuerpo_correo);
    }

    //crear usuario Creador de Contenido
    async crear_usuario(correo: string, nombre: string, caracteristicas: Tipos_Usuario): Promise<string> {
        //genera una constrasenia, hash y registra al usuario en una BD
        correo = correo.toLowerCase();
        let contrasena: string = this.generacion_contrasena();
        let hash: string = bcrypt.hashSync(contrasena, this.salts);

        await this.gestor_usuarios.crear_usuario(correo, nombre, hash, caracteristicas);

        //Envia el correo con la contrasena
        let cuerpo_correo: string = fs.readFileSync('assets/html/correo_cuenta_nueva.html',
            { encoding: 'utf8', flag: 'r' });
        cuerpo_correo = util.format(cuerpo_correo, contrasena);
        return this.envio_correos.enviar_correo(correo, 'Confirmar cuenta de Usuario  — Audiophistic', cuerpo_correo);
    }

    //Genera la confirmacion del correo
    confirmar_usuario(token: string): Promise<string> {
        let id_usuario = this.manejador_token.verificar_token_registro(token);
        return this.gestor_usuarios.confirmar_usuario(id_usuario);
    }

    // Cambia la contrasena del usuario con los datos dados
    async cambiar_contrasena(token: string, contrasena: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        let hash: string = bcrypt.hashSync(contrasena, this.salts);
        return this.gestor_usuarios.cambiar_contrasena(descifrado.id_usuario, hash);
    }

    // Crea una nueva contrasena, la guarda y envia un correo con la contrasena
    async crear_contrasena_temporal(correo: string): Promise<string> {
        var contrasena_temporal: string = this.generacion_contrasena();
        // Guarda la contrasena temporal en la base
        let hash: string = bcrypt.hashSync(contrasena_temporal, this.salts);
        await this.gestor_usuarios.cambiar_contrasena_con_correo(correo, hash);
        // Integra la nueva contrasena al correo y lo envia
        var cuerpo_correo: string = fs.readFileSync('./assets/html/correo_recuperar.html',
            { encoding: 'utf8', flag: 'r' });
        cuerpo_correo = util.format(cuerpo_correo, contrasena_temporal);
        return this.envio_correos.enviar_correo(correo, "Contraseña Temporal — Audiophistic", cuerpo_correo);

    }

    // Editar la informacion de un usuario
    editar_usuario(token: string, nombre: string, caracteristicas: Tipos_Usuario): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_usuarios.editar_usuario(descifrado, nombre, caracteristicas);
    }

    // Consulta todos los usuarios
    consultar_usuarios(): Promise<Usuario[]> {
        return this.gestor_usuarios.consultar_usuarios();
    }

    // Consulta los datos del usuario
    consultar_usuario(id_usuario: number): Promise<Usuario> {
        return this.gestor_usuarios.consultar_usuario(id_usuario);
    }

    // Consulta los datos del usuario
    consultar_creador_contenido(id_creador: number): Promise<Usuario> {
        return this.gestor_usuarios.consultar_creador_contenido(id_creador);
    }

    // Consulta los datos del usuario para ese usuario
    consultar_perfil(token: string): Promise<Usuario> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_usuarios.consultar_usuario(descifrado.id_usuario);
    }

    // Elimina de forma logica el usuario dado
    eliminar_usuario(id_usuario: number): Promise<string> {
        return this.gestor_usuarios.eliminar_usuario(id_usuario);
    }

    // Crea el producto con los datos enviados
    crear_producto(producto: Producto, estilos: Estilo[], token: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        producto.id_creador = descifrado.id_usuario;
        return this.gestor_productos.crear_producto(producto, estilos);
    }

    // "Modifica" el producto con los datos enviados
    modificar_producto(producto: Producto, estilos: Estilo[], token: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        producto.id_creador = descifrado.id_usuario;
        return this.gestor_productos.modificar_producto(producto, estilos);
    }

    // Consulta todos los productos
    consultar_productos(): Promise<Producto[]> {
        return this.gestor_productos.consultar_productos();
    }

    //Consulta los productos de un Creador de Contenido segun su ID
    consultar_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        return this.gestor_productos.consultar_productos_creador(id_creador_contenido);
    }

    //Consulta los productos, mas su foto, de un Creador de Contenido segun su ID
    thumbnail_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        return this.gestor_productos.thumbnail_productos_creador(id_creador_contenido);
    }

    //Consulta los productos de un Usuario segun su ID
    consultar_productos_usuario(token: string): Promise<Producto[]> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_productos.consultar_productos_creador(descifrado.id_usuario);
    }

    //Consulta los productos de un Usuario segun su ID
    consultar_productos_sin_blog_creador(token: string): Promise<Producto[]> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_productos.consultar_productos_sin_blog_creador(descifrado.id_usuario);
    }

    // Consulta los datos del producto respectivo
    productos_por_tipo(id_tipo: number): Promise<Producto[]> {
        return this.gestor_productos.productos_por_tipo(id_tipo);
    }

    // Consulta los datos del producto respectivo
    consultar_producto(id_producto: number): Promise<Producto> {
        return this.gestor_productos.consultar_producto(id_producto);
    }

    // Consulta los datos del producto respectivo
    eliminar_producto(id_producto: number): Promise<string> {
        return this.gestor_productos.eliminar_producto(id_producto);
    }

    // Consulta los datos del producto respectivo
    eliminar_mi_producto(id_producto: number, token: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_productos.eliminar_mi_producto(id_producto, descifrado.id_usuario);
    }

    // Consulta los estilos de un producto dado
    consultar_estilos(id_producto: number): Promise<Estilo[]> {
        return this.gestor_estilos.consultar_estilos(id_producto);
    }

    // "Modifica" la existencia de los estilos del producto
    modificar_existencia(token: string, estilos: Estilo[]): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_estilos.modificar_existencia(descifrado.id_usuario, estilos);
    }

    // Agrega un producto al carrito
    agregar_al_carrito(token: string, id_producto: number, id_estilo: number, cantidad: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        if (descifrado.caracteristicas?.id_tipo != 3) {
            throw new Error('El usuario no puede tener un carrito');
        };
        return this.gestor_carrito.agregar_al_carrito(descifrado.id_usuario, id_producto, id_estilo, cantidad);
    }

    // Cambia la cantiadd de un producto del carrito
    cambiar_cantidad_carrito(token: string, id_producto: number, id_estilo: number, cantidad: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        if (descifrado.caracteristicas?.id_tipo != 3) {
            throw new Error('El usuario no puede tener un carrito');
        };
        return this.gestor_carrito.cambiar_cantidad_carrito(descifrado.id_usuario, id_producto, id_estilo, cantidad);
    }

    // Elimina un producto del carrito
    eliminar_del_carrito(token: string, id_producto: number, id_estilo: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        if (descifrado.caracteristicas?.id_tipo != 3) {
            throw new Error('El usuario no puede tener un carrito');
        };
        return this.gestor_carrito.eliminar_del_carrito(descifrado.id_usuario, id_producto, id_estilo);
    }

    // Thumbnail del carrito de un usuario segun su ID
    thumbnail_carrito(token: string): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        let descifrado: Usuario = this.descifrar_token(token);
        if (descifrado.caracteristicas?.id_tipo != 3) {
            throw new Error('El usuario no puede tener un carrito');
        };
        return this.gestor_carrito.thumbnail_carrito(descifrado.id_usuario);
    }

    // Consulta el carrito de un usuario segun su ID
    consultar_carrito(token: string): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        let descifrado: Usuario = this.descifrar_token(token);
        if (descifrado.caracteristicas?.id_tipo != 3) {
            throw new Error('El usuario no puede tener un carrito');
        };
        return this.gestor_carrito.consultar_carrito(descifrado.id_usuario);
    }

    // Consulta los datos del los tipos de pago disponibles
    consultar_tipos_de_pago(): Promise<{
        id_tipo_pago: number, nombre: string,
        descripcion: string, comprobante: boolean
    }[]> {
        return this.gestor_pedidos.consultar_tipos_de_pago();
    }

    // Realiza el checkout
    async realizar_checkout(token: string, carrito: Carrito[], monto_total: number, subtotal: number,
        costo_envio: number, direccion_pedido: Direccion): Promise<number> {
        let descifrado: Usuario = this.descifrar_token(token);
        let id_pedido: number = await this.gestor_pedidos.realizar_checkout(descifrado.id_usuario, carrito, monto_total, subtotal,
            costo_envio, descifrado.correo, direccion_pedido);
        // Formateador para ingresar en el correo el dinero en formato de dinero
        let formatter = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        // Trae el cuerpo del correo
        let tabla_carrito: string = ''
        for (let i = 0; i < carrito.length; i++) {
            tabla_carrito += `<tr>
            <td style="font-size:15px; padding: 15px 10px 5px 10px;">${carrito[i].titulo}<br><span
                    style="font-size:13px; color: #929191;">${carrito[i].nombre_estilo}</span></td>
            <td style="padding: 15px 10px 5px 10px;" align="center">${Math.abs(carrito[i].cantidad)}<br></td>
            <td style="padding: 15px 10px 5px 10px;">₡${formatter.format(carrito[i].cantidad == -1
                ? carrito[i].precio : carrito[i].precio * carrito[i].cantidad)}</td>
        </tr>`
        }
        let cuerpo_correo: string = fs.readFileSync('./assets/html/pedido_confirmado.html',
            { encoding: 'utf8', flag: 'r' });
        //Substituye las %s por las variables que queremos
        cuerpo_correo = util.format(cuerpo_correo, tabla_carrito, id_pedido, "₡" + formatter.format(subtotal), "₡" + formatter.format(costo_envio),
            "₡" + formatter.format(monto_total - costo_envio - subtotal), "₡" + formatter.format(monto_total),
            direccion_pedido.nombre_consumidor, direccion_pedido.cedula, direccion_pedido.telefono,
            direccion_pedido.provincia, direccion_pedido.canton, direccion_pedido.direccion);
        await this.envio_correos.enviar_correo(descifrado.correo, "Pedido Confirmado — Audiophistic", cuerpo_correo);
        return id_pedido;
    }

    // Realiza el pago
    async realizar_pago(token: string, id_pedido: number, id_metodo_pago: number, monto_total: number, subtotal: number,
        costo_envio: number, comprobante: string, direccion_pedido: Direccion): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        await this.gestor_pedidos.realizar_pago(id_pedido, id_metodo_pago, monto_total, subtotal, costo_envio, comprobante, direccion_pedido);
        // Formateador para ingresar en el correo el dinero en formato de dinero
        var formatter = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        // Trae el cuerpo del correo
        let cuerpo_correo: string = fs.readFileSync('./assets/html/pago_confirmado.html',
            { encoding: 'utf8', flag: 'r' });
        //Substituye las %s por las variables que queremos
        cuerpo_correo = util.format(cuerpo_correo, new Date().toLocaleDateString(
            'es-ES',
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }//Opciones para el fomrato de la fecha
        ), "₡" + formatter.format(monto_total), id_pedido, "₡" + formatter.format(subtotal), "₡" + formatter.format(costo_envio),
            "₡" + formatter.format(monto_total - costo_envio - subtotal), "₡" + formatter.format(monto_total), direccion_pedido.nombre_consumidor,
            direccion_pedido.cedula, direccion_pedido.telefono, direccion_pedido.provincia, direccion_pedido.canton,
            direccion_pedido.direccion);
        return this.envio_correos.enviar_correo(descifrado.correo, "Pago Confirmado — Audiophistic", cuerpo_correo);
    }

    // Crea categoria con los datos 
    crear_categoria(nombre: string): Promise<string> {
        return this.gestor_categorias.crear_categoria(nombre);
    }

    // Consulta todas las categorias con metadatos para el administrador
    consultar_categorias(): Promise<Categoria[]> {
        return this.gestor_categorias.consultar_categorias();
    }

    // Consulta todas las categorias con solo el nombre y el id
    consultar_categorias_publico(): Promise<Categoria[]> {
        return this.gestor_categorias.consultar_categorias_publico();
    }

    // Elimina una categoria
    eliminar_categoria(id_categoria: number): Promise<string> {
        return this.gestor_categorias.eliminar_categoria(id_categoria);
    }

    // Crear un Blog 
    crear_blog(token: string, id_categoria: number, titulo: string, imagen: string,
        etiquetas: string[], contenido: string, productos: number[]): Promise<Blog> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_blogs.crear_blog(descifrado.id_usuario, id_categoria, titulo, imagen,
            etiquetas, contenido, productos)
    }

    // Modificar un blog
    modificar_blog(token: string, id_blog: number, id_categoria: number, titulo: string, imagen: string,
        etiquetas: string[], contenido: string, productos: number[]): Promise<Blog> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_blogs.modificar_blog(descifrado.id_usuario, id_blog, id_categoria, titulo, imagen,
            etiquetas, contenido, productos)
    }

    // Consultar un Blog
    consultar_blog(id_blog: number): Promise<Blog> {
        return this.gestor_blogs.consultar_blog(id_blog);
    }

    // Consultar blogs de un creador de contenido
    consultar_blogs_por_creador(token: string): Promise<Blog[]> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_blogs.consultar_blogs_por_creador(descifrado.id_usuario);
    }

    // Consultar blogs de un creador de contenido
    thumbnail_blogs_por_creador(id_creador_contenido: number): Promise<Blog[]> {
        return this.gestor_blogs.thumbnail_blogs_por_creador(id_creador_contenido);
    }

    // Obtiene todos los blogs
    consultar_blogs(): Promise<Blog[]> {
        return this.gestor_blogs.consultar_blogs();
    }

    // Obtiene todos los blogs
    consultar_thumbnail_blogs(): Promise<Blog[]> {
        return this.gestor_blogs.consultar_thumbnail_blogs();
    }

    // Cambia el estado de un blog a inactivo
    eliminar_blog(id_blog: number): Promise<string> {
        return this.gestor_blogs.eliminar_blog(id_blog);
    }

    // Cambia el estado de un blog del creador a inactivo
    eliminar_mi_blog(id_blog: number, token: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_blogs.eliminar_mi_blog(id_blog, descifrado.id_usuario);
    }

    // Crear una calificacion a un blog
    crear_calificacion_blog(token_usuario: string, id_origen: number, calificacion: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token_usuario);
        return this.gestor_resenas.crear_calificacion_blog(descifrado.id_usuario, id_origen, calificacion);
    }

    // Busca la calificacion de un blog de un usuario
    consultar_calificacion_blog(token_usuario: string, id_origen: number): Promise<number> {
        let descifrado: Usuario = this.descifrar_token(token_usuario);
        return this.gestor_resenas.consultar_calificacion_blog(descifrado.id_usuario, id_origen);
    }

    // Crear comentario blog
    crear_comentario_blog(token: string, id_origen: number, comentario: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_resenas.crear_comentario_blog(descifrado.id_usuario, id_origen, comentario);
    }

    // Modiifcar comentario de un blog
    modificar_comentario_blog(token: string, id_comentario: number, id_origen: number, comentario: string): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_resenas.modificar_comentario_blog(descifrado.id_usuario, id_comentario, id_origen, comentario);
    }

    // Modifcar comentario de un blog
    consultar_comentarios_blog(token: string | undefined, id_origen: number, cantidad_a_agregar: number,
        pagina: number): Promise<{ comentarios: Comentario_Blog[], cantidad_total: number }> {
        if (token) {
            let descifrado: Usuario = this.descifrar_token(token);
            return this.gestor_resenas.consultar_comentarios_blog(descifrado.id_usuario, id_origen, cantidad_a_agregar, pagina);
        } else {
            return this.gestor_resenas.consultar_comentarios_blog(undefined, id_origen, cantidad_a_agregar, pagina);
        }
    }

    //eliminar comentario blog
    eliminar_comentario_blog(token: string, id_comentario: number, id_origen: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_resenas.eliminar_comentario_blog(descifrado.id_usuario, id_comentario, id_origen);
    }

    //Crear la resena de un producto
    crear_resena_producto(token: string, id_origen: number, comentario: string,
        calificaciones: Objeto_Calificacion[]): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_resenas.crear_resena_producto(descifrado.id_usuario, id_origen, comentario, calificaciones);
    }

    // consultar resena producto
    consultar_resenas_producto(token: string | undefined, id_origen: number, cantidad_a_agregar: number,
        pagina: number): Promise<{
            cantidad_total: number,
            resenas: Resenas_Producto[]
        }> {
        if (token) {
            let descifrado: Usuario = this.descifrar_token(token);
            return this.gestor_resenas.consultar_resenas_producto(descifrado.id_usuario, id_origen, cantidad_a_agregar, pagina);
        } else {
            return this.gestor_resenas.consultar_resenas_producto(undefined, id_origen, cantidad_a_agregar, pagina);
        }
    }

    // Eliminar resena producto
    eliminar_resena_producto(token: string, id_origen: number): Promise<string> {
        let descifrado: Usuario = this.descifrar_token(token);
        return this.gestor_resenas.eliminar_resena_producto(descifrado.id_usuario, id_origen);
    }

    // Busqueda General
    consultar_creadores_contenido(): Promise<Usuario[]> {
        return this.gestor_usuarios.consultar_creadores_contenido();
    }

    // buscar Parlantes
    buscar_parlantes(titulo: string, marca: string | undefined, tipo_conexion: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        return this.gestor_productos.buscar_parlantes(titulo, marca, tipo_conexion, precio_min, precio_max,
            cantidad_a_buscar, pagina);
    }

    // buscar Parlantes
    buscar_audifonos(titulo: string, marca: string, tipo_conexion: string, precio_min: number,
        precio_max: number, cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        return this.gestor_productos.buscar_audifonos(titulo, marca, tipo_conexion, precio_min, precio_max,
            cantidad_a_buscar, pagina);
    }

    // Buscar almbumes
    buscar_albumes(titulo: string, presentacion: string, genero: string, precio_min: number,
        precio_max: number, cantidad_a_buscar: number, pagina: number): Promise<{ productos: Producto[], cantidad_total: number }> {
        return this.gestor_productos.buscar_albumes(titulo, presentacion, genero, precio_min, precio_max,
            cantidad_a_buscar, pagina);
    }

    // Buscar Blogs
    buscar_blogs(titulo: string, id_categoria: number | undefined, fecha_min: Date | undefined,
        fecha_max: Date | undefined, cantidad_a_buscar: number,
        pagina: number): Promise<{ blogs: Blog[], cantidad_total: number }> {
        return this.gestor_blogs.buscar_blogs(titulo, id_categoria, fecha_min, fecha_max, cantidad_a_buscar, pagina);
    }

    // Buscar Marcas audifonos
    consultar_marcas_audifonos(): Promise<string[]> {
        return this.gestor_productos.consultar_marcas_audifonos();
    }

    // Buscar Marcas parlantes
    consultar_marcas_parlantes(): Promise<string[]> {
        return this.gestor_productos.consultar_marcas_parlantes();
    }


    // Buscar tipos de conexiones de audifonos
    consultar_tipos_conexiones_audifonos(): Promise<string[]> {
        return this.gestor_productos.consultar_tipos_conexiones_audifonos();
    }

    // Buscar tipos de conexiones de parlantes
    consultar_tipos_conexiones_parlantes(): Promise<string[]> {
        return this.gestor_productos.consultar_tipos_conexiones_parlantes();
    }

    // Buscar limites inferiores y superiores de precios de audifonoc
    consultar_limites_precios_audifonos(): Promise<{limite_min: number, limite_max: number}> {
        return this.gestor_productos.consultar_limites_precios_audifonos();
    }

    // Buscar limites inferiores y superiores de precios de albumes
    consultar_limites_precios_parlantes(): Promise<{limite_min: number, limite_max: number}> {
        return this.gestor_productos.consultar_limites_precios_parlantes();
    }

    // Buscar presentaciones
    consultar_presentaciones_albumes(): Promise<string[]> {
        return this.gestor_productos.consultar_presentaciones_albumes();
    }

    // Buscar generos
    consultar_generos_albumes(): Promise<string[]> {
        return this.gestor_productos.consultar_generos_albumes();
    }

    // Buscar limites inferiores y superiores de precios de albumes
    consultar_limites_precios_albumes(): Promise<{limite_min: number, limite_max: number}> {
        return this.gestor_productos.consultar_limites_precios_albumes();
    }

    // Buscar limites inferiores y superiores de fechas de blogs
    consultar_limites_fechas_blogs(): Promise<{limite_min: Date, limite_max: Date}> {
        return this.gestor_blogs.consultar_limites_fechas_blogs();
    }

    //busqueda de todos los productos
    async thumbnail_productos(): Promise<Producto[]> {
        return this.gestor_productos.thumbnail_productos();
    }

    // Pide al manejador de tokens que descifre el token
    private descifrar_token(token: string): Usuario {
        return this.manejador_token.descifrar_token(token)
    }

    // Funcion para generar un string aleatorio para la recuperacion de contrasenias
    private generacion_contrasena(): string {
        return generator.generate({
            length: 10,
            numbers: true,
        })
    }


}