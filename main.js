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


//================================================================================================================================================//Menu Index 0
bot.start((ctx) =>
    ctx.telegram.sendMessage(ctx.message.chat.id, GetMenuText('0'), {
        reply_markup: {
            inline_keyboard: GetMenuOptions('0')
        }
    })
)

bot.on('text', function (ctx) {
    switch (ctx.message.text) {
        case 'Show':
            {
                ctx.reply(manager.Show(),{parse_mode: 'HTML'})
            }

        default:
            {
                ctx.reply('Sorry I dont quite understand')
            }
    }
})

//WHEN BUTTON IS PRESSED
bot.on("callback_query", (ctx) => {
    //console.log(ctx.callbackQuery.data)
    ctx.editMessageText(GetMenuText(ctx.callbackQuery.data), {
        reply_markup: {
            inline_keyboard: GetMenuOptions(ctx.callbackQuery.data)
        },
        parse_mode: 'HTML'
    })

});


//#region express
app.get('/', (req, res) => {

    let query = req.query
    if (query.q == "add") {
        if (query.token == "password" && query.name != null && query.date != null && query.subject != null) {
            try {
                var newHmwk = new Homework(query.name, query.date, query.subject)
                manager.AddHomework(newHmwk)
                manager.Save()
                manager.Load()
                res.send(manager.Export())
                return
            }
            catch (err) {
                console.log(err)
                res.send(err)
                return
            }
        }
        else {
            res.send("Please specify the following: name, date, subject")
            return
        }
    }
    else {
        res.send("Please specify a valid query")
        return
    }

    //res.send(req.query)
    res.send(manager.Export())
})

function GetMenuText(mode)
{
    switch(mode)
    {
        case '0':
        {
            return 'Wecome to school boi'
        }

        case 'refresh':
        {
            return manager.Show()
        }
    }
}

function GetMenuOptions(mode)
{
    switch(mode)
    {
        case '0':
        {
            return [[{
                text: 'Show Homework',
                callback_data: 'refresh'
            }]]
        }

        case 'refresh':
        {
            return [[{
                text: 'Refresh',
                callback_data: 'refresh'
            }], [{
                text: 'Back <<',
                callback_data: '0'
            }]]
        }
    }
}


app.listen(8080)
bot.startPolling()
