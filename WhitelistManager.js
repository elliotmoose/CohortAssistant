let fs = require('fs')

class WhitelistManager
{
    
    constructor() {
        this._list = []
    }

    get list() {
        return this._list
    }

    set list(list) {
        this._list = list
    }

    Grant(chatID) {
        this.list.push(chatID)
        this.Save()
        console.log("Whitelisted " + chatID)
    }

    IsWhitelisted(id)
    {
        if(this.list.indexOf(id) != -1)
        {
            return true
        }
        
        // for(var user in this.list)
        // {
        //     console.log(user)
        // }
        
        return false
    }

    Save() {
        let self = this

        fs.writeFile('whitelist.json', JSON.stringify(self.list), function (err) {
            if (err) {
                throw err
            }

            self.Load()
        })
    }

    Load() {
        let self = this
        if (fs.existsSync('whitelist.json')) {
            var data = fs.readFileSync('whitelist.json')
            self.list = JSON.parse(data)
        }
        else {
            console.log('Whitelist file does not exist. Attempting to initialize')
            this.Save()
        }
    }
}

module.exports = WhitelistManager;