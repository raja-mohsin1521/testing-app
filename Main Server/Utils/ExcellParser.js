const XLSX = require('xlsx');

function parseExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const sheet = workbook.Sheets[sheet_name_list[0]]; 
  const data = XLSX.utils.sheet_to_json(sheet);
  return data;
}

module.exports = parseExcel;
