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
    
    let query = req.query
    if (query.q == "add")
    {
        if(query.token == "password" && query.name != null && query.date != null && query.subject != null)
        {
            try
            {
                var newHmwk = new Homework(query.name,query.date,query.subject)
                manager.AddHomework(newHmwk)
                manager.Save()
                manager.Load()
                res.send(manager.Export())
                return
            }
            catch(err)
            {
                console.log(err)
                res.send(err)
                return
            }
        }
        else
        {
            res.send("Please specify the following: name, date, subject")
            return
        }
    }   
    else
    {
        res.send("Please specify a valid query")
        return
    }

    //res.send(req.query)
    res.send(manager.Export())
})


app.listen(8443)