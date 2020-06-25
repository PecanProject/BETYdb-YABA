const express = require('express')
const app = express()
const port = 3001
const { getTable1, getTable2, getTable3 } = require('./pg_joins')
const multer=require('multer')
const Papa=require('papaparse')
const upload=multer()



app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

let upload1 = upload.fields(
  [{ name: 'cultivars', maxCount: 1 },
   { name: 'sites_cultivars', maxCount: 1 },
   { name: 'sites', maxCount: 1 }
  ]);

let upload2 = upload.fields(
  [{ name: 'experiments', maxCount: 1 },
   { name: 'experiments_sites', maxCount: 1 },
   { name: 'sites', maxCount: 1 }
  ]);

let upload3 = upload.fields(
  [{ name: 'experiments', maxCount: 1 },
   { name: 'treatments', maxCount: 1 },
   { name: 'experiments_treatments', maxCount: 1 },
   { name: 'experiments_sites', maxCount: 1 },
   { name: 'sites', maxCount: 1 }
  ]);

let shp_upload=upload.single('shp_file');
  
let parseCsv= (file)=>{
  let buf= Buffer.from(file.buffer)
  let txt= buf.toString();
  let res= Papa.parse(txt).data.slice(1).map((item,idx)=>{
    if (item.length> 1)
      return item;
    return null;
  } );
  if(res.includes(null))
    res.pop()
  return res
}

app.post('/getTable1',upload1 ,async (req, res) => {
  let cultivars= parseCsv(req.files['cultivars'][0])
  let sites_cultivars= parseCsv(req.files['sites_cultivars'][0])
  let sites= parseCsv(req.files['sites'][0])
  let val=[];
  let getval=(value)=>{ val.concat(value) }
  await getTable1(cultivars, sites_cultivars, sites).then((value)=> getval(value))
  console.log(val)
})

app.post('/getTable2', upload2,(req, res) => {
  let experiments= parseCsv(req.files['experiments'][0])
  let experiments_sites= parseCsv(req.files['experiments_sites'][0])
  let sites= parseCsv(req.files['sites'][0])
  let t2= getTable2(experiments, experiments_sites,sites)
  console.log(t2)
})

app.post('/getTable3', upload3,(req, res) => {
  let experiments= parseCsv(req.files['experiments'][0])
  let treatments= parseCsv(req.files['treatments'][0])
  let experiments_treatments= parseCsv(req.files['experiments_treatments'][0])
  let experiments_sites= parseCsv(req.files['experiments_sites'][0])
  let sites= parseCsv(req.files['sites'][0])
  let t3=getTable3(treatments, experiments_treatments, sites, experiments, experiments_sites)
  console.log(t3)
})

app.post('/getGeoJSON', shp_upload,(req, res) => {
  let geoJSON= shapeParser(req.files['shp_file'][0])
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})