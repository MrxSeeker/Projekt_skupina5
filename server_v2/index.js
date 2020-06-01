const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// atlas cluster url
const uri = "mongodb+srv://atlasAdmin:atlasadmin@cluster0-fz73a.mongodb.net/test?retryWrites=true&w=majority";

const app = express()

// Middleware
app.use(cors())

const routes = require('./endpoints.js')

app.use('/', routes)

const port = process.env.PORT || 5000

mongoose.connect(uri, {
    useUnifiedTopology: true
})

mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongodb connection error....'))
db.once('open', () => {
    console.log("Connection to Atlas Cluster Successful.")
})

app.listen(port, () => console.log("Server listening on port " + port))
