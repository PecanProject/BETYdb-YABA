const express = require('express')
const app = express()
const port = 8080
const { getCultivarSites, getExperimentSites, getTreatmentSites, getGeoData, getUser } = require('./pg_joins')
const { shapeParser }= require('./shape-parser')
const multer=require('multer')
const Papa=require('papaparse')
const upload=multer()
const decompress = require('decompress')
const path= require('path')

app.use(express.static('dist'))
app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

let upload1 = upload.fields(
  [{ name: 'cultivars', maxCount: 1 },
   { name: 'sites_cultivars', maxCount: 1 },
   { name: 'sites', maxCount: 1 },
   { name: 'shp_file', maxCount: 1 }
  ]);

let upload2 = upload.fields(
  [{ name: 'experiments', maxCount: 1 },
   { name: 'experiments_sites', maxCount: 1 },
   { name: 'sites', maxCount: 1 },
   { name: 'shp_file', maxCount: 1 }
  ]);

let upload3 = upload.fields(
  [{ name: 'experiments', maxCount: 1 },
   { name: 'treatments', maxCount: 1 },
   { name: 'experiments_treatments', maxCount: 1 },
   { name: 'experiments_sites', maxCount: 1 },
   { name: 'sites', maxCount: 1 },
   { name: 'shp_file', maxCount: 1 }
  ]);

let shp_upload= upload.fields(
  [{ name: 'shp_file', maxCount: 1 }]);

let api_key= upload.fields(
  [{ name: 'api_key', maxCount: 1 }]);
  
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

//sends plots for cultivars
app.post('/getCultivarSites',upload1 ,async (req, res) => {
  let cultivars= parseCsv(req.files['cultivars'][0])
  let sites_cultivars= parseCsv(req.files['sites_cultivars'][0])
  let sites= parseCsv(req.files['sites'][0])
  let val=[];
  let file= Buffer.from(req.files['shp_file'][0].buffer);
  let geoJSON= await shapeParser(file);
  let getval=(value)=>{ 
    val.push(value.map((data)=>{
      data.polygon= JSON.parse(data.polygon);
      return data;
    })) 
  }
  try{
  await getCultivarSites(cultivars, sites_cultivars, sites, geoJSON.features).then((value)=> getval(value))
  console.log(val)
  res.status(200).send(val[0]);
  }
  catch(err){
    res.status(400).send({"error": err.message});
  }
})

//sends plots for experiments
app.post('/getExperimentSites', upload2, async (req, res) => {
  let experiments= parseCsv(req.files['experiments'][0])
  let experiments_sites= parseCsv(req.files['experiments_sites'][0])
  let sites= parseCsv(req.files['sites'][0])
  let file= Buffer.from(req.files['shp_file'][0].buffer);
  let geoJSON= await shapeParser(file);
  let username= req.body.username;
  let val=[]
  let getval=(value)=>{ 
    val.push(value.map((data)=>{
      data.polygon= JSON.parse(data.polygon);
      return data;
    }))
  } 
  try{
    await getExperimentSites(username, experiments, experiments_sites, sites, geoJSON.features).then(value=> getval(value))
    console.log(val)
    res.status(200).send(val[0]);
    }
    catch(err){
      console.log(err)
      res.status(400).send({"error": err.message});
    }
})

//sends plots for treatments
app.post('/getTreatmentSites', upload3, async(req, res) => {
  let experiments= parseCsv(req.files['experiments'][0])
  let treatments= parseCsv(req.files['treatments'][0])
  let experiments_treatments= parseCsv(req.files['experiments_treatments'][0])
  let experiments_sites= parseCsv(req.files['experiments_sites'][0])
  let sites= parseCsv(req.files['sites'][0])
  let file= Buffer.from(req.files['shp_file'][0].buffer);
  let geoJSON= await shapeParser(file);
  let username= req.body.username;
  let val=[]
  let getval=(value)=>{ 
    val.push(value.map((data)=>{
      data.polygon= JSON.parse(data.polygon);
      return data;
    })) 
  }
  try{
    await getTreatmentSites(username, treatments, experiments_treatments, sites, experiments, experiments_sites, geoJSON.features).then(value=> getval(value))
    console.log(val)
    res.status(200).send(val[0]);
    }
    catch(err){
      console.log(err)
      res.status(400).send({"error": err.message});
    }
})

//sends the Username for the valid api key
app.post('/getUser', api_key, async(req, res) => {
  let apikey= req.body.apikey;
  try{
    let user= await getUser(apikey);
    res.status(200).send({"user":user});
  }
  catch(err){
    console.log(err)
    res.status(400).send({"error": err.message});
  }
})

//sends the GeoJSON data after parsing the shapefile 
app.post('/getGeoJSON', shp_upload, async(req, res) => {
  let file= Buffer.from(req.files['shp_file'][0].buffer);
  let geoJSON= await shapeParser(file)
  let geoData={"type":"FeatureCollection"}
  try{
    geoData.features= await getGeoData(geoJSON);
    console.log(geoData)
    res.status(200).send(geoData);
  }
  catch(err){
    console.log(err)
    res.status(400).send({"error": err.message});
  }
})

//extracts the shapefile zip and sends each file separately
app.post('/getGeoFile', shp_upload, async(req, res) => {
  try{
    let file= Buffer.from(req.files['shp_file'][0].buffer);
    let type= req.body.type;
    const name= `${type}_file.${type}`
    decompress(file, 'dist', {
      filter: file => path.extname(file.path) == `.${type}`,
      map: file => {
        file.path = `${name}`;
        return file;
    }
    }).then(files => {
      console.log(files)
  });
    res.status(200).sendFile(__dirname+`/dist/${name}`);
  }
  catch(err){
    console.log(err)
    res.status(400).send("File not acceptable.Check its format");
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})