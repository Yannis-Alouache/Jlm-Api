import nodemailer from 'nodemailer'
import Handlebars from 'handlebars';
import { readFileSync } from 'fs'
import { join, resolve } from 'path'

export class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "ssl0.ovh.net", // hostname
            port: 465, // port for secure SMTP
            auth: {
              user: "jlm@multitraitements.fr",
              pass: "Calix85350"
            }
        })
    }


    getMailTemplate(name, mail, phone, message) {
        const filePath = join(resolve(), './src/templates/mail.html');
        const source = readFileSync(filePath, 'utf-8').toString();
        const template = Handlebars.compile(source);
        const replacements = {
          name: name,
          mail: mail,
          phone: phone,
          message: message
        };
    
        return template(replacements)
    }


    send(to, subject, html, callback) {
        this.transporter.sendMail({
            from: "jlm@multitraitements.fr",
            to,
            subject,
            html
        }, (err, info) => {
            callback(err, info)
        });
    }

}