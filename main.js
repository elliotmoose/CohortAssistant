const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const TelegramBot = require('./TelegramBot.js')
const Homework = require('./Homework.js')
const HomeworkManager = require('./HomeworkManager.js')

const bot = new TelegramBot('604131058:AAGTND-Yr4GNyNwCJMx-YWL-0JrtUdZ_nGM');
const manager = new HomeworkManager()


app.get('/', (req, res) => {
    var newHmwk = new Homework("wk2hmwk1","22/05/18","Physics")
    manager.AddHomework(newHmwk)

    //res.send(req.query)
    res.send(manager.Export())
})

app.listen(8080)