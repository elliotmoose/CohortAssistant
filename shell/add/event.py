#!/usr/bin/env python3

schedule_path = "CohortAssistant"
import sys
sys.path.insert(0, schedule_path)
from tools import check_date, check_timing, get_writer

def add_event(name, date, start, end, remark=None):
    try:
        weekday, day, month, year = check_date(date)
    except ValueError:
        return 1
    else:
        start = check_timing(start, "start")
        end = check_timing(end, "end")
        if not start or not end:
            return 1
        writer = get_writer(month, year)
        writer.writerow([name, weekday, day, month,
            year, start, end, remark])
        return 0

def main():
    if len(sys.argv) in [5, 6]:
        return add_event(*sys.argv[1:])
    else:
        print("usage: shell/add/event.py name date start end [remark]")
        return 1

if __name__ == '__main__':
    main()

