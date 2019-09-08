const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.resolve(__dirname, 'node_modules')))
app.use(express.static(path.resolve(__dirname, 'lessons')))
app.use(express.static(path.resolve(__dirname, 'libs')))
app.listen(8000)
