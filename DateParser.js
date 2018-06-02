
class DateParser {

    static ICalToPresentable(date, contextual) //DD MMM HHMM // contextual means referenceing day name e.g. next friday
    {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        var output = ""

        var year = date.substr(0, 4)
        var month = date.substr(4, 2)
        var monthIndex = parseInt(month) - 1
        var monthName = ""
        if (monthIndex >= 0 && monthIndex < months.length) {
            monthName = months[monthIndex]
        }
        var day = date.substr(6, 2)
        //var hour = date.substr(9,2)
        var hour = date.substr(9, 2)
        var min = date.substr(11, 2)


        var endDate = new Date(`${year}-${month}-${day}T${hour}:${min}:00`)
        var nowDate = new Date()
        var daysAway = (endDate - nowDate) / (3600 * 24 * 1000)

        var ext = "am"

        if (parseInt(hour) > 12) {
            ext = "pm"
            hour = parseInt(hour) - 12
        }

        if (contextual && daysAway <= 14 && daysAway >= 0) //27/5 into  "next friday 1200 pm"
        {
            if (endDate.getUTCDate() == nowDate.getUTCDate() && endDate.getUTCMonth() == nowDate.getUTCMonth() && endDate.getUTCFullYear() == nowDate.getUTCFullYear())//if it is today
            {
                return `TODAY ${hour}:${min}${ext}`
            }

            var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
            var pre = ""

            if (daysAway >= 6) {
                pre = "Next "
            }
            else {
                pre = "Coming "
            }

            output = pre + days[endDate.getUTCDay()] + ` ${hour}:${min}${ext} (${parseInt(day)} ${monthName})`

            return output
        }

        else {


            //output = `d:${day} m:${month} y:${year} HH: ${hour} MM: ${min}`
            output = `${day} ${monthName} ${hour}:${min}${ext}`
            return output
        }

    }

    static ParseDateToICal(input) {
        try {
            var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            var days = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"]
            var output = ""

            var components = input.split(" ")
            if (components[0].toLowerCase() == "next") //next wednesday 6pm
            {

            }



            if (components.length >= 2) { //24May 6pm || 24 May 6pm || 24 6pm || 24/05 6pm || 24/05/2018 || 24May 
                var year = new Date().getUTCFullYear()

                if (components.length == 3) //24 May 2359
                {
                    var month = months.indexOf(components[1].toLowerCase()) + 1
                    var date =  ("0" + components[0]).slice(-2)

                    if (month != 0) //24 May 2359
                    {
                        var month = ("0" + month).slice(-2)

                        var time = components[2]
                        if (parseInt(time) >= 0 && parseInt(time) <= 2359 && time.length == 4)
                        {
                            
                        }
                        else
                        {
                            throw "Please Give Time in 24 Hour Format"
                        }

                        output = `${year}${month}${date}T${time}`
                    }
                    else {
                        throw "Please Give Correct Format"
                    }
                }
                else if (components.length == 2) //24May 6pm || 24 6pm || 24/05 6pm || 24/05/2018 6pm
                {
                    var slashComponents = components[0].split("/")
                    if(slashComponents.length == 2) //24/05 2359
                    {
                        date = ("0" + slashComponents[0]).slice(-2)
                        month = ("0" + slashComponents[1]).slice(-2)
                        var time = components[1]
                        if (parseInt(time) >= 0 && parseInt(time) <= 2359 && time.length == 4)
                        {
                            
                        }
                        else
                        {
                            throw "Please Give Time in 24 Hour Format"
                        }

                        output = `${year}${month}${date}T${time}`
                    }
                    else
                    {
                        throw "Please Give Correct Format"
                    }
                }
                else {

                }
            }
            else { // 24May || 24/05/2018
                throw "Please specify timing"
            }

            // if(days.indexOf(components[0]) != -1) //if by day
            // {

            // // }
            // if (parseInt(components[0]) < 31) {
            //     return components[0] //day
            // }

            return output
        }
        catch (error) {
            console.log('Date Parse Error: ' + error)
            return null
        }




    }

}


//console.log(DateParser.ICalToPresentable('20180528T1800',true))

//console.log(DateParser.ParseDateToICal("24 jan 0600"))
//console.log(DateParser.ParseDateToICal("24/05 2300"))

module.exports = DateParser






// var lastString = components[components.length - 1]
// var ext = lastString.substr(lastString.length - 2, 2).toLowerCase()
// var numbers = lastString.substr(0, lastString.length - 2)
// var offset = 0
// if (ext == 'am') {

// }
// else if (ext == 'pm') {
//     offset = 12
// }
// else {
//     if (numbers.length == 4) //0630 
//     {

//     }

//     throw "Please specify timing"
// }


// //COMPILE TIME
// if (numbers.length == 1) //11pm, 11am
// {
//     hour = parseInt(numbers) + parseInt(offset) //adds the hour
//     hour = ("0" + hour).slice(-2)
// }
// else if (numbers.length == 3)//630
// {
//     hour = parseInt(numbers[0]) + parseInt(offset) //adds the hour
//     hour = ("0" + hour).slice(-2)
//     min = numbers.slice(1, 3)
// }
// else if (numbers.length == 4)//0630am
// {

// }