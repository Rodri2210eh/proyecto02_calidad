import { Tipos_Usuario } from "./Tipos_Usuario";
export interface Usuario {
    id_usuario:number;
    nombre: string;
    correo: string;
    confirmado?: boolean;
    contrasena?: string
    caracteristicas: Tipos_Usuario;
} 
