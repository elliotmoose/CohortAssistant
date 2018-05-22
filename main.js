const express = require('express')
const TelegramBot = require('./TelegramBot.js')
let bot = new TelegramBot();

const app = express();
const token = '604131058:AAGTND-Yr4GNyNwCJMx-YWL-0JrtUdZ_nGM';

app.get('/', (req, res) => {
    var hmwk = new Homework("Elliot")
    //bot.SendMessage("HELLO CONSOLE!!!")
    res.send("HAN KEONG IS SO SEXY")


})

app.listen(8080)

class Homework {
    constructor(name)
    {
        this._name = name;
    }

    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    get name() {
        return this._name;
    }
}




class HomeworkTracker
{

}