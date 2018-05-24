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

    RemoveHomework(index) {
        this._list.splice(index, 1)
    }

    Export() {
        return JSON.stringify(this._list)
    }

    Save() {
        let self = this
        fs.writeFile('data.txt', JSON.stringify(this._list), function (err) {
            if (err) {
                throw err
            }

            self.Load()
        })
    }

    Load() {
        if (fs.existsSync('data.txt')) {
            var data = fs.readFileSync('data.txt')
            this.list = JSON.parse(data)
        }
        else {
            console.log('Data file does not exist. Attempting to initialize')
            this.Save()
        }
    }

    Sort(mode) {
        switch (mode) {
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

    Show(mode) //returns a string to be output
    {
        var output = "<b>Homework:</b> \n"

        switch (mode) {
            case 0: //Sort by deadline
                {

                }

            case 1: //Sort by subject and deadline
                {
                    var subjects = []
                    var subject_data = []
                    this.list.forEach(hmwk => {
                        if (subjects.indexOf(hwmk._subject) == -1) {
                            subjects.push(hwmk.subject)
                            subject_data.push(hmwk)
                        }
                        else {

                        }
                    })
                }
        }


        // for(var i = 0; i < this.list.length; i++)
        // {
        //     var hmwk = this.list[i]
        //     var hmwkFormatted = `${i}) ${hmwk._subject} ${hmwk._name} ${hmwk._deadline}`

        //     output = output + hmwkFormatted + "\n"
        // }


        this.list.forEach(function (hmwk, id) {
            var hmwkFormatted = `${id})${hmwk._subject} ${hmwk._name} ${hmwk._deadline}`
            output = output + hmwkFormatted + "\n"
        })

        return output
    }

    HmwkFormatted(index) {
        if(index >= 0 && index < this.list.length)
        {
            var hmwk = this.list[index]
            return `${hmwk._subject} ${hmwk._name} ${hmwk._deadline}`
        }
        else
        {
            return ''
        }
    }

}

// var manager = new HomeworkManager()
// manager.Load()
// console.log(manager.Show())


module.exports = HomeworkManager;