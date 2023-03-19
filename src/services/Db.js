import mysql from "mysql2"

export class Db {
    constructor(env) {
        this.env = env

        this.pool = mysql.createPool({
            host:       this.env.get("DB_HOST"),
            user:       this.env.get("DB_USER"),
            password:   this.env.get("DB_PASSWORD"),
            port:       this.env.get("DB_PORT"),
            database:   this.env.get("DB_NAME")
        }).promise()
    }
}