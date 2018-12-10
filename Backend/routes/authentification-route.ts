import { Router } from 'express'
import { Request,Response , RequestHandler , NextFunction } from 'express'
import { database as db } from '../model/dbAccess'
import { User } from '../model/ownTypes'
import { config, wrapAsync } from '../server'

//import {wrapAsync} from '../server'

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
        next(new noTokenError("No token provided."))
        //next(new Error(JSON.stringify({name: "MyError", message: 'No token provided.'})))
        /*res.status(401)
            .json({ auth: false, message: 'No token provided.' })*/
    } else {
        jwt.verify(token, config.SECRET, (e:any, decoded:any) => 
        {
            if (e) {
                next(e)
                //next(new authenticateError("Failed to authenticate token."))


                //next(new Error(JSON.stringify({message: 'Failed to authenticate token.'})))
                /*return res.status(500)
                    .json({ auth: false, message: 'Failed to authenticate token.' })*/
            } else next()
        })
    }
}

function setToken(id:any){
    console.log(config.JWT_EXPIRATION)
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

/*
route.get('/login', wrapAsync(async function(req:Request, res:Response){
    const test = await new Promise(resolve => setTimeout(()=> resolve(), 50 ))
    throw new Error('woops')
    //res.json("LOGIN")

}))
*/


class credentialsError extends Error {
    readonly errno:number
    constructor(
        public readonly message:string,
    )
    {
        super()
        this.name = "credentialsError"
        this.errno = 123;
    }
}

class noTokenError extends Error {
    readonly errno:number
    constructor(
        public readonly message:string,
    )
    {
        super()
        this.name = "noTokenError"
        this.errno = 456;
    }
}

class authenticateError extends Error {
    readonly errno:number
    constructor(
        public readonly message:string,
    )
    {
        super()
        this.name = "authenticateError"
        this.errno = 789;
    }
}


route.post('/login', (req, res, next) => {
    console.log(req.body)
    authentificationService.checkUser(req.body.email, req.body.password)
        .then((user:any) => {
            console.log(user)
            if (user[0]) {
                const token = setToken(req.body.email)
                //res.status(200).json({ auth: true, token: token, Authorization: 'Bearer ' + token })
                res.json({ auth: true, token: token, Authorization: 'Bearer ' + token })
            } else {
                //const myError = new credentialsError("Wrong email/password.")
                //next(myError)
                next(new credentialsError("Wrong email/password."))
                //next(new Error(JSON.stringify({message: 'Wrong email/password.'})))
                //res.status(404).json({ message: 'Wrong email/password' })
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
            const token = setToken(req.body.email)
            res.status(200).json({ auth: true, token: token, Authorization: 'Bearer ' + token })
        })
        .catch(next)

})

route.post('/checkUser', routeGuard, (req, res,next) => {
    db.checkUser(req.body.email, req.body.password)
        .then((results:any) => {
            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(200).json("Unbekannter Account")
                //next(new Error(JSON.stringify({message: 'Wrong email/password.'})))
                //res.status(404).json({ message: 'Wrong email/password' })
            }
        })
        .catch(next)
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
        //const myError = new noTokenError("No token provided.")
        //next(myError)
        next(new noTokenError("No token provided."))

        //next(new Error(JSON.stringify({message: 'No token provided.'})))
        /*res.status(401)
            .json({ auth: false, message: 'No token provided.' })*/
    } else {
        //synchron + symmetrisch
        const temp = jwt.verify(token, config.SECRET)

        //asysnchron + symmetrisch
        jwt.verify(token, config.SECRET, (e:any, decoded:any) => 
        {
            if (e) {
                //const myError = new noTokenError("Failed to authenticate token.")
                //next(myError)

                //next(new authenticateError("Failed to authenticate token."))

                next(e)

                //next(new Error(JSON.stringify({message: 'Failed to authenticate token.'})))
                /*return res.status(500)
                    .json({ auth: false, message: 'Failed to authenticate token.' })*/
            } else res.status(200).json(decoded)
        })
    }

})


export {
    route as authentificationRoute,
    routeGuard
}