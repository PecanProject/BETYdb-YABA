const parser = require('google-spreadsheets-key-parser');
const Papa=require('papaparse')

let arrayWithData=[];
async function parseToCsv(googleSheetLink){
    return await new Promise((resolve,reject)=>{
        const Tabletop= require('tabletop')
        let sheetID = parser(googleSheetLink)["key"];
         Tabletop.init({
            key: sheetID,
            callback:(data) => { resolve(showInfo(data)) },
            simpleSheet: true
        })    
    })
}

function showInfo (data) {
    arrayWithData.push(...data);
    return Papa.unparse(arrayWithData);
  }

export default parseToCsv;