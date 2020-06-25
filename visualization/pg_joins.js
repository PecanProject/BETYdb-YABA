const { Pool, types }= require('pg')
const format = require('pg-format');

const pool = new Pool({
  user: 'bety',
  database: 'bety',
  password: '',
  host: 'localhost',
  port: 9000,
});

const fetch_Id= async (client, value,table)=>{
  try{
    const query=format('SELECT id FROM %L WHERE name = %s',table,value)
    const res= (await client.query(query)).rows[0]["id"];
    return res
  }
  catch(e){
    console.log(e);
  }
}

const fetch_cultivarsId= async (client, name, specie_id)=>{
  try{
    console.log(name, specie_id)
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
    console.log(sitename)
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


const getTable1=async (cultivars, sites_cultivars, sites) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let dat= cultivars.map(async data =>{ 
        let specie=data.pop();
        let specie_id = await fetch_specieId(client,specie)
        data.push(parseInt(specie_id))
        return data
      })
    let t1= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    let res=  Promise.all(dat).then(async (data)=>{ 
                const query1 = format('INSERT INTO cultivars(name,ecotype,notes,specie_id) VALUES %L',data)
                await client.query(query1)
              }).catch((e)=> console.log(e))
              .then(async()=>{
                  sites.map((site)=>{
                  site.pop()
                  site.pop()
                  site.pop()
                  site.push("some text")
                })
                const query3 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes) VALUES %L',sites)
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
                    let join=format("SELECT name as cultivar, sitename as plot FROM cultivars JOIN sites_cultivars ON cultivars.id = sites_cultivars.cultivar_id AND cultivars.created_at >= timestamptz %L JOIN sites ON sites_cultivars.site_id = sites.id",t1)
                    res=await client.query(join);                    
                    await client.query('ROLLBACK')
                    client.release();                          
                    return res.rows 
                  })
                  .catch((e)=> console.log(e))
                  return res
  }
  catch(e){
    console.log(e)
  }
}

const getTable2=async (experiments, experiments_sites, sites) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    const query1 = format('INSERT INTO experiments(name,start_date,end_date,description) VALUES %L',experiments)
    let t1= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    await client.query(query1);
    let t2= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    
    experiments_sites=experiments_sites.map(async data =>{
      let experiment_name= data.shift();
      let sitename= data.shift();
      let experiment_id= await fetch_Id(experiment_name);
      let site_id= await fetch_sitesId(sitename);
      return [ experiment_id, site_id ]
    })
    const query2 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',experiments_sites)
    await client.query(query2);
    
    sites.pop();
    sites.pop();
    sites.push("some text")
    const query3 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes) VALUES %L',sites)
    await client.query(query3);
    
    let join="SELECT name as experiments, sitename as plot FROM experiments JOIN experiments_sites ON experiments.id = experiments_sites.experiment_id AND experiments.created_at BETWEEN %s AND %s JOIN sites ON experiments_sites.site_id = sites.id"
    let res= await client.query(join,[t1],[t2]);
    await client.query('ROLLBACK')
    client.release();
    return res
  }
  catch(e){
    console.log(e)
  }
}

const getTable3=async (treatments, experiments_treatments, sites, experiments, experiments_sites) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    const query1 = format('INSERT INTO treatments(name,definition,control) VALUES %L',treatments)
    let t1= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    await client.query(query1);
    let t2= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);

    experiments_treatments=experiments_treatments.map(async data =>{
      let experiment_name= data.shift();
      let treatment_name= data.shift();
      let experiment_id= await fetch_Id(experiment_name);
      let treatment_id= await fetch_sitesId(treatment_name);
      return [ experiment_id, treatment_id ]
    })
    const query2 = format('INSERT INTO experiments_treatments(experiment_id,treatment_id) VALUES %L',experiments_treatments)
    await client.query(query2);

    sites.pop();
    sites.push("some text")
    const query3 = format('INSERT INTO sites(sitename,city,state,country,notes,greenhouse,geometry,time_zone,soil,soilnotes) VALUES %L',sites)
    await client.query(query3);

    const query4 = format('INSERT INTO experiments(name,start_date,end_date,description) VALUES %L',experiments)
    await client.query(query4);
    
    experiments_sites=experiments_sites.map(async data =>{
      let experiment_name= data.shift();
      let sitename= data.shift();
      let experiment_id= await fetch_Id(experiment_name);
      let site_id= await fetch_sitesId(sitename);
      return [ experiment_id, site_id ]
    })
    const query5 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',experiments_sites)
    await client.query(query5);
    
    let join="SELECT name as treatments, sitename as plot FROM treatments JOIN experiments_treatments ON treatments.id = experiments_treatments.treatment_id AND treatments.created_at BETWEEN %s AND %s JOIN experiments ON experiments_treatments.id = experiments.id JOIN experiments_sites.id = experiments.id JOIN sites ON experiments_sites.id = sites.id"
    let res=await client.query(join,[t1],[t2]);
    await client.query('ROLLBACK')
    client.release();
    return res
  }
  catch(e){
    console.log(e)
  }
}

module.exports={
  getTable1, getTable2, getTable3
}