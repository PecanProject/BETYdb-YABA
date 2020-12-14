const Papa=require('papaparse')

async function parseToCsv(googleSheetLink){
    return await new Promise((resolve,reject)=>{
        googleSheetLink= 'https://cors-anywhere.herokuapp.com/' + googleSheetLink;
        Papa.parse(googleSheetLink, {
          download: true,
          header: true,
          complete: function(results) {
            let csvData= Papa.unparse(results.data)
            let csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
            resolve(csvBlob)
          },
          error: function(err){
              reject(err)
          }
        })
    })
}

export default parseToCsv;