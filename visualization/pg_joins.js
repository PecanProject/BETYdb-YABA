const { Pool }= require('pg')
const format = require('pg-format');

const pool = new Pool({
  user: 'bety',
  database: 'bety',
  password: '',
  host: 'postgres',
  port: 5432,
});

const fetch_Id= async (client, value,table)=>{
  try{
    const query=format('SELECT id FROM %I WHERE name = %L',table,value.toString())
    const res= (await client.query(query)).rows[0]["id"];
    return res
  }
  catch(e){
    console.log(e);
  }
}

const fetch_cultivarsId= async (client, name, specie_id)=>{
  try{
    const query=format('SELECT id FROM cultivars WHERE name = %L AND specie_id = %s',name, parseInt(specie_id))
    const res= (await client.query(query));
    return res.rows[0]["id"]
  }
  catch(e){
    console.log(e);
  }
}

const fetch_sitesId= async (client, sitename)=>{
  try{
    const query=format('SELECT id FROM sites where sitename = %L',sitename)
    const res= (await client.query(query));
    return res.rows[0]["id"]
  }
  catch(e){
    console.log(e);
  }
}

const fetch_specieId= async (client, specie)=>{
  try{
    const res= (await client.query('SELECT id FROM species WHERE scientificname = $1', [specie]));
    return res.rows[0]["id"]
  }
  catch(e){
    console.log(e);
  }
}

const getGeometry= async (client, geometry)=>{
  try{
    geometry.coordinates[0].map((data)=>{
      if(data.length<3)
        data.push(115);
      return data
    })
    const res= (await client.query('SELECT ST_Geomfromtext(ST_AsText(ST_GeomFromGeoJSON($1)),4326) As wkt', [geometry]));
    return res.rows[0]["wkt"]
  }
  catch(e){
    console.log(e);
  }
}
/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getCultivarSites=async (cultivars, sites_cultivars, sites, geoJSON) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let t1= ((await client.query("SELECT (UTC_NOW() - interval '1 second') as utc_now")).rows[0]["utc_now"]);
    let dat= cultivars.map(async data =>{ 
        let specie=data.pop();
        let specie_id = await fetch_specieId(client,specie)
        data.push(parseInt(specie_id))
        return data
      })
    
    let result=  Promise.all(dat).then(async (data)=>{ 
                const query1 = format('INSERT INTO cultivars(name,ecotype,notes,specie_id) VALUES %L',data)
                await client.query(query1)
              })
              .then(async()=> {
                  let geodata= await geoJSON.map(async (feature)=>{
                  let geom= await getGeometry(client, feature.geometry)
                  return geom
                })
                return Promise.all(geodata)
              })
              .then(async(geodata)=>{
                sites= sites.map((site,i)=>{
                    site.pop()
                    site.pop()
                    site.pop()
                    site.push(" ")
                    site.push(geodata[i])
                    return site
                })
                return sites
              })
              .then(async(sites)=>{
                  const query3 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes,geometry) VALUES %L',sites)
                  await client.query(query3)
                    let sites_data=sites_cultivars.map(async data =>{
                    let cultivar_name= data.shift();
                    let specie_id= data.shift();
                    let sitename= data.shift();
                    let cultivar_id= await fetch_cultivarsId(client, cultivar_name, specie_id);
                    let site_id= await fetch_sitesId(client,sitename);
                  return [site_id, cultivar_id]
                  })
                  return Promise.all(sites_data)
                })
                .then(async (sites_data)=>{
                      const query2 = format('INSERT INTO sites_cultivars(site_id,cultivar_id) VALUES %L',sites_data)
                      await client.query(query2)
                  })
                  .then(async()=>{
                    let join=format("SELECT name as cultivars, sitename as plot, ST_AsGeoJSON(geometry) as polygon FROM cultivars JOIN sites_cultivars ON cultivars.id = sites_cultivars.cultivar_id AND cultivars.created_at >= timestamptz %L JOIN sites ON sites_cultivars.site_id = sites.id", t1)
                    res=await client.query(join);
                    return Promise.all(res.rows)
                  })              
                  .then(async(result)=>{      
                    await client.query('ROLLBACK')
                    client.release();    
                    return result
                  })
                  .catch((e)=> Promise.reject(new Error(e)))
      return result;
  }
  catch(e){
    return new Error(e.name + " " + e.message);
  }
}

/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getExperimentSites=async (username, experiments, experiments_sites, sites, geoJSON) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let t1= ((await client.query("SELECT (UTC_NOW() - interval '1 second') as utc_now")).rows[0]["utc_now"]);
    let user_id= await fetch_Id(client,username,"users")
    let result= Promise.resolve(user_id).then(async(user_id)=>{
                experiments= experiments.map((exp)=>{
                  exp.push(parseInt(user_id))
                  return exp;
                })
                const query1 = format('INSERT INTO experiments(name,start_date,end_date,description,user_id) VALUES %L',experiments)
                await client.query(query1);
              })
                .then(async()=> {
                    let geodata= await geoJSON.map(async (feature)=>{
                    let geom= await getGeometry(client, feature.geometry)
                    return geom
                  })
                  return Promise.all(geodata)
                })
                .then(async(geodata)=>{
                  sites= sites.map((site,i)=>{
                      site.pop()
                      site.pop()
                      site.pop()
                      site.push(" ")
                      site.push(geodata[i])
                      return site
                  })
                  return sites
                })
                .then(async(sites)=>{
                    const query2 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes,geometry) VALUES %L',sites)
                    await client.query(query2)
              })
                .then(async()=>{
                  experiments_sites=  experiments_sites.map(async data =>{
                  let experiment_name= data.shift();
                  let sitename= data.shift();
                  let experiment_id= await fetch_Id(client, experiment_name, "experiments");
                  let site_id= await fetch_sitesId(client, sitename);
                  return [ experiment_id, site_id ]
                })
                return Promise.all(experiments_sites);
              })
                .then(async(exp_sites)=>{
                const query3 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',exp_sites)
                await client.query(query3);
              })
                .then(async()=>{
                let join=format("SELECT name as experiments, sitename as plot, ST_AsGeoJSON(geometry) as polygon FROM experiments JOIN experiments_sites ON experiments.id = experiments_sites.experiment_id AND experiments.created_at >= timestamptz %L JOIN sites ON experiments_sites.site_id = sites.id", t1)
                let res= await client.query(join);
                return Promise.all(res.rows)
              })       
                .then(async(result)=>{      
                await client.query('ROLLBACK')
                client.release();         
                return result
              })
              .catch((e)=> Promise.reject(new Error(e)))
      return result;
    
  }
  catch(e){
    return new Error(e.name + " " + e.message);
  }
}

/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getTreatmentSites=async (username, treatments, experiments_treatments, sites, experiments, experiments_sites, geoJSON) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let t1= ((await client.query("SELECT (UTC_NOW() - interval '1 second') as utc_now")).rows[0]["utc_now"]);
    let user_id= await fetch_Id(client,username,"users")
    let result= Promise.resolve(user_id).then(async(user_id)=>{
                  treatments= treatments.map((treatment)=>{
                    treatment.push(parseInt(user_id))
                    return treatment;
                  })
                  experiments= experiments.map((exp)=>{
                    exp.push(parseInt(user_id))
                    return exp;
                  })
                  const query1 = format('INSERT INTO treatments(name,definition,control,user_id) VALUES %L',treatments)
                  const query2 = format('INSERT INTO experiments(name,start_date,end_date,description,user_id) VALUES %L',experiments)
                  await client.query(query1);
                  await client.query(query2);
                })
                  .then(async()=>{
                    experiments_treatments=experiments_treatments.map(async data =>{
                    let experiment_name= data.shift();
                    let treatment_name= data.shift();
                    let experiment_id= await fetch_Id(client, experiment_name, "experiments");
                    let treatment_id= await fetch_Id(client, treatment_name, "treatments");
                    return [ experiment_id, treatment_id ]
                  })
                  return Promise.all(experiments_treatments);
                })
                  .then(async (exp_treatments)=>{
                  const query3 = format('INSERT INTO experiments_treatments(experiment_id,treatment_id) VALUES %L',exp_treatments)
                  await client.query(query3);  
                })
                  .then(async()=> {
                    let geodata= await geoJSON.map(async (feature)=>{
                    let geom= await getGeometry(client, feature.geometry)
                    return geom
                  })
                  return Promise.all(geodata)
                })
                .then(async(geodata)=>{
                  sites= sites.map((site,i)=>{
                      site.pop()
                      site.pop()
                      site.pop()
                      site.push(" ")
                      site.push(geodata[i])
                      return site
                  })
                  return sites
                })
                  .then(async(sites)=>{
                    const query4 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes,geometry) VALUES %L',sites)
                    await client.query(query4)
                })
                  .then(async()=>{
                    experiments_sites=  experiments_sites.map(async data =>{
                    let experiment_name= data.shift();
                    let sitename= data.shift();
                    let experiment_id= await fetch_Id(client, experiment_name, "experiments");
                    let site_id= await fetch_sitesId(client, sitename);
                    return [ experiment_id, site_id ]
                  })
                  return Promise.all(experiments_sites);
                })
                  .then(async(exp_sites)=>{
                  const query5 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',exp_sites)
                  await client.query(query5);
                })
                  .then(async()=>{
                  let join=format("SELECT treatments.name as treatments, sitename as plot, ST_AsGeoJSON(geometry) as polygon FROM treatments JOIN experiments_treatments ON treatments.id = experiments_treatments.treatment_id AND treatments.created_at >= timestamptz %L JOIN experiments ON experiments_treatments.id = experiments.id JOIN experiments_sites ON experiments_sites.id = experiments.id JOIN sites ON experiments_sites.id = sites.id", t1)
                  let res= await client.query(join);
                  return Promise.all(res.rows)
                })              
                  .then(async(result)=>{      
                  await client.query('ROLLBACK')
                  client.release();       
                  return result
                  }).catch(e=> Promise.reject(new Error(e)))
      return result;
  }
  catch(e){
    return new Error(e.name + " " + e.message);
  }
}

const getUser= async (apikey)=>{
  try{
    const client = await pool.connect()
    const query=format('SELECT name as user FROM users WHERE apikey = %L', apikey)
    const res= (await client.query(query)).rows[0]["user"];
    return res
  }
  catch(e){
    return new Error(e.name + " " + e.message);
  }
}

const getGeoData= async (geoJSON)=>{
  try{
      const client = await pool.connect()
      let geodata= await geoJSON.features.map(async (feature)=>{
        let geom= await getGeometry(client, feature.geometry)
        let geometry= (await client.query('SELECT ST_AsGeoJSON($1) As geometry', [geom])).rows[0]["geometry"];
        feature.geometry= JSON.parse(geometry)
        return feature
      })
    return Promise.all(geodata)
  }
  catch(e){
    return new Error(e.name + " " + e.message);
  }
}

module.exports={
  getCultivarSites, getExperimentSites, getTreatmentSites, getGeoData, getUser
}