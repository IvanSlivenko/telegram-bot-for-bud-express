const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const credentials = require('./telegram-bot-bud-express-83b4a019a3b1.json');

const SHEET_ID = '170ad3wf5VaatkrcRubmKksexOPNV0MSrh_46PwV5Tn0';

async function saveMessage(data) {
    try {

        const serviceAccountAuth = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ],
        });

        const doc = new GoogleSpreadsheet(
            SHEET_ID,
            serviceAccountAuth
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
        console.error('❌ Повна помилка:');
        console.error(error);
    }
}

module.exports = { saveMessage };