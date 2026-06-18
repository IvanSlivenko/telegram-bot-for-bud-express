require('dotenv').config();
// const { saveMessage } = require('./excel');
const { saveMessage } = require('./googleSheets');
const { Bot, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

const users = {};

// 🔥 генерація унікального ID заявки
function generateTicketId() {
    return 'ID-' + Date.now().toString().slice(-6);
}

// ================= START =================
bot.command('start', async (ctx) => {

    const keyboard = new Keyboard()
        .text('📝 Задати запитання')
        .resized();

    await ctx.reply(
        'Вітаю! Натисніть кнопку "📝 Задати запитання", щоб залишити звернення.',
        {
            reply_markup: keyboard
        }
    );
});

// ================= BUTTON =================
bot.hears('📝 Задати запитання', async (ctx) => {

    users[ctx.from.id] = {
        step: 'name'
    };

    await ctx.reply('Введіть ваше ім\'я');
});

// ================= FLOW =================
bot.on('message:text', async (ctx) => {

    const userId = ctx.from.id;
    const text = ctx.message.text;

    // ігноруємо кнопку
    if (text === '📝 Задати запитання') return;

    if (!users[userId]) return;

    switch (users[userId].step) {

        case 'name':
            users[userId].name = text;
            users[userId].step = 'city';

            await ctx.reply('Введіть населений пункт');
            break;

        case 'city':
            users[userId].city = text;
            users[userId].step = 'phone';

            await ctx.reply('Введіть номер телефону');
            break;

        case 'phone':
            users[userId].phone = text;
            users[userId].step = 'manager';

            await ctx.reply('Вкажіть менеджера');
            break;

        case 'manager':
            users[userId].manager = text;
            users[userId].step = 'question';

            await ctx.reply('Опишіть суть запитання');
            break;

        case 'question':
            users[userId].question = text;

            // 🔥 створюємо ID заявки
            users[userId].ticketId = generateTicketId();

            console.log('Нове звернення:', users[userId]);

            // 💾 запис у Google Sheets
            await saveMessage(users[userId]);

            // зберігаємо ID перед очищенням
            const ticketId = users[userId].ticketId;

            // очищаємо дані користувача
            delete users[userId];

            // показуємо кнопку знову
            const keyboard = new Keyboard()
                .text('📝 Задати запитання')
                .resized();

            await ctx.reply(
                `✅ Ваше звернення прийнято!\n🆔 ID: ${ticketId}`,
                {
                    reply_markup: keyboard
                }
            );

            break;
    }
});

// ================= ERROR HANDLING =================
bot.catch((err) => {
    console.error('Помилка:', err);
});

// ================= START BOT =================
bot.start();

console.log('🤖 Бот запущений...');