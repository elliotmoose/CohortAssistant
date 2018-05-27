import os
import csv
import functools
import datetime
import calendar
import inspect

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
delimiter = "|"
data_path = "CohortAssistant/data"

class CSVFile(object):
    def __init__(self, dirname, filename):
        self.dirname = dirname
        self.filename = filename

    def __iter__(self):
        try:
            with open(self.filename, "r") as csvfile:
                yield from csvfile.readlines()
        except FileNotFoundError:
            raise StopIteration

    def write(self, *args, **kwargs):
        try:
            with open(self.filename, "a") as csvfile:
                csvfile.write(*args, **kwargs)
        except FileNotFoundError:
            os.mkdir(self.dirname)
            self.write(*args, **kwargs)

def get_dirname(year=None):
    if not year:
        year = datetime.datetime.now().year
    return f"{data_path}/{year}"

def get_filename(year=None, month=None):
    dirname = get_dirname(year)
    if not month:
        month = months[datetime.datetime.now().month-1]
    return f"{dirname}/{month}.csv"

def get_csvfile(func):
    @functools.wraps(func)
    def inner(month=None, year=None, filename=None):
        if not filename:
            dirname = get_dirname(year)
            filename = get_filename(year, month)
        else:
            dirname = filename.rsplit("/", 1)[0]
        csvfile = CSVFile(dirname, filename)
        return func(csvfile)
    return inner

@get_csvfile
def get_writer(csvfile):
    return csv.writer(csvfile, delimiter=delimiter)

@get_csvfile
def get_reader(csvfile):
    return csv.reader(csvfile, delimiter=delimiter)

def check_timing(timing, name="timing", exclude=[".", ":", "am", "pm"]):
    timing = timing.lower()
    pm = "pm" in timing
    for char in exclude:
        if char in timing:
            timing = timing.replace(char, "")
    all_digits = all(char.isdigit for char in timing)
    num_digits = len(timing)
    if not all_digits or num_digits == 0 or num_digits > 4:
        print(f"{name} must be in 2400 format")
        return None
    elif num_digits == 3:
        timing = f"0{timing}"
    elif num_digits == 2:
        timing = f"{timing}00"
    elif num_digits == 1:
        timing = f"0{timing}00"
    hour = timing[:2]
    if pm and int(hour) != 12:
        hour = str(int(hour) + 12)
    if int(hour) not in range(24):
        print(f"{name} hour must be from 0 to 23")
        return None
    minute = timing[2:]
    if int(minute) not in range(60):
        print(f"{name} minute must be from 0 to 59")
        return None
    return f"{hour}:{minute}"

def check_date(date=None, seps="/ "):
    now = datetime.datetime.now()
    if not date:
        date = f"{now.day}/{now.month}/{now.year}"
    for sep in seps:
        if sep in date:
            day, date = date.split(sep, 1)
            day = int(day)
            if sep in date:
                month, date = date.split(sep, 1)
            else:
                month, date = date, ""
            if month.isalpha():
                month = month.capitalize()
                if month in months:
                    month = months.index(month) + 1
                else:
                    print('date month must be from "Jan" to "Dec"')
                    return None
            elif month.isdigit():
                month = int(month)
                if month > 12:
                    print("date month must be from 1 to 12")
                    return None
            else:
                print('date month must be from 1 to 12 or "Jan" to "Dec"')
                return None
            if date:
                year = int(date)
            else:
                year = now.year
            break
        elif date.isdigit():
            day = int(date)
            month = now.month
            year = now.year
            break
    else:
        print("date must be day, day/month, or day/month/year")
        return None
    _, last_day = calendar.monthrange(year, month)
    last_day += 1
    if day not in range(1, last_day):
        print(f"date day must be from 1 to {last_day}")
        return None
    else:
        weekday = weekdays[datetime.date(year, month, day).weekday()]
        month = months[month-1]
        return weekday, day, month, year

def check_weekday(weekday):
    if weekday.isalpha():
        weekday = weekday.capitalize()
        if weekday not in weekdays:
            print('weekday must be from "Mon" to "Fri"')
            return None
    elif weekday.isdigit():
        try:
            weekday = weekdays[int(weekday)-1]
        except (ValueError, IndexError):
            print("weekday must be from 1 to 7")
            return None
    else:
        print('weekday must be from 1 to 7 or "Mon" to "Fri"')
        return None 
    return weekday

