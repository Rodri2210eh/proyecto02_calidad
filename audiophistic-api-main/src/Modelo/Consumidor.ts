import { Tipo_Usuario } from "./Tipo_Usuario";

export interface Consumidor extends Tipo_Usuario{ 
    direccion_exacta: string;
    celular: string;
    canton:  string;
    provincia: string;
}