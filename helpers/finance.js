const Finance = {}
const xlsx = require('xlsx');

Finance.processFinanceFile = (financeFile) => {
    // Read xls from req buffer (imported with multer)
    const workbook = xlsx.read(financeFile.buffer, { type: 'buffer' });

    // Process first page of xls
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Get finance records
    const records = [];
    for(let fileRegister of data){
        records.push({concept: fileRegister.CONCEPTO, date: fileRegister['FECHA VALOR'], amount: fileRegister['IMPORTE EUR']})
    }

    return records;
}

module.exports = Finance;