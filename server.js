const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.resolve(__dirname, 'node_modules')))
app.use(express.static(path.resolve(__dirname, 'courses')))
app.listen(8000)
