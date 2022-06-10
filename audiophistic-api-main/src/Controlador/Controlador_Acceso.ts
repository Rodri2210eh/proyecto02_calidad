import { Usuario } from "../Modelo/Usuario"
import Manejador_Tokens from "./Manejador_Tokens";
import Enviador_Correos from "./Enviador_Correos";
import Gestor_Usuarios from "./Gestor_Usuarios";
import bcrypt from 'bcrypt';
import DAO from "./DAO";

/* Se encarga de verificar el inicio de sesion y los
   Y los permisos que tiene un usuario para ciertas acciones */
export default class Controlador_Acceso {
    private base_datos: DAO;
    private manejador_token: Manejador_Tokens;
    private gestor_usuarios: Gestor_Usuarios;

    constructor() {
        this.manejador_token = Manejador_Tokens.get_instancia();
        this.gestor_usuarios = new Gestor_Usuarios();
        this.base_datos = DAO.get_instancia();
    }

    /* Verifica la combinación del correo con la contraseña
       Devuelve un token y el id del tipo del usuario en caso de ser correctos los datos*/
    async verificar_contrasena(correo: string, contrasena: string): Promise<{ id_tipo: number, nombre: string, token: string }> {
        correo = correo.toLowerCase();
        let datosUsuario: Usuario = await this.gestor_usuarios.verificar_usuario(correo);
        let misma_contrasena = await bcrypt.compare(contrasena, datosUsuario.contrasena as string);
        if (misma_contrasena) {
            return {
                id_tipo: datosUsuario.caracteristicas!.id_tipo, nombre: datosUsuario.nombre,
                ...this.crear_token(datosUsuario.id_usuario, datosUsuario.correo
                    , datosUsuario.caracteristicas!.id_tipo)
            };
        } else {
            throw new Error("La contraseña es incorrecta");
        }
    }

    // Genera un token con los datos del usuario
    crear_token(id_usuario: number, correo: string, id_tipo: number): { token: string } {
        return this.manejador_token.crear_token(id_usuario, correo, id_tipo);
    }

    validar_token(token: string): boolean {
        return this.manejador_token.validar_token(token)
    }


    /* Comprueba que permiso enviado exista 
       Y que el token tenga el mismo permiso que el enviado*/
    validar_tipo(token: string, permiso: number): Promise<string> {
        return this.base_datos.existe_tipo_usuario(permiso)
            .then(() => {
                if (this.verificar_permisos(token, permiso)) {
                    return 'El usuario tiene los permisos dados'
                    
                }
                throw new Error('El usuario no tiene los permisos dados')
            })

    }

    // Comprueba que el token tenga el mismo permiso que el enviado
    verificar_permisos(token: string, permiso: number): boolean {
        return this.manejador_token.verificar_permisos(token) === permiso;
    }

}