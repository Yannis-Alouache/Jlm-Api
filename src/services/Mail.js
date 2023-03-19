import nodemailer from 'nodemailer'

export class Mail {
    constructor(env) {
        this.env = env

        this.transporter = nodemailer.createTransport({
            host: this.env.get("SMTP_HOST"), // hostname
            port: this.env.get("SMTP_PORT"), // port for secure SMTP
            auth: {
              user: this.env.get("MAIL_JLM"),
              pass: this.env.get("PASS_JLM")
            }
        })
    }

    sendWithAttachments(to, subject, html, pathTofileToSend, callback) {
        const mailOption = {
            from: this.env.get("MAIL_JLM"),
            to,
            subject,
            html,
            attachments: [
                {
                    path: pathTofileToSend
                }
            ]
        }

        this.transporter.sendMail(mailOption, (err, info) => {
            callback(err, info)
        });
    }

    async send(to, subject, html) {
        const mailOption = {
            from: this.env.get("MAIL_JLM"),
            to,
            subject,
            html: html,
        }

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    console.log("error is " + error);
                    resolve(false)
                }
                else {
                    console.log(info.envelope)
                    resolve(true)
                }
            });
        })
    }

}