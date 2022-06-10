import { Estilo } from "../Modelo/Estilo";
import DAO from "./DAO";
export default class Gestor_Estilos {

    private base_datos: DAO;

    constructor() {
        this.base_datos = DAO.get_instancia();
    }

    // Obtiene los datos del estilo
    consultar_estilos(id_producto: number): Promise<Estilo[]> {
        return this.base_datos.consultar_estilos(id_producto)
            .then((producto: Estilo[]) => {
                return producto;
            })
    }

    // Modifica los datos del estilo enviado, cambia la versión y inserta los nuevos datos según la versión
    editar_estilo(id_producto: number): string {
        return "producto modificado";
    }

    modificar_existencia(id_creador: number, estilos: Estilo[]): Promise<string> {
        // Revisa si los datos opcionales están completos
        return this.base_datos.modificar_existencia(id_creador, estilos)
            .then((resultado: string) => {
                return resultado;
            });
    }



}