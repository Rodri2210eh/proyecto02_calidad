import { Estilo } from "../Modelo/Estilo";
import { Producto } from "../Modelo/Producto"
import DAO from "./DAO";
export default class Gestor_Prodcuctos {

    // Definimos como hacer las llamadas la base de datos a traves del dao
    base_datos: DAO;

    constructor() {
        this.base_datos = DAO.get_instancia();
    }

    // Crea el producto con los datos enviados
    crear_producto(producto: Producto, estilos: Estilo[]): Promise<string> {
        // Revisa si los datos opcionales están completos
        if (producto.fecha_lanzamiento && producto.tiempo_envio && producto.descripcion)
            return this.base_datos.crear_producto(producto.id_creador, producto.caracteristicas.id_tipo,
                producto.fecha_lanzamiento, producto.titulo, producto.precio, producto.tiempo_envio,
                producto.descripcion, producto.caracteristicas, estilos)
                .then((resultado: string) => {
                    return resultado;
                });
        else {
            throw new Error("Los datos están incompletos");
        }
    }

    // "Modifica" el producto
    modificar_producto(producto: Producto, estilos: Estilo[]): Promise<string> {
        // Revisa si los datos opcionales están completos
        if (producto.fecha_lanzamiento && producto.tiempo_envio && producto.descripcion)
            return this.base_datos.modificar_producto(producto.id_producto, producto.id_creador,
                producto.fecha_lanzamiento, producto.titulo, producto.precio, producto.tiempo_envio,
                producto.descripcion, producto.caracteristicas, estilos)
                .then((resultado: string) => {
                    return resultado;
                });
        else {
            throw new Error("Los datos están incompletos");
        }
    }

    // Consulta todos los productos activos
    consultar_productos(): Promise<Producto[]> {
        return this.base_datos.consultar_productos()
            .then((producto: Producto[]) => {
                return producto;
            })
    }

    // Obtiene los datos del producto
    productos_por_tipo(id_producto: number): Promise<Producto[]> {
        return this.base_datos.productos_por_tipo(id_producto)
            .then((producto: Producto[]) => {
                return producto;
            })
    }

    // Obtiene los datos del producto
    consultar_producto(id_producto: number): Promise<Producto> {
        return this.base_datos.consultar_producto(id_producto)
            .then((producto: Producto) => {
                return producto;
            })
    }

    // Obtiene productos de un creador de contenido segun su ID
    consultar_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        return this.base_datos.consultar_productos_creador(id_creador_contenido)
            .then((producto: Producto[]) => {
                return producto;
            })
    }

    // Obtiene productos de un creador de contenido segun su ID
    consultar_productos_sin_blog_creador(id_creador_contenido: number): Promise<Producto[]> {
        return this.base_datos.consultar_productos_sin_blog_creador(id_creador_contenido)
            .then((producto: Producto[]) => {
                return producto;
            })
    }

    // Obtiene productos, mas su foto, de un creador de contenido segun su ID
    thumbnail_productos_creador(id_creador_contenido: number): Promise<Producto[]> {
        return this.base_datos.thumbnail_productos_creador(id_creador_contenido)
            .then((producto: Producto[]) => {
                return producto;
            })
    }

    // Elimina el producto dado
    eliminar_producto(id_producto: number): Promise<string> {
        return this.base_datos.eliminar_producto(id_producto);

    }

    // Elimina el producto dado
    eliminar_mi_producto(id_producto: number, id_creador: number): Promise<string> {
        return this.base_datos.eliminar_mi_producto(id_producto, id_creador);

    }

    // Busqueda de Parlantes
    buscar_parlantes(titulo: string, marca: string | undefined, tipo_conexion: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{productos: Producto[], cantidad_total: number}> {
        return this.base_datos.buscar_parlantes(titulo, marca, tipo_conexion, precio_min, precio_max, 
            cantidad_a_buscar, pagina)
            .then((resultado: {productos: Producto[], cantidad_total: number}) => {
                return resultado
            });
    }

    // Busqueda de Audifonos
    buscar_audifonos(titulo: string, marca: string | undefined, tipo_conexion: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{productos: Producto[], cantidad_total: number}> {
        return this.base_datos.buscar_audifonos(titulo, marca, tipo_conexion, precio_min, precio_max, 
            cantidad_a_buscar, pagina)
            .then((resultado: {productos: Producto[], cantidad_total: number}) => {
                return resultado
            });
    }

    // Busqueda de Almbumes
    buscar_albumes(titulo: string, presentacion: string | undefined, genero: string | undefined,
        precio_min: number | undefined, precio_max: number | undefined,
        cantidad_a_buscar: number, pagina: number): Promise<{productos: Producto[], cantidad_total: number}> {
        return this.base_datos.buscar_albumes(titulo, presentacion, genero, precio_min, precio_max,
            cantidad_a_buscar, pagina)
            .then((resultado: {productos: Producto[], cantidad_total: number}) => {
                return resultado
            });
    }

    // Buscar marcas audifonos
    consultar_marcas_audifonos(): Promise<string[]> {
        return this.base_datos.consultar_marcas_audifonos()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar marcas parlantes
    consultar_marcas_parlantes(): Promise<string[]> {
        return this.base_datos.consultar_marcas_parlantes()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar Tipos de Conexiones de audifonos
    consultar_tipos_conexiones_audifonos(): Promise<string[]> {
        return this.base_datos.consultar_tipos_conexiones_audifonos()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar Tipos de Conexiones de parlantes
    consultar_tipos_conexiones_parlantes(): Promise<string[]> {
        return this.base_datos.consultar_tipos_conexiones_parlantes()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar limites inferiores y superiores de precios de audifonos
    consultar_limites_precios_audifonos(): Promise<{limite_min: number, limite_max: number}>{
        return this.base_datos.consultar_limites_precios_audifonos()
            .then((resultado: {limite_min: number, limite_max: number}) => {
                return resultado
            });
    }

    // Buscar limites inferiores y superiores de precios de parlantes
    consultar_limites_precios_parlantes(): Promise<{limite_min: number, limite_max: number}>{
        return this.base_datos.consultar_limites_precios_parlantes()
            .then((resultado: {limite_min: number, limite_max: number}) => {
                return resultado
            });
    }

    // Buscar Presentacion
    consultar_presentaciones_albumes(): Promise<string[]> {
        return this.base_datos.consultar_presentaciones_albumes()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar Generos
    consultar_generos_albumes(): Promise<string[]> {
        return this.base_datos.consultar_generos_albumes()
            .then((resultado: string[]) => {
                return resultado
            });
    }

    // Buscar limites inferiores y superiores de precios de albumes
    consultar_limites_precios_albumes(): Promise<{limite_min: number, limite_max: number}>{
        return this.base_datos.consultar_limites_precios_albumes()
            .then((resultado: {limite_min: number, limite_max: number}) => {
                return resultado
            });
    }

    //busqueda de todos los productos
    thumbnail_productos(): Promise<Producto[]> {
        return this.base_datos.thumbnail_productos()
            .then((resultado: Producto[]) => {
                return resultado
            });
    }
}