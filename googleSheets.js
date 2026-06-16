const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./telegram-bot-bud-express-83b4a019a3b1.json');

const SHEET_ID = 'ТУТ_ВСТАВ_ID_ТАБЛИЦІ';

async function saveMessage(data) {
    try {
        const doc = new GoogleSpreadsheet(
            SHEET_ID,
            {
                auth: credentials
            }
        );

        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];

        await sheet.addRow({
            'Дата': new Date().toLocaleString('uk-UA'),
            'ID заявки': data.ticketId,
            'Ім\'я': data.name,
            'Населений пункт': data.city,
            'Телефон': data.phone,
            'Суть запитання': data.question
        });

        console.log('✅ Запис успішно додано в Google Sheets');

    } catch (error) {
        console.error(
            '❌ Помилка запису в Google Sheets:',
            error.message
        );
    }
}

module.exports = { saveMessage };