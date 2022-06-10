"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { text } from "stream/consumers";
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
//Clase basada en el modelo de Singleton, se encarga del envio de correos
class Enviador_Correos {
    constructor() {
        //Genera el servicio de mensajeria
        this.transporter = nodemailer_1.default.createTransport({
            pool: true,
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    static get_instancia() {
        if (!Enviador_Correos.instancia) {
            Enviador_Correos.instancia = new Enviador_Correos();
        }
        return Enviador_Correos.instancia;
    }
    //Envia el correo segun los datos que reciva
    enviar_correo(destinatario, asunto, cuerpo) {
        //Se crea un objeto con los datos del objeto
        let mailOptions = {
            from: 'Equipo de Audiophistic <' + process.env.EMAIL_USER + '>',
            to: destinatario,
            subject: asunto,
            html: cuerpo
        };
        // Y se envia el correo
        return this.transporter.sendMail(mailOptions)
            .then((info) => {
            return 'El correo se envió exitosamente a ' + destinatario;
        });
    }
}
exports.default = Enviador_Correos;
