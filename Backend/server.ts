import express = require('express')
import cors = require('cors')
require('dotenv').config()
import { User } from './model/ownTypes'
import { database as db } from './model/dbAccess'

import * as pem from 'pem'
import {createServer} from 'https'



import {
    authentificationRoute, 
    routeGuard
} from './routes'

const app = express()


app.use(
    cors(),
    express.json(),
    express.urlencoded({extended:false}),
    authentificationRoute
)

app.use(express.static('./src/public'))

pem.createCertificate({ days: 365, selfSigned: true },  (err, keys) => {    
    createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.SSL_PORT)
})



app.listen(process.env.PORT, ()=>{
        console.log(`
        Server wurde gestartet
        url: http://localhost:${process.env.PORT} 
    `)
})