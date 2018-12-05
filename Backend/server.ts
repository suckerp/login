require('dotenv').config()
import express = require('express')
import cors = require('cors')
import fs = require('fs')
import https = require('https')

//import { User } from './model/ownTypes'
//import { database as db } from './model/dbAccess'
//import {createServer} from 'https'
//import * as pem from 'pem'

import {
    authentificationRoute, 
    routeGuard
} from './routes'

const app = express()
const privateKey = fs.readFileSync('key.pem')
const certificate = fs.readFileSync('cert.pem')


app.use(
    cors(),
    express.json(),
    express.urlencoded({extended:false}),
    authentificationRoute
)


https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(process.env.SSL_PORT);


/*
// benötigt OpenSLL um zu funktionieren
pem.createCertificate({ days: 365, selfSigned: true },  (err, keys) => {    
    createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.SSL_PORT)
})
*/

app.use(express.static('./public'))


app.listen(process.env.PORT, ()=>{
        console.log(`
        Server wurde gestartet
        url: http://localhost:${process.env.PORT} 
    `)
})