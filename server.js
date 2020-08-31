const express = require('express')
const app = express()
const cors = require('cors')
const handlers = require ('./lib/handlers')

app.use(cors())
app.use(express.static('public'))

app.get('/packages/:name', handlers.getPackage)
app.get('/packages', handlers.getAllPackages)

app.listen(8080)




