const express = require('express')
const app = express()

//#region express
app.get('/', (req, res) => {

    let query = req.query
    if (query.q == "add") {
        if (query.token == "password" && query.name != null && query.date != null && query.subject != null) {
            try {
                var newHmwk = new Homework(query.name, query.date, query.subject)
                manager.AddHomework(newHmwk)
                manager.Save()
                res.send(manager.Export())
                return
            }
            catch (err) {
                console.log(err)
                res.send(err)
                return
            }
        }
        else {
            res.send("Please specify the following: name, date, subject")
            return
        }
    }
    else {
        res.send("Please specify a valid query")
        return
    }

    //res.send(req.query)
    res.send(manager.Export())
})
app.listen(8080)
