

export class Contact {
    constructor(mail) {
        this.mail = mail
    }

    contact(req, res) {

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

        
        this.mail.send(
            "bigyanni1@gmail.com",
            "Nouveau message de ' + name + ' sur le Site Web",
            this.mail.getMailTemplate(name, mail, phone, message),
            (err, info) => {
                if (err) {
                    return res.status(200).send("error")
                }
                else {
                    console.log(info.envelope)
                    return res.status(200).send("success")
                }
            })
    }
}