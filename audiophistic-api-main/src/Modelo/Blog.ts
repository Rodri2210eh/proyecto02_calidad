import { Producto } from "./Producto";

export interface Blog {
    id_blog:number;
    id_creador?:number;
    nombre_creador?: string;
    fecha_creacion?: Date;
    id_categoria?:number;
    nombre_categoria?:string;
    titulo: string
    imagen?: string
    etiquetas?: string[];
    contenido?: string;
    enlace?: string;
    productos?: Producto[];
    calificacion?: number;
    cantidad_calificaciones?: number;
} 