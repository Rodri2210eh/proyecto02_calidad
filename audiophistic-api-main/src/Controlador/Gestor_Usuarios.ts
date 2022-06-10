import { Producto } from "../Modelo/Producto";
import { Tipos_Usuario } from "../Modelo/Tipos_Usuario";
import { Usuario } from "../Modelo/Usuario"
import { Carrito } from "../Modelo/Carrito";
import DAO from "./DAO";
export default class Gestor_Usuarios {
    // Definimos como hacer las llamadas al DAO
    base_datos: DAO;

    constructor() {
        this.base_datos = DAO.get_instancia();
    }


    // Registra el usuario con los datos ingresados
    registrar_usuario(correo: string, nombre: string, contrasena: string): Promise<number> {
        return this.base_datos.registrar_usuario(correo, nombre, contrasena)
            .then((id_tipo: number) => {
                return id_tipo;
            });
    }

    confirmar_usuario(id_usuario: number): Promise<string> {
        return this.base_datos.confirmar_usuario(id_usuario);
    }

    verificar_usuario(correo: string): Promise<Usuario> {
        return this.base_datos.verificar_usuario(correo);
    }

    // Crear Usuario Creador de Contenido
    crear_usuario(correo: string, nombre: string, contrasena: string, caracteristicas: Tipos_Usuario): Promise<string> {
        return this.base_datos.crear_usuario(caracteristicas.id_tipo, correo, nombre, contrasena, caracteristicas)
            .then((id_tipo: string) => {
                return id_tipo;
            });
    }

    // Elimina el usuario dado usando el método del DAO
    eliminar_usuario(id_usuairo: number): Promise<string> {
        return this.base_datos.eliminar_usuario(id_usuairo);
    }

    // Crea el hash y llama a cambiar la contraseña a la base
    cambiar_contrasena(id_usuario: number, contrasena: string): Promise<string> {
        return this.base_datos.cambiar_contrasena(id_usuario, contrasena)
            .then((resultado: string) => {
                return resultado;
            })
    }

    // Crea el hash y llama a cambiar la contraseña a la base
    cambiar_contrasena_con_correo(correo: string, contrasena: string): Promise<string> {
        return this.base_datos.cambiar_contrasena_con_correo(correo, contrasena).then((resultado: string) => {
            return resultado;
        })
    }

    //Trae la informacion del grupo de usuarios
    consultar_usuarios(): Promise<Usuario[]> {
        return this.base_datos.consultar_usuarios()
            .then((usuario: Usuario[]) => {
                return usuario;
            })
    }

    // Consulta un usuario con su id
    consultar_usuario(id_usuario: number): Promise<Usuario> {
        return this.base_datos.consultar_usuario(id_usuario)
            .then((usuario: Usuario) => {
                return usuario;
            })
    }

    // Consulta un usuario con su id
    consultar_creador_contenido(id_creador: number): Promise<Usuario> {
        return this.base_datos.consultar_creador_contenido(id_creador)
            .then((usuario: Usuario) => {
                return usuario;
            })
    }

    // Modifica los datos del usuario enviado
    editar_usuario(usuario: Usuario, nombre: string, caracteristicas: Tipos_Usuario): Promise<string> {
        return this.base_datos.editar_usuario(usuario.id_usuario, nombre, caracteristicas)
            .then((resultado: string) => {
                return resultado;
            });
    }

    // Busqueda General
    consultar_creadores_contenido(): Promise<Usuario[]>{
        return this.base_datos.consultar_creadores_contenido()
        .then((resultado: Usuario[]) => {
            return resultado
        });
    }

    



}