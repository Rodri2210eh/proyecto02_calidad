import { Album } from "./Album";
import { Audifonos } from "./Audifonos";
import { Parlante } from "./Parlante";
import { Tipo_Producto } from "./Tipo_Producto";

export type Tipos_Producto = Tipo_Producto
    | Audifonos
    | Album
    | Parlante