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

/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getCultivarSites=async (cultivars, sites_cultivars, sites) => {
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
                  site.push(" ")
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
                    let join=format("SELECT name as cultivars, sitename as plot FROM cultivars JOIN sites_cultivars ON cultivars.id = sites_cultivars.cultivar_id AND cultivars.created_at >= timestamptz %L JOIN sites ON sites_cultivars.site_id = sites.id",t1)
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

/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getExperimentSites=async (username, experiments, experiments_sites, sites) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let user_id= await fetch_Id(client,username,"users")
    let t1= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    let res= Promise.resolve(user_id).then(async(user_id)=>{
              experiments= experiments.map((exp)=>{
                exp.push(parseInt(user_id))
                return exp;
              })
              const query1 = format('INSERT INTO experiments(name,start_date,end_date,description,user_id) VALUES %L',experiments)
              await client.query(query1);
              let t2= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
            }).then(async()=>{
              sites.map((site)=>{
                site.pop()
                site.pop()
                site.pop()
                site.push(" ")
              })
              const query3 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes) VALUES %L',sites)
              await client.query(query3)
            }).then(async()=>{
              experiments_sites=  experiments_sites.map(async data =>{
                let experiment_name= data.shift();
                let sitename= data.shift();
                let experiment_id= await fetch_Id(client, experiment_name, "experiments");
                let site_id= await fetch_sitesId(client, sitename);
                return [ experiment_id, site_id ]
              })
              return Promise.all(experiments_sites);
            }).then(async(exp_sites)=>{
              const query2 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',exp_sites)
              await client.query(query2);
            }).then(async()=>{
              let join=format("SELECT name as experiments, sitename as plot FROM experiments JOIN experiments_sites ON experiments.id = experiments_sites.experiment_id AND experiments.created_at >= timestamptz %L JOIN sites ON experiments_sites.site_id = sites.id",t1)
              let res= await client.query(join);
              await client.query('ROLLBACK')
              client.release();
              return res.rows
            })
            .catch((e)=> console.log(e))
            return res;
    
  }
  catch(e){
    console.log(e)
  }
}

/*We just need the data after performing joins on some tables, for only visualization purposes not insertion,
 therefore a ROLLBACK is performed at end of this function*/

const getTreatmentSites=async (username, treatments, experiments_treatments, sites, experiments, experiments_sites) => {
  const client = await pool.connect()
  try{
    await client.query('BEGIN')
    let t1= ((await client.query("SELECT UTC_NOW()")).rows[0]["utc_now"]);
    let user_id= await fetch_Id(client,username,"users")
    let res= Promise.resolve(user_id).then(async(user_id)=>{
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
    }).then(async()=>{
        experiments_treatments=experiments_treatments.map(async data =>{
        let experiment_name= data.shift();
        let treatment_name= data.shift();
        let experiment_id= await fetch_Id(client, experiment_name, "experiments");
        let treatment_id= await fetch_Id(client, treatment_name, "treatments");
        return [ experiment_id, treatment_id ]
      })
      return Promise.all(experiments_treatments);
    }).then(async (exp_treatments)=>{
      const query3 = format('INSERT INTO experiments_treatments(experiment_id,treatment_id) VALUES %L',exp_treatments)
      await client.query(query3);  
    }).then(async()=>{
      sites.map((site)=>{
        site.pop()
        site.pop()
        site.pop()
        site.push(" ")
      })
      const query4 = format('INSERT INTO sites(sitename,city,state,country,notes,time_zone,soil,soilnotes) VALUES %L',sites)
      await client.query(query4)
    }).then(async()=>{
      experiments_sites=  experiments_sites.map(async data =>{
        let experiment_name= data.shift();
        let sitename= data.shift();
        let experiment_id= await fetch_Id(client, experiment_name, "experiments");
        let site_id= await fetch_sitesId(client, sitename);
        return [ experiment_id, site_id ]
      })
      return Promise.all(experiments_sites);
    }).then(async(exp_sites)=>{
      const query5 = format('INSERT INTO experiments_sites(experiment_id,site_id) VALUES %L',exp_sites)
      await client.query(query5);
    }).then(async()=>{
      let join=format("SELECT treatments.name as treatments, sitename as plot FROM treatments JOIN experiments_treatments ON treatments.id = experiments_treatments.treatment_id AND treatments.created_at >= timestamptz %L JOIN experiments ON experiments_treatments.id = experiments.id JOIN experiments_sites ON experiments_sites.id = experiments.id JOIN sites ON experiments_sites.id = sites.id",t1)
      let res= await client.query(join);
      await client.query('ROLLBACK')
      client.release();
      return res.rows
    }).catch(err=>{
      console.log(err);
    })
    return res;
  }
  catch(e){
    console.log(e)
  }
}

module.exports={
  getCultivarSites, getExperimentSites, getTreatmentSites
}