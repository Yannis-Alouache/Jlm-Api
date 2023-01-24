import express from 'express'
import { Contact } from '../controllers/Contact.js';
import { Mail } from '../services/Mail.js';

export class Router {
    constructor() {
        this.server = express()

        this.server.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.server.use(express.json())

        this.mail       = new Mail()
        this.contact    = new Contact(this.mail)
    }


    handle() {
        this.server.post('/api/contact', this.contact.contact.bind(this.contact))
    }


    listen(port) {
        this.server.listen(port, () => {
            console.log(`Server listening on port ${port}...`)
        })
    }

}