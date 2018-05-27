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
        this._list.push(chatID)
        this.Save()
        this.Load()

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

        fs.writeFile('whitelist.json', JSON.stringify(this._list), function (err) {
            if (err) {
                throw err
            }

            self.Load()
        })
    }

    Load() {
        if (fs.existsSync('whitelist.json')) {
            var data = fs.readFileSync('whitelist.json')
            this.list = JSON.parse(data)[0]
            
        }
        else {
            console.log('Whitelist file does not exist. Attempting to initialize')
            this.Save()
        }
    }
}

module.exports = WhitelistManager;