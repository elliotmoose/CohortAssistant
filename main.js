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
bot.command('show', function (ctx) {
    ctx.reply(GetMenuText('show-subject'), {
        reply_markup: {
            inline_keyboard: GetMenuOptions('show-subject')
        }, parse_mode: 'HTML'
    })
})

bot.command('add', function (ctx) {
    //ADDING HMWK: /add <Subject> <Deadline> <Name> 
    var components = ctx.message.text.split(" ")

    if (components.length < 4) {
        ctx.reply("Please provide a proper format as such: \n<b>SUBJECT &lt;space&gt; DATE &lt;space&gt; NAME</b>", { parse_mode: 'HTML' })
        return
    }

    var subject = components[1]
    var name = components[2]
    var deadline = components[3]

    var hmwk = new Homework(name, deadline, subject)
    manager.AddHomework(hmwk)
    manager.Save()

    ctx.reply(`<b>ADDED:</b> ${subject}: ${name} by ${deadline}`, { parse_mode: 'HTML' })
})

bot.command('remove', function (ctx) {
    //REMOVING HMWK: /remove index
    var components = ctx.message.text.split(" ")
    if (components.length == 2) {
        var index = parseInt(components[1])
        if (index < manager.list.length) {
            var reply = `Removed ${manager.HmwkFormatted(index)}`
            manager.RemoveHomework(index)
            manager.Save()
            ctx.reply(reply)

            return
        }
    }
    ctx.reply("Please provide a proper format e.g: \n <b>/remove 0</b>", { parse_mode: 'HTML' })
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



//callback_query.data = {next: "keyword",params: "data"}
function GetMenuText(mode) {
    switch (mode) {
        case '0':
            {
                return 'What\'s going on?'
            }

        case 'show-deadline':
            {
                return manager.Show(false)
            }
        case 'show-subject':
            {
                return manager.Show(true)
            }
    }
}

function GetMenuOptions(mode) {
    switch (mode) {
        case '0':
            {
                return [[{
                    text: 'By Deadline',
                    callback_data: 'show-deadline'
                }, {
                    text: 'By Subject',
                    callback_data: 'show-subject'
                }
                ]]
            }

        case 'show-deadline':
            {
                return [[{
                    text: 'By Subject',
                    callback_data: 'show-subject'
                }, {
                    text: 'Back <<',
                    callback_data: '0'
                }],[{
                    text: 'Refresh',
                    callback_data: 'show-deadline'
                }]]
            }
            case 'show-subject':
            {
                return [[{
                    text: 'By Deadline',
                    callback_data: 'show-deadline'
                }, {
                    text: 'Back <<',
                    callback_data: '0'
                }],[{
                    text: 'Refresh',
                    callback_data: 'show-subject'
                }]]
            }
    }
}


bot.startPolling()



//#region express
app.get('/', (req, res) => {

    let query = req.query
    if (query.q == "add") {
        if (query.token == "password" && query.name != null && query.date != null && query.subject != null) {
            try {
                var newHmwk = new Homework(query.name, query.date, query.subject)
                manager.AddHomework(newHmwk)
                manager.Save()
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
app.listen(8080)

//#endregion