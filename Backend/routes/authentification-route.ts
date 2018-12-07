import { Router } from 'express'
import { Request,Response , RequestHandler , NextFunction } from 'express'
import { database as db } from '../model/dbAccess'
import { User } from '../model/ownTypes'
import { config } from '../server'

class AuthentificationService {
    checkUser(email:string, password:string){
        return db.checkUser(email, password)  
    }
}

const authentificationService = new AuthentificationService()

const route = Router()
const jwt = require('jsonwebtoken')


function routeGuard(req:Request,res:Response,next:NextFunction){
    const token = req.headers.token
    if (!token) {
        res.status(401)
            .json({ auth: false, message: 'No token provided.' })
    } else {
        jwt.verify(token, config.SECRET, (e:any, decoded:any) => 
        {
            if (e) {
                return res.status(500)
                    .json({ auth: false, message: 'Failed to authenticate token.' })
            } 
            next()
        })
    }
}

function setToken(id:any){
    return jwt.sign(
        {
            id: id
        }, 
        config.SECRET, 
        {
            algorithm: config.JWT_ENCRYPTION,
            expiresIn: config.JWT_EXPIRATION
        }
    )
}


route.get('/login', (req, res, next)=> {
    res.json("LOGIN")
})


route.post('/login', (req, res, next) => {
    console.log(req.body)
    authentificationService.checkUser(req.body.email, req.body.password)
        .then((user:any) => {
            console.log(user)
            if (user[0]) {
                const token = setToken(req.body.email)
                res.status(200).json({ auth: true, token: token, Authorization: 'Bearer ' + token })
            } else {
                res.status(404).json({ message: 'Wrong email/password' })
            }
        })
        .catch(next)
})


route.post('/newUser', (req, res, next) => {
    const salz = require('crypto').randomBytes(128).toString('base64')
    const user:User = {
        EMail: req.body.email,
        Passwort: req.body.pw,
        Salz: salz
    }
    db.newUser(user)
        .then(results =>{
            //console.log(results)
            const token = setToken(req.body.email)
            res.status(200).json({ auth: true, token: token, Authorization: 'Bearer ' + token })
            //res.json(results)
        })
        .catch(next)

})

route.post('/checkUser', routeGuard, (req, res,next) => {
    db.checkUser(req.body.email, req.body.password)
        .then((results:any) => {
            if (results.length) {
                //console.log(results)
                res.status(200).json(results)
            } else {
                res.status(404).json({ message: 'Wrong email/password' })
            }
        })
})


route.post('/token', routeGuard, (req, res, next)=> {

    //let authorization = req.headers['authorization'] || ''
    /*let authorization = req.headers.authorization || ''

    console.log(typeof authorization)

    if (authorization.startsWith('Bearer ')) {
        // Remove Bearer from string
        authorization = authorization.slice(7, authorization.length)
        console.log(authorization)
    }
*/

    const token = req.headers.token
    if (!token) {
        res.status(401)
            .json({ auth: false, message: 'No token provided.' })
    } else {
        //synchron + symmetrisch
        const temp = jwt.verify(token, config.SECRET)

        //asysnchron + symmetrisch
        jwt.verify(token, config.SECRET, (e:any, decoded:any) => 
        {
            if (e) {
                return res.status(500)
                    .json({ auth: false, message: 'Failed to authenticate token.' })
            }
            res.status(200).json(decoded)
        })
    }

})


export {
    route as authentificationRoute,
    routeGuard
}