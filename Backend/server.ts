//require('dotenv').config()
import express = require('express')
import cors = require('cors')
import https = require('https')

import fs = require('fs')
const config = JSON.parse(fs.readFileSync('config.json',{encoding:"utf-8"}))
export {config}

//import { User } from './model/ownTypes'
//import { database as db } from './model/dbAccess'
//import {createServer} from 'https'
//import * as pem from 'pem'

import {
    authentificationRoute, 
    routeGuard
} from './routes'

const app = express()

//Logger
const morgan = require('morgan')
import path = require('path')
const accessLogStream = fs.createWriteStream(path.join('/log', 'access.log'), { flags: 'a' })

app.use(morgan('common', { stream: accessLogStream }))

app.use(require('express-bunyan-logger')({
    obfuscate: ['body.password'],
    excludes: ['body.password', 'req.body.password'],
    name: 'logger',
    streams: [{
        level: 'info',
        type: 'rotating-file',
        path: '/log/log.log',
        period: '1d'
        }]
    }))


app.use(
    cors(),
    express.json(),
    express.urlencoded({extended:false}),
    authentificationRoute,
)

//muss nicht laufen, besser auf dem Webserver ein Redirect von http auf https einrichten
app.listen(config.PORT, ()=>{
        console.log(`
        Server wurde gestartet
        url: http://localhost:${config.PORT} 
    `)
})


https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(config.SSL_PORT, () => {
    console.log(`
        Server wurde gestartet
        url: https://localhost:${config.SSL_PORT} 
        `)
})


app.use(express.static('./public'))