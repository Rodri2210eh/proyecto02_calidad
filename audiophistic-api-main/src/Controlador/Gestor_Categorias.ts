import { Categoria } from "../Modelo/Categoria";
import DAO from "./DAO";

export default class Gestor_Categorias{

    //Se define como hacer las llamadas al DAO
    base_datos: DAO;

    constructor(){
        this.base_datos = DAO.get_instancia();
    }

    // Crea una categoria nueva
    crear_categoria(nombre: string/*, fecha_creacion: Date, cant_blogs: number*/): Promise<string>{
        return this.base_datos.crear_categoria(nombre/*, fecha_creacion, cant_blogs*/);
    }

    // Consulta todas las categorias
    consultar_categorias(): Promise<Categoria[]>{
        return this.base_datos.consultar_categorias();
    }

    // Consulta todas las categorias con metadatos para el administrador
    consultar_categorias_publico(): Promise<Categoria[]>{
        return this.base_datos.consultar_categorias_publico();
    }

    // Elimina una categoria
    eliminar_categoria(id_categoria: number): Promise<string>{
        return this.base_datos.eliminar_categoria(id_categoria);
    }

}