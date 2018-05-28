
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
        var daysAway = (endDate - nowDate)/(3600 * 24 * 1000)

        var ext = "am"

        if (parseInt(hour) > 11) {
            ext = "pm"
            hour = parseInt(hour) - 12
        }

        if (contextual && daysAway <= 14 && daysAway >= 0) //27/5 into  "next friday 1200 pm"
        {
            if(endDate.getUTCDate() == nowDate.getUTCDate() && endDate.getUTCMonth() == nowDate.getUTCMonth() && endDate.getUTCFullYear() == nowDate.getUTCFullYear())//if it is today
            {
                return `TODAY ${hour}:${min}${ext}`
            }

            var days = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"]
            var pre = ""

            if (daysAway >= 6)
            {
                pre = "Next "
            }
            else
            {
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

}


console.log(DateParser.ICalToPresentable('20180528T1800',true))
module.exports = DateParser