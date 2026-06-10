import os
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

TIMEZONE = ZoneInfo(os.getenv("TZ", "Asia/Bishkek"))


def today_local() -> date:
    return datetime.now(TIMEZONE).date()


def yesterday_local() -> date:
    return today_local() - timedelta(days=1)


def progress_score(page_number: int, repetitions: int) -> int:
    return page_number * repetitions
