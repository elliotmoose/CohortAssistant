#!/usr/bin/env python3

import sys
from tools import check_date, get_reader
deadlines_path = "CohortAssistant/data/deadlines.csv"
import datetime

def sort_deadlines(deadline):
    day, month, year, hour, minute, second = deadline[2:8]
    time = datetime.datetime(year, month, day,
        hour=hour, minute=minute, second=second)
    return time.timestamp()

def read_date(date=None):
    try:
        weekday, day, month, year = check_date(date)
    except ValueError:
        return 1
    else:
        date = [str(day), month, str(year)]
        events = []
        for event in get_reader(month, year):
            # name weekday day month year start end remark
            if event[2:5] == date:
                events.append((event[0], event[5], event[6], event[7]))
        events.sort(key=lambda event: event[1])
        print("Events:")
        for name, start, end, remark in events:
            if remark:
                print(f"{name} between {start} and {end} ({remark})")
            else:
                print(f"{name} between {start} and {end}")
        deadlines = []
        for deadline in get_reader(filename=deadlines_path):
            # name weekday day month year hour minute second remark
            if deadline[2:5] == date:
                deadlines.append(deadline)
        deadlines.sort(key=sort_deadlines)
        print("Deadlines:")
        for (name, weekday, day, month, year,
                hour, minute, second, remark) in deadlines:
            timing = f"{year}{month}{day}T{hour}{minute}{second}"
            if remark:
                print(f"{name}|{timing}|{remark}")
            else:
                print(f"{name}|{timing}|")
        return 0

def main():
    if len(sys.argv) == 1:
        return read_date()
    elif len(sys.argv) == 2:
        return read_date(sys.argv[1])
    else:
        print("usage: shell/read.py [date]")
        return 1

if __name__ == '__main__':
    main()

