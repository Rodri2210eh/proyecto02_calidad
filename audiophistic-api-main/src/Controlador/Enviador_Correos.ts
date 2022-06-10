//import { text } from "stream/consumers";
import nodemailer, { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

require('dotenv').config();

//Clase basada en el modelo de Singleton, se encarga del envio de correos
export default class Enviador_Correos {
    private transporter: Mail<SentMessageInfo>

    private static instancia: Enviador_Correos;

    constructor() {
        //Genera el servicio de mensajeria
        this.transporter = nodemailer.createTransport({
            pool: true,
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    static get_instancia() {
        if (!Enviador_Correos.instancia) {
            Enviador_Correos.instancia = new Enviador_Correos();
        }
        return Enviador_Correos.instancia;
    }

    //Envia el correo segun los datos que reciva
    enviar_correo(destinatario: string, asunto: string, cuerpo: string): Promise<string> { //la funcion con la que vamos a mandar correos

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
            return 'El correo se envió exitosamente a '+ destinatario;
        });

    }

}
