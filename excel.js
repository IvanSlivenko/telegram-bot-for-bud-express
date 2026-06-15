const XLSX = require('xlsx');
const fs = require('fs');

const FILE_NAME = 'Messages.xlsx';

function saveMessage(data) {
    let workbook;
    let worksheet;

    // Якщо файл вже існує — читаємо його
    if (fs.existsSync(FILE_NAME)) {
        workbook = XLSX.readFile(FILE_NAME);
        worksheet = workbook.Sheets['Messages'];
    } else {
        // Створюємо новий файл
        workbook = XLSX.utils.book_new();

        worksheet = XLSX.utils.aoa_to_sheet([
            [
                'Дата',
                'ID заявки',
                'Ім\'я',
                'Населений пункт',
                'Телефон',
                'Суть запитання'
            ]
        ]);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Messages'
        );
    }

    // Додаємо новий рядок
    XLSX.utils.sheet_add_aoa(
        worksheet,
        [[
            new Date().toLocaleString(),
            data.ticketId || '',
            data.name || '',
            data.city || '',
            data.phone || '',
            data.question || ''
        ]],
        { origin: -1 }
    );

    // Оновлюємо лист у workbook
    workbook.Sheets['Messages'] = worksheet;

    // Записуємо файл
    XLSX.writeFile(workbook, FILE_NAME);
}

module.exports = { saveMessage };