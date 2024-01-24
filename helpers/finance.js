const FinanceHelper = {}
const xlsx = require('xlsx');
const Finance = require('../models/finance');
const Notion = require('../helpers/notion');

FinanceHelper.processFinanceFile = (financeFile) => {
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

FinanceHelper.createFinanceRecords = async (financeRecords) => {
    const createdRecords = [];
    if(!Array.isArray(financeRecords)){
        return createdRecords;
    }
    
    for(let fRec of financeRecords){
        const financeRecord = new Finance(null, fRec.concept, fRec.amount, fRec.date, fRec.type, fRec.categories, fRec.shop);
        if(financeRecord.hasValidProperties()){
            createdRecords.push(await Notion.createFinanceRecord(financeRecord));
        }else{
            createdRecords.push(financeRecord.properties)
        }
    }

    return createdRecords;
}

module.exports = FinanceHelper;