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

    AddHomework(hmwk) {
        this._list.push(hmwk)
    }

    RemoveHomework(index) {
        this._list.splice(index, 1)
    }

    Export() {
        return JSON.stringify(this._list)
    }

    Save() {
        let self = this

        fs.writeFile('data.json', JSON.stringify(this._list), function (err) {
            if (err) {
                throw err
            }

            self.Load()
        })
    }

    Load() {
        if (fs.existsSync('data.json')) {
            var data = fs.readFileSync('data.json')
            this.list = JSON.parse(data)

            //sort by deadline
            this.list.sort(function (a, b) {
                if (a._deadline < b._deadline) {
                    return -1
                }
                else if (a._deadline > b._deadline) {
                    return 1
                }
                else {
                    return 0
                }
            })
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

    Show(subjectSort) //returns a string to be output
    {
        var self = this
        var output = "<b>Homework:</b> \n"

        if (subjectSort) {
            var subjects = []
            var subject_data = []

            self.list.forEach(function (hmwk, id) {
                var index = subjects.indexOf(hmwk._subject) //if the subject is already present it will not be 0
                if (index == -1) { //subject not preset
                    subjects.push(hmwk._subject)
                    subject_data[hmwk._subject] = []
                    subject_data[hmwk._subject].push(hmwk)
                }
                else { //subject already present
                    var subject = subjects[index]
                    subject_data[subject].push(hmwk)
                }
            })

            subjects.forEach(function (subject, id) {
                var homeworks = subject_data[subject]
                output = output + `<b>${subject}</b>: \n`

                homeworks.forEach(function (homework, id) {
                    output = output + `   ${self.list.indexOf(homework)})${homework._name} ${homework._deadline} \n`
                })

                output = output + "\n"
            })
        }
        else {
            this.list.forEach(function (hmwk, id) {
                var hmwkFormatted = `${id})${hmwk._subject} ${hmwk._name} ${hmwk._deadline}`
                output = output + hmwkFormatted + "\n"
            })
        }


        return output
    }

    HmwkFormatted(index) {
        if (index >= 0 && index < this.list.length) {
            var hmwk = this.list[index]
            return `${hmwk._subject} ${hmwk._name} ${hmwk._deadline}`
        }
        else {
            return ''
        }
    }

}

// var manager = new HomeworkManager()
// manager.Load()
// console.log(manager.Show(true))
module.exports = HomeworkManager;