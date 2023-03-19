import mysql from "mysql2"

export class Db {
    constructor(env) {
        this.env = env

        this.pool = mysql.createPool({
            host:       this.env.get("DB_HOST"),
            user:       this.env.get("DB_USER"),
            password:   this.env.get("DB_PASSWORD"),
            database:   this.env.get("DB_NAME")
        }).promise()
    }
}