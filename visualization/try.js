const { Pool }= require('pg')
const format = require('pg-format');

const pool = new Pool({
  user: 'bety',
  database: 'bety',
  password: '',
  host: 'localhost',
  port: 9000,
});

let tel = async ()=> {
  try{
    var myNestedArray = [['a', '','',2588]]; 
    const client = await pool.connect()
sql = format('INSERT INTO cultivars (name,ecotype,notes,specie_id) VALUES %L', myNestedArray); 
await client.query('BEGIN')
let res=await client.query(sql)
let r= await client.query('SELECT * FROM cultivars')
await client.query('ROLLBACK')
console.log(res.rows)
console.log(r.rows)
  }
  catch(e){
    console.log(e)
  }
}

tel()