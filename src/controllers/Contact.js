import Handlebars from 'handlebars';
import { copyFileSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

export class Contact {
    constructor(mail) {
        this.mail = mail
    }

    async contact(req, res) {
        const {
            name,
            mail,
            phone,
            message
        } = req.body
        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

        if (!name) {
            return res.status(200).send({
                status: "error",
                localisation: "name",
                msg: "Merci de rentrer un nom"
            }) 
        }

        if (!mail) {
            return res.status(200).send({
                status: "error",
                localisation: "mail",
                msg: "Merci de rentrer un mail"
            }) 
        }

        if (!phone) {
            return res.status(200).send({
                status: "error",
                localisation: "phone",
                msg: "Merci de rentrer un téléphone"
            }) 
        }

        if (!message) {
            return res.status(200).send({
                status: "error",
                localisation: "message",
                msg: "Merci de rentrer un message"
            }) 
        }

        if (!mail.match(mailRegex)) {
            return res.status(200).send({
                status: "error",
                localisation: "mail",
                msg: "Merci de rentrer mail valide"
            }) 
        }

        if (!phone.match(phoneRegex)) {
            return res.status(200).send({
                status: "error",
                localisation: "phone",
                msg: "Merci de rentrer numéro valide"
            }) 
        }


        const html = this.getMailTemplate(name, mail, phone, message)

        const resp = await this.mail.send(
            "bigyanni1@gmail.com",
            "Nouveau message de " + name + " sur le Site Web",
            html
        )


        if (!resp) {
            return res.status(200).send("error")
        }
        return res.status(200).send("success")
        
    }

    getMailTemplate(name, mail, phone, message) {
        const filePath = join(resolve(), './src/templates/contactMail.html');
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
}