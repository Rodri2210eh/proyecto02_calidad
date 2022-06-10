import { Resena } from "../Modelo/Resena";
import DAO from "./DAO";
import { Objeto_Calificacion } from "../Modelo/Objeto_Calificacion";
import { Comentario_Blog } from "../Modelo/Comentario_Blog";
import { Resenas_Producto } from "../Modelo/Resenas_Producto";

export default class Gestor_Resenas{

    base_datos: DAO;

    constructor(){
        this.base_datos = DAO.get_instancia();
    }

    // Crea la calificaicon de un blog
    crear_calificacion_blog(id_consumidor:number, id_origen:number, calificación:number): Promise<string>{
        return this.base_datos.crear_clasificación_blog(id_consumidor, id_origen, calificación)
        .then((resultado: string) => {
            return resultado
        });

    }

    // Crea la calificaicon de un blog
    consultar_calificacion_blog(id_consumidor:number, id_origen:number): Promise<number>{
        return this.base_datos.consultar_calificacion_blog(id_consumidor, id_origen)
        .then((resultado: number) => {
            return resultado
        });

    }

    // Crear un comentario para un blog
    crear_comentario_blog(id_consumidor: number, id_origen:number, comentario: string): Promise<string>{
        return this.base_datos.crear_comentario_blog(id_consumidor, id_origen, comentario)
        .then((resultado: string) => {
            return resultado
        });
    }

    // Modificar comentario de un blog
    modificar_comentario_blog(id_consumidor: number, id_comentario: number, id_origen:number, comentario: string): Promise<string>{
        return this.base_datos.modificar_comentario_blog(id_consumidor, id_comentario, id_origen, comentario)
        .then((resultado: string) => {
            return resultado
        });
    }

    // Modificar comentario de un blog
    consultar_comentarios_blog(id_consumidor: number|undefined , id_origen:number, cantidad_a_agregar: number, 
        pagina: number): Promise<{comentarios: Comentario_Blog[], cantidad_total: number}>{
        return this.base_datos.consultar_comentarios_blog(id_consumidor, id_origen, cantidad_a_agregar, pagina)
        .then((resultado: {comentarios: Comentario_Blog[], cantidad_total: number}) => {
            return resultado
        });
    }

    // Eliminar Comentario blog
    eliminar_comentario_blog(id_consumidor: number, id_comentario: number, id_origen: number): Promise<string>{
        return this.base_datos.eliminar_comentario_blog(id_consumidor, id_comentario, id_origen);
    }

    // Crear la resena de un producto
    async crear_resena_producto(id_usuario: number, id_origen: number, comentario: string,
        calificaciones: Objeto_Calificacion[]): Promise<string>{
        return this.base_datos.crear_resena_producto(id_usuario, id_origen, comentario, calificaciones)
        .then((resultado: string) => {
            return resultado
        });
    }

    // Consultar resena producto
    consultar_resenas_producto(id_consumidor: number|undefined , id_origen:number, cantidad_a_agregar: number, 
        pagina: number): Promise<{ cantidad_total: number,
        resenas:Resenas_Producto[]}>{
        return this.base_datos.consultar_resenas_producto(id_consumidor, id_origen, cantidad_a_agregar, pagina)
        .then((resultado: { cantidad_total: number,
            resenas:Resenas_Producto[]}) => {
            return resultado
        });
    }

    // Eliminar resena de un producto
    async eliminar_resena_producto(id_consumidor: number , id_origen:number): Promise<string>{
        return this.base_datos.eliminar_resena_producto(id_consumidor, id_origen)
        .then((resultado: string) => {
            return resultado
        });
    }

}