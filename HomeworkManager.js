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
        //return {name: "Elliot"}
    }
}

module.exports = HomeworkManager