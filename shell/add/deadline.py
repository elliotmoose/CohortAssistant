#!/usr/bin/env python3

schedule_path = "CohortAssistant"
deadlines_path = f"{schedule_path}/data/deadlines.csv"
import sys
sys.path.insert(0, schedule_path)
from tools import check_date, check_timing, get_writer
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def add_deadline(name, date, timing, remark=""):
    weekday, day, month, year = check_date(date)
    month = str(months.index(month))
    if len(month) == 1:
        month = f"0{month}"
    timing = check_timing(timing, "timing")
    if not date or not timing:
        return 1
    else:
        hour, minute = timing.split(":")
        second = "00"
        writer = get_writer(filename=deadlines_path)
        writer.writerow([name, weekday, day, month, year, 
            hour, minute, second, remark])
        return 0

def main():
    if len(sys.argv) in [4, 5]:
        return add_deadline(*sys.argv[1:])
    else:
        print("usage: shell/add/deadline.py name date timing [remark]")
        return 1

if __name__ == '__main__':
    main()

