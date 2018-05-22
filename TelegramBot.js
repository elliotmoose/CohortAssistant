
class TelegramBot
{
    constructor(token)
    {
        this._token = token
    }
    
    SendMessage(message) {
        console.log(message)        
    }
}

module.exports = TelegramBot;