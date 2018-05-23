let fs = require('fs')

class HomeworkManager {

    constructor() {
        this._list = []
    }

    get list() {
        return this._list
    }

    set list(list) {
        this._list = list
    }

    AddHomework(hwmk) {
        this._list.push(hwmk)
    }

    Export() {
        return JSON.stringify(this._list)
    }

    Save() {
        fs.writeFile('data.txt', JSON.stringify(this._list), function (err) {
            if (err) {
                throw err
            }
        })
    }

    Load() {
        if(fs.existsSync('data.txt'))
        {
            var data = fs.readFileSync('data.txt')
            this.list = JSON.parse(data)
        }
        else
        {
            console.log('Data file does not exist. Attempting to initialize')
            this.Save()
        }
    }

    Sort(mode)
    {
        switch (mode)
        {
            case 0: //deadline
            {

            }

            case 1: //subject and deadline
            {

            }

            case 2: //difficulty
            {
                
            }
        }
    }
}

module.exports = HomeworkManager;