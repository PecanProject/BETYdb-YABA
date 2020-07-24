const parser = require('google-spreadsheets-key-parser');

async function sheetToCsv(googleSheetLink){
    try{
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
    catch(e){
        throw Error(e)
    }
}

function showInfo (data) {
    return data;
  }

module.exports = { sheetToCsv };