#!/usr/bin/env python3

import re
import sys
from tools import check_date, check_timing, get_writer

def update(file_path):
    with open(file_path, "r") as file:
        text = file.read()

    modules = re.findall("""\
[ 0-9\.]* - ([ a-zA-Z0-9]*)
    
Status  Units   Grading Grade   Deadlines
Enrolled
[0-9\.]*
Pass/ No Record 2
 
Academic Calendar Deadlines
Class Nbr   Section Component   Days & Times    Room    Instructor  Start/End Date""", text)

    schedules = re.split("""\
[ 0-9\.]* - [ a-zA-Z0-9]*
    
Status  Units   Grading Grade   Deadlines
Enrolled
[0-9\.]*
Pass/ No Record 2
 
Academic Calendar Deadlines
Class Nbr   Section Component   Days & Times    Room    Instructor  Start/End Date""", text)[1:]

    for index in range(len(schedules)):
        module = modules[index]
        schedule = schedules[index]
        lectures, cbls = re.split("[0-9]{4}\nSC[0-9]{2}\nCBL", schedule)
        lectures = re.sub("[0-9]{4}\nLE[0-9]{2}\nLecture", "", lectures)
        for lessons in (lectures, cbls):
            for lesson in lessons.split("\n \n    \n "):
                lesson = lesson.strip()
                if not lesson:
                    continue
                time, place, *profs = lesson.split("\n")
                _, start, _, end = time.split(" ")
                start = check_timing(start, "start")
                end = check_timing(end, "end")
                *profs, date = profs
                profs = " and ".join(
                    prof.replace(",", " ").strip() for prof in profs)
                date, _, _ = date.split(" ")
                weekday, day, month, year = check_date(date)
                remark = f"{place}, by {profs}"
                writer = get_writer(month, year)
                writer.writerow([module, weekday, day, month,
                    year, start, end, remark])
    return 0

def main():
    if len(sys.argv) == 2:
        return update(sys.argv[1])
    else:
        print("usage: ./update.py file_path")
        return 1

if __name__ == '__main__':
    main()
