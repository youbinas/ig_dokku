const express = require('express')
const port = 3001
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()



//created model loading here
const Models = require('./models/index')

app.db_url = process.env.MONGO_URL

// mongoose instance connection url connection
mongoose.Promise = Promise

// mongodb connection
mongoose.connect(app.db_url, {
  useMongoClient: true,
  promiseLibrary: global.Promise
})

const db = mongoose.connection

// mongodb error
db.on('error', console.error.bind(console, 'connection error:'))

// mongodb connection open
db.once('open', () => {
        console.log('Mongo connected')
})


//set app prefixe
app.APIROOTPATH = '/api'


app.use(bodyParser.json())

// Serving doc files

app.all('/*', (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS')
        res.status(200).end()
    else
        next()
})


//load the routes
app.use(app.APIROOTPATH, require('./routes/'))

app.use((req, res) =>
    res.status(404).send({
        status: 404,
        message: "Not found !"
    })
)


//server start listen
const server = app.listen(port, () =>{
    if(process.env.NODE_ENV !== "test")
        console.log(`server listenning (port ${server.address().port})`)
})


module.exports = app