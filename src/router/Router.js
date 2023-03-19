import express from 'express'
import { Contact } from '../controllers/Contact.js';
import { Invoice } from '../controllers/Invoice.js';
import { Home } from '../controllers/Home.js';
import { Db } from '../services/Db.js';
import { Env } from '../services/Env.js';
import { Mail } from '../services/Mail.js';

export class Router {
    constructor() {
        this.server = express()

        this.server.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", 'https://jlm-traitements.fr/');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.server.use(express.json())
        
        this.env        = new Env()
        this.db         = new Db(this.env)
        this.mail       = new Mail(this.env)
        this.contact    = new Contact(this.mail)
        this.invoice    = new Invoice(this.mail, this.db)
        this.home       = new Home();
    }


    handle() {
        this.server.get('/', this.home.home.bind(this.home))
        this.server.post('/api/contact', this.contact.contact.bind(this.contact))
        this.server.post('/api/invoice/create', this.invoice.create.bind(this.invoice))
    }


    listen() {
        const port = this.env.get("PORT")
        this.server.listen(port, () => {
            console.log(`Server listening on port ${port}...`)
        })
    }
}