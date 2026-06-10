import hashlib
import hmac
import os
from typing import Optional
from urllib.parse import parse_qsl

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")


def verify_widget_auth(data: dict) -> bool:
    if not BOT_TOKEN:
        return False
    check_hash = data.pop("hash", None)
    if not check_hash:
        return False
    data_check = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret = hashlib.sha256(BOT_TOKEN.encode()).digest()
    computed = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()
    return computed == check_hash


def verify_webapp_init_data(init_data: str) -> Optional[dict]:
    if not BOT_TOKEN:
        return None
    parsed = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = parsed.pop("hash", None)
    if not received_hash:
        return None
    data_check = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    computed = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()
    if computed != received_hash:
        return None
    return parsed
