import jwt, { JwtPayload } from 'jsonwebtoken';
import { Usuario } from "../Modelo/Usuario";
require('dotenv').config();

/* Clase basada en el modelo de Singleton, 
   se encarga del manejo de los tokens */
export default class Manejador_Tokens {

    private static instancia: Manejador_Tokens;

    private constructor() {
    }

    static get_instancia(): Manejador_Tokens {
        if (!Manejador_Tokens.instancia) {
            Manejador_Tokens.instancia = new Manejador_Tokens();
        }
        return Manejador_Tokens.instancia;
    }


    /* Crea el token del usuario para mantener la sesion
       y seguridad del usuario */
    crear_token(id_usuario: number, correo: string, id_tipo: number): { token: string } {
        var token: string = jwt.sign(
            { id_usuario, correo, caracteristicas: { id_tipo } }
            , process.env.TOKEN_SECRET as string);
        return { token };
    }


    /* Crea el token del usuario para poder comprobar el correo
        del usuario */
    crear_token_registro(id: number): string {
        var token: string = jwt.sign(
            { id }
            , process.env.TOKEN_REGISTER_SECRET as string, { expiresIn: '1 days' });
        return token;
    }

    validar_token(token: string): boolean {
        try {
            let usuario = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
            return (usuario.caracteristicas.id_tipo > 0);
        } catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un permiso inexistente */
            return false;
        }
    }


    // Obtiene los datos del token dado
    descifrar_token(token: string): Usuario {
        let usuario;
        try {
            usuario = jwt.verify(token, process.env.TOKEN_SECRET as string) as Usuario;
        } catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un error */
            throw new Error('El token es inválido');
        }
        if (usuario) {
            return usuario;
        } else {
            throw new Error('El token es inválido');
        }
    }

    //Verifica que el token sea valido y regresa el id del tipo
    verificar_permisos(token: string): number {
        try {
            let usuario = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
            return usuario.caracteristicas.id_tipo;
        } catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un permiso inexistente */
            return -1;
        }
    }

    //Verifica que el token sea valido y regresa el id del usuario a activar
    verificar_token_registro(token: string): number {
        try {
            let usuario = jwt.verify(token, process.env.TOKEN_REGISTER_SECRET as string) as JwtPayload;
            return usuario.id;
        } catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un error */
            throw new Error('El token dado es inválido');
        }
    }
}