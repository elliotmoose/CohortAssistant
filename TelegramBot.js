
class TelegramBot
{
    constructor(token)
    {
        this._token = token
        this.link = `https://api.telegram.org/bot${token}`;
    }

    SetWebHook()
    {
        var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
        //https://api.telegram.org/bot604131058:AAGTND-Yr4GNyNwCJMx-YWL-0JrtUdZ_nGM/setWebhook?url=http://18.237.92.63:8080/
    }
    
    SendMessage(message) {
        console.log(message)        
    }
}

module.exports = TelegramBot;