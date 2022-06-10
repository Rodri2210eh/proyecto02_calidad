import { Tipo_Usuario } from "./Tipo_Usuario";

export interface Creador_de_Contenido extends Tipo_Usuario{
    descripcion: string;
    sitio_web: string;
    direccion_exacta: string;
    celular: string;
    canton:  string;
    provincia: string;
    imagen: string;
}