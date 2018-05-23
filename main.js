const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const Homework = require('./Homework.js')
const HomeworkManager = require('./HomeworkManager.js')

const Telegraf = require('telegraf')
const bot = new Telegraf('604131058:AAGTND-Yr4GNyNwCJMx-YWL-0JrtUdZ_nGM')

var manager = new HomeworkManager()

manager.Load()

//#endregion
bot.start((ctx) => ctx.reply('Welcome'))
bot.on('text', function (ctx) {
    

    if (ctx.message.text == "Show") {
        var output = "Homework: \n"

        manager.list.forEach(hwmk => {
            var name = hwmk._name
            var date = hwmk._deadline
            var subject = hwmk._subject
            output = output + `${subject}: ${name} - ${date}  \n`
        });
        
        ctx.reply(output)
        ctx.telegram.sendMessage(ctx.message.chat.id,'Show:',{
            reply_markup: {
                inline_keyboard: [[{
                    text: 'Show Homework',
                    switch_inline_query: 'share'
                }]]
            }
        })
    }
    else {
        ctx.reply('wazzup')
    }
})


//#region express
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


app.listen(8080)
bot.startPolling()
