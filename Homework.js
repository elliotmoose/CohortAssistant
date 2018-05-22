class Homework
{
    constructor(name,date,subject)
    {
        this._name = name
        this._deadline = date
        this._subject = subject
    }

    set name(name)
    {
        this._name = name
    }
    get name()
    {
        return this._name
    }

    set deadline(date)
    {
        this._deadline = date
    }

    get deadline()
    {
        return this.deadline
    }

    set subject(subject)
    {
        this._subject = subject
    }

    get deadline()
    {
        return this.subject
    }

    Export()
    {
        return {name: this._name,deadline: this._deadline, subject: this._subject}
    }
}

module.exports = Homework;