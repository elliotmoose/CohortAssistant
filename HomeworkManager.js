let fs = require('fs')

class HomeworkManager
{

    constructor()
    {
        this._list = []
    }

    get list()
    {
        return this._list
    }

    set list(list)
    {
        this._list = list
    }

    AddHomework(hwmk)
    {
        this._list.push(hwmk)
    }

    Export()
    {
        return JSON.stringify(this._list)
    }

    Save()
    {
        fs.writeFile('data.txt',JSON.stringify(this._list),function(err){
            if(err)
            {
                throw err
            }
        })
    }

    Load()
    {
        if (fs.exists('data.txt'))
        {
            fs.readFile('data.txt')
        }
        else
        {
            console.log('Data file does not exist. Attempting to initialize')
            this.Save()
        }
    }
}

module.exports = HomeworkManager