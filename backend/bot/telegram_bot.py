import asyncio
import logging
import os
import sys
from datetime import datetime

import httpx
from zoneinfo import ZoneInfo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_URL = os.getenv("API_URL", "http://localhost:8000")
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
REMINDER_HOUR = int(os.getenv("REMINDER_HOUR", "20"))
TZ = ZoneInfo(os.getenv("TZ", "Asia/Bishkek"))


async def send_reminders():
    if not BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN жок — эскертүүлөр өткөрүлдү")
        return

    try:
        from telegram import Bot
        from telegram.error import TelegramError
    except ImportError:
        logger.error("python-telegram-bot орнотулган эмес")
        return

    bot = Bot(token=BOT_TOKEN)
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{API_URL}/api/internal/reminders", timeout=30)
            if resp.status_code != 200:
                logger.error("API жооп бербedi: %s", resp.status_code)
                return
            reminders = resp.json()
        except Exception as exc:
            logger.error("API байланышы иштебedi: %s", exc)
            return

    for item in reminders:
        chat_id = item.get("chat_id")
        name = item.get("full_name", "Окуучу")
        if not chat_id:
            continue
        text = (
            f"Ассаламу алейкум, {name}! 👋\n\n"
            "Сиз бүгүн прогрессиңизди белгилеген жоксуз.\n\n"
            "📖 **Куран окуу баарынан артык!**\n\n"
            "Куран окууңузду унутпаңыз жана бүгүн да бир бет окуңуз! 🌟"
        )
        try:
            await bot.send_message(chat_id=chat_id, text=text, parse_mode="Markdown")
            logger.info("Эскертүү жөнөтүлдү: %s", name)
        except TelegramError as exc:
            logger.error("Жөнөтүү катасы %s: %s", name, exc)


async def reminder_loop():
    sent_today = None
    while True:
        now = datetime.now(TZ)
        if now.hour == REMINDER_HOUR and sent_today != now.date():
            await send_reminders()
            sent_today = now.date()
        await asyncio.sleep(60)


async def run_bot():
    if not BOT_TOKEN:
        logger.info("Бот токени жок — reminder_loop гана иштейт")
        await reminder_loop()
        return

    from telegram import Update
    from telegram.ext import Application, CommandHandler, ContextTypes

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        await update.message.reply_text(
            "Ассаламу алейкум! Quran Tracker ботуна кош келиңиз.\n\n"
            "Туташуу үчүн:\n"
            "/link <логин> <пароль>\n\n"
            "Мисал: /link ahmad student123"
        )

    async def link(update: Update, context: ContextTypes.DEFAULT_TYPE):
        if len(context.args) < 2:
            await update.message.reply_text("Колдонуу: /link <логин> <пароль>")
            return
        username, password = context.args[0], context.args[1]
        chat_id = str(update.effective_chat.id)
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{API_URL}/api/telegram/link",
                json={"username": username, "password": password, "chat_id": chat_id},
            )
        if resp.status_code == 200:
            data = resp.json()
            await update.message.reply_text(f"✅ {data['full_name']} — ийгиликтүү туташты!")
        else:
            await update.message.reply_text("❌ Логин же пароль туура эмес")

    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("link", link))

    await app.initialize()
    await app.start()
    await app.updater.start_polling()

    logger.info("Telegram бот иштеп жатат")
    await reminder_loop()


if __name__ == "__main__":
    asyncio.run(run_bot())
