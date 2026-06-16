const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID
);

async function saveMessage(data) {

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
        'Дата': new Date().toLocaleString(),
        'ID заявки': data.ticketId,
        'Ім\'я': data.name,
        'Населений пункт': data.city,
        'Телефон': data.phone,
        'Суть запитання': data.question
    });
}

module.exports = { saveMessage };