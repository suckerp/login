import express = require('express')
import cors = require('cors')
require('dotenv').config()
import { User } from './model/ownTypes'
import { database as db } from './model/dbAccess'


const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(
    cors(),
    express.json(),
    express.urlencoded({extended:false})
)

app.post('/login', (req, res, next) => {
    //console.log(req.body)
    //console.log(req.headers)
    const token = jwt.sign(
        {
            id: req.body.email,
            issuer: "ME"
        }, 
        process.env.SECRET, 
        {
            algorithm: 'HS256',
            expiresIn: 86400
        }
    )
    

    res.status(200).json({ auth: true, token: token })
    //res.json({token: token})
})

app.post('/newUser', (req, res, next) => {
    
    const salz = require('crypto').randomBytes(128).toString('base64')
    //console.log(salz)
    const user:User = {
        EMail: req.body.email,
        Passwort: req.body.pw,
        Salz: salz
    }

    db.newUser(user)
        .then(results =>{
            console.log(results)
            const token = jwt.sign(
                {
                    id: req.body.email,
                    issuer: "ME"
                }, 
                process.env.SECRET, 
                {
                    algorithm: 'HS256',
                    expiresIn: 86400
                }
            )
            res.status(200).json({ auth: true, token: token })
            //res.json(results)
        })
        .catch(next)

})

app.post('/checkUser', (req, res,next) => {
    db.checkUser(req.body.email, req.body.pw)
        .then(results => {
            if (results.length) {
                console.log(results)
                res.status(200).json(results)
            } else {
                res.status(404).json({ message: 'Wrong email/password' })
            }
        })
})





app.post('/token', (req, res, next)=> {

    const token = req.headers.token

    if (!token) {
        res.status(401)
            .json({ auth: false, message: 'No token provided.' })
    } else {
        const temp = jwt.verify(token, process.env.SECRET)

        console.log(temp)

        console.log(new Date(Number(temp.iat)*1000))
        console.log(new Date(Number(temp.exp)*1000))

        //
        jwt.verify(token, process.env.SECRET, (e, decoded) => 
        {
            if (e) {
                return res.status(500)
                    .json({ auth: false, message: 'Failed to authenticate token.' })
            } 
            
            console.log(decoded)
            res.status(200).json(decoded)
        })
    }



    
})

app.listen(process.env.PORT, ()=>{
        console.log(`
        Server wurde gestartet
        url: http://localhost:${process.env.PORT} 
    `)
})