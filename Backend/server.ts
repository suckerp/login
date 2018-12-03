import express = require('express')
import cors = require('cors')

const app = express()

app.use(
    cors(),
    express.json(),
    express.urlencoded({extended:false})
)

app.post('/login', (req, res, next) => {
    console.log(req.headers)
    res.json("TOKEN")
})

const port = 3000

app.listen(port, ()=>{
    console.log(`
    Server wurde gestartet
    url: http://localhost:${port} 
`)
})