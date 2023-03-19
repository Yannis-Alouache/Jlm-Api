import * as dotenv from 'dotenv'

export class Env {
    constructor() {
        dotenv.config()
    }

    get(name) {
        const env = process.env[name]

        if (typeof env === 'undefined')
            console.log(name + " n'existe pas dans .env")

        return env
    }
}