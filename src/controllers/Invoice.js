import PDFDocument from 'pdfkit'
import { copyFileSync, createWriteStream } from 'fs'
import { nanoid } from 'nanoid'
import dateFormat from 'dateformat'
import { readFileSync, unlink } from 'fs'
import { join, resolve } from 'path'

export class Invoice {
    constructor(mail, db) {
        this.mail = mail
        this.db = db
    }

    async create(req, res) {
        const {
            name,
            address,
            mail,
            phone,
            cp,
            city,
            service,
            surface,
        } = req.body

        const validService = [
            "Dératisation Rats/Souris",
            "Destruction Nids guêpe/frelons",
            "Desinsectisation",
            "Dépigeonnage",
            "Traitement contre les taupes",
            "Traitement contre les acariens"
        ]

        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/

        if (!name) {
            return res.status(200).send({
                status: "error",
                localisation: "name",
                msg: "Merci de rentrer un nom"
            }) 
        }

        if (!address) {
            return res.status(200).send({
                status: "error",
                localisation: "address",
                msg: "Merci de rentrer une addresse"
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
                msg: "Merci de rentrer un numéro de téléphone"
            }) 
        }

        if (!cp) {
            return res.status(200).send({
                status: "error",
                localisation: "cp",
                msg: "Merci de rentrer un code postal"
            }) 
        }


        if (!city) {
            return res.status(200).send({
                status: "error",
                localisation: "city",
                msg: "Merci de rentrer une ville"
            }) 
        }

        if (!service) {
            return res.status(200).send({
                status: "error",
                localisation: "service",
                msg: "Merci de choisir un service"
            }) 
        }

        if (!surface) {
            return res.status(200).send({
                status: "error",
                localisation: "surface",
                msg: "Merci de rentrer une surface"
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

        if (cp.length != 5 || isNaN(cp)) {
            return res.status(200).send({
                status: "error",
                localisation: "cp",
                msg: "Merci de rentrer un code postal valide"
            }) 
        }

        if (isNaN(surface)) {
            return res.status(200).send({
                status: "error",
                localisation: "surface",
                msg: "Merci de rentrer une surface valide"
            }) 
        }

        if (!validService.includes(service)) {
            return res.status(200).send({
                status: "error",
                localisation: "service",
                msg: "Merci de rentrer un service valide"
            }) 
        }

        

        const invoiceId = nanoid(15)
        const invoicePath = "./src/assets/out/" + dateFormat(new Date(), "dd-mm-yyyy-MM-ss") + ".pdf"

        this.doc = new PDFDocument()
        this.doc.fontSize(10)
        this.doc.font("Helvetica")

        this.generateHeader(name, address, mail, phone, cp, city)
        this.generateInfo(invoiceId)
        await this.generateInvoiceDetail(service, surface)

        this.doc.end()
        this.doc.pipe(createWriteStream(invoicePath))
        
        this.mail.sendWithAttachments(mail, "Devis JLM", this.getMailTemplate(), invoicePath, (err, info) => {
            if (err) {
                console.log(err)
                return res.status(200).send({error: err})
            }
            else {
                console.log(info.envelope)
                console.log(invoicePath)
                unlink(invoicePath, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
                return res.status(200).send("success")
            }
        })

        return res.send("PDF crée !")
    }

    generateHeader(name, address, mail, phone, cp, city) {
        this.doc.image('./src/assets/logo.jpg', 50, 45, {width: 200})

        this.doc.text(name, 0, 80 + 15, { align: "right" })
        this.doc.text(address, 0, 80 + 30, { align: "right" })
        this.doc.text(cp + " " + city , 0, 80 + 45, { align: "right" })
        this.doc.text(mail, 0, 80 + 60, { align: "right" })
        this.doc.text(phone, 0, 80 + 75, { align: "right" })

        this.doc.moveDown()
    }

    generateInfo(invoiceId) {
        this.doc.fillColor("#444444")
        this.doc.fontSize(20)
        this.doc.text("Devis", 50, 200);

        this.generateSeparator(225)

        this.doc.fontSize(10)

        this.doc.text("Devis n° :", 50, 240)
        this.doc.font("Helvetica-Bold")
        this.doc.text(invoiceId, 150, 240)

        this.doc.font("Helvetica")

        this.doc.text("Date du devis :", 50, 240 + 15)
        this.doc.font("Helvetica-Bold")
        this.doc.text(dateFormat(new Date(), 'dd-mm-yyyy'), 150, 240 + 15)

        this.doc.font("Helvetica")

        this.doc.text("Prix :", 50, 240 + 30)
        this.doc.font("Helvetica-Bold")
        this.doc.text("700€", 150, 240 + 30)

        this.generateSeparator(290)
        this.doc.moveDown()
    }

    async generateInvoiceDetail(service, surface) {
        const htPrice = await this.getHtPrice(service, surface)
        const unitPrice = await this.getUnitPrice(service)
        const tva = this.getTVA(htPrice)

        this.doc.text("Service", 50, 330)
        this.doc.text("Description", 200, 330)
        this.doc.text("Prix au m² HT", 280, 330, { width: 90, align: "right" })
        this.doc.text("Surface", 370, 330, { width: 90, align: "right" })
        this.doc.text("Total HT", 0, 330, { align: "right" })
        this.generateSeparator(330 + 20)

        this.doc.font("Helvetica")

        this.doc.text(service, 50, 330 + 30, {width: 150})
        this.doc.text("Espace de " + surface + " m²", 200, 330 + 30)
        this.doc.text(unitPrice + " €", 280, 330 + 30, { width: 90, align: "right" })
        this.doc.text(surface + " m²", 370, 330 + 30, { width: 90, align: "right" })
        this.doc.text(htPrice + " €", 0, 330 + 30, { align: "right" })
        this.generateSeparator(380)


        this.doc.text("Prix Total HT :", 370, 400, { width: 90, align: "right" })
        this.doc.text(htPrice + " €", 0, 400, { align: "right" })

        this.doc.text("TVA à 20% :", 370, 420, { width: 90, align: "right" })
        this.doc.text(tva + " €", 0, 420, { align: "right" })

        this.doc.text("Prix Total TTC :", 370, 440, { width: 90, align: "right" })
        this.doc.text(htPrice + tva + " €", 0, 440, { align: "right" })

    }

    generateSeparator(y) {
        this.doc.strokeColor("#000000")
        this.doc.lineWidth(1)
        this.doc.moveTo(50, y)
        this.doc.lineTo(550, y)
        this.doc.stroke()
    }

    async getHtPrice(service, surface) {
        const unitPrice = await this.getUnitPrice(service)
        return unitPrice * surface
    }

    async getUnitPrice(service) {
        const [result] = await this.db.pool.query("SELECT `prix` FROM `prix` WHERE `libelle` = ?", [service])
        return result[0].prix
    }

    getTVA(htPrice) {
        const result = htPrice / 100 * 20
        return Math.round(result * 100) / 100;
    }

    getMailTemplate() {
        const filePath = join(resolve(), './src/templates/invoiceMail.html');
        const source = readFileSync(filePath, 'utf-8').toString();

        return source
    }

}