const fs = require('fs')
const path = require('path')

const Homework = require('./Homework.js')
const HomeworkManager = require('./HomeworkManager.js')
const WhitelistManager = require('./WhitelistManager.js')

const Telegraf = require('telegraf')
const bot = new Telegraf('604131058:AAGTND-Yr4GNyNwCJMx-YWL-0JrtUdZ_nGM')

var manager = new HomeworkManager()
var whitelist = new WhitelistManager()

manager.Load()
whitelist.Load()

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
    

    if(!whitelist.IsWhitelisted(ctx.chat.id))
    {
        ctx.reply("Sorry you dont have permissions yet")
        return
    }
    
    //ADDING HMWK: /add <Subject> <Deadline> <Name> 
    var subject = ""
    var name = ""
    var deadlineEntry = ""

    var components = ctx.message.text.split(/"|'|“|”|’|‘/) 
    if(components.length >= 3) //if name explicitly specified
    {
        subject = CapsFirstLetter(components[0].split(" ")[1].trim())
        name = CapsFirstLetter(components[1].trim())
        deadlineEntry = components[2].trim()
    }
    else //if name not explicit
    {
        components = ctx.message.text.split(" ")

        if (components.length < 4) {
            ctx.reply("Please provide a proper format as such: \n<b>SUBJECT &lt;space&gt; NAME &lt;space&gt; DATE</b>", { parse_mode: 'HTML' })
            return
        }

        subject = CapsFirstLetter(components[1]) 
        name = CapsFirstLetter(components[2])

        components.splice(0,3) //remove index,subject,name
        deadlineEntry = components.join(" ")
    }

    var deadline = FormatDeadline(deadlineEntry)

    var hmwk = new Homework(name, deadline, subject)
    manager.AddHomework(hmwk)
    manager.Save()

    ctx.reply(`<b>ADDED:</b> ${subject}: ${name} by ${deadline}`, { parse_mode: 'HTML' })
})

bot.command('remove', function (ctx) {
    
    if(!whitelist.IsWhitelisted(ctx.chat.id))
    {
        reply("Sorry you dont have permissions yet")
        return
    }

    //REMOVING HMWK: /remove index
    var components = ctx.message.text.split(" ")
    if (components.length == 2) {
        var index = parseInt(components[1])
        if (index < manager.list.length) {
            var reply = `<b>REMOVED:</b> ${manager.HmwkFormatted(index)}`
            manager.RemoveHomework(index)
            manager.Save()
            ctx.reply(reply,{parse_mode: 'HTML'})

            return
        }
    }
    ctx.reply("Please provide a proper format e.g: \n <b>/remove 0</b>", { parse_mode: 'HTML' })
})

bot.command('grant',function(ctx)
{
    if(ctx.message.text == "3.14159265358979323846")
    {
        whitelist.Grant(ctx.chat.id)
        ctx.reply("whitelisted")
    }
    else
    {
        ctx.reply("thou shall not pass. Nice try tho")
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
//#endregion


function FormatDeadline(input)
{
    console.log("Format:"+input)
    //shell.exec(`./formate ${name} ${adsad}`)
    return input
}

function CapsFirstLetter(input)
{
    return input.charAt(0).toUpperCase() + input.slice(1)
    //.toLowerCase() //make first letter capital
}

