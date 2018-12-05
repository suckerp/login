import mysql2 = require('mysql2/promise')
import { pool } from './pool'
import { User } from './ownTypes'


class Database {
    constructor(
        private readonly pool:mysql2.Pool
    ){}

    async newUser(user:User) {
        const temp = await this.pool.query(`
            insert into Users (EMail, Salz, Passwort) values
            ("${user.EMail}", "${user.Salz}", SHA2(CONCAT("${user.Salz}","${user.Passwort}"),512))
        `)
        const [rows, fields] = await this.pool.query(`
            select * from Users where email = "${user.EMail}"
        `)
        return rows
    }

    async checkUser(email:string, pw:string) {
        const [rows, fields] = await this.pool.query(`
            select id from users where email="${email}" and
            passwort = SHA2(CONCAT(salz,"${pw}"),512)
        `)
        return rows
    }

}

const database = new Database(pool)

export {database}