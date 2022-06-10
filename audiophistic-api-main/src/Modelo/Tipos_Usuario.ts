import { Administrador } from "./Administrador";
import { Consumidor } from "./Consumidor";
import { Creador_de_Contenido } from "./Creador_de_Contenido";
import { Tipo_Usuario } from "./Tipo_Usuario";

export type Tipos_Usuario = Tipo_Usuario
    | Administrador
    | Creador_de_Contenido
    | Consumidor