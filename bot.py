import os
from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo
from aiogram.utils import executor
import json

API_TOKEN = '7488513286:AAEXGjLkF6QLsx0ZLusd_kK-p7cHq_xs07g'
WEBAPP_URL = 'https://memory-game.site'

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(types.KeyboardButton(
        text="Играть в Memory",
        web_app=WebAppInfo(url=WEBAPP_URL)
    ))
    
    await message.answer(
        "Привет! Давай сыграем в Memory Game!",
        reply_markup=markup
    )

@dp.message_handler(content_types=['web_app_data'])
async def web_app_handler(message: types.Message):
    try:
        data = json.loads(message.web_app_data.data)
        if data.get('action') == 'share':
            attempts = data.get('attempts')
            await message.answer(
                f"🎮 Я прошел Memory Game за {attempts} попыток! Сможешь лучше?"
            )
    except json.JSONDecodeError:
        await message.answer("Произошла ошибка при обработке данных")
    except Exception as e:
        await message.answer(f"Произошла ошибка: {str(e)}")

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True) 