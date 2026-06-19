require('dotenv').config();

const { saveMessage } = require('./googleSheets');
const { Bot, InlineKeyboard, InputFile } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

const users = {};

// ================= ID =================
function generateTicketId() {
    return 'ID-' + Date.now().toString().slice(-6);
}

// ================= START SCREEN =================
async function showStartScreen(ctx) {

    const keyboard = new InlineKeyboard()
        .text('📝 Задати запитання', 'new_question');

    await ctx.replyWithPhoto(
        new InputFile('./start_quest_2.JPG'),
        {
            // caption:
            //     'Вітаю!\n\nНатисніть кнопку нижче, щоб залишити звернення.',
            reply_markup: keyboard
        }
    );

}

// ================= START =================
bot.command('start', async (ctx) => {
    await showStartScreen(ctx);
});

// ================= INLINE BUTTON =================
bot.callbackQuery('new_question', async (ctx) => {

    users[ctx.from.id] = {
        step: 'name'
    };

    await ctx.answerCallbackQuery();

    await ctx.reply("Введіть ваше ім'я");

});

// ================= FLOW =================
bot.on('message', async (ctx) => {

    const userId = ctx.from.id;
    const text = ctx.message.text;

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
            users[userId].ticketId = generateTicketId();

            console.log('Нове звернення:', users[userId]);

            await saveMessage(users[userId]);

            const ticketId = users[userId].ticketId;

            delete users[userId];

            await ctx.reply(
                `✅ Ваше звернення прийнято!\n🆔 ID: ${ticketId}`
            );

            await showStartScreen(ctx);

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