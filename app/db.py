import psycopg2
import csv
from sqlalchemy.sql import text
from setup import setup_environment

def insert_table(table,data):
	#Make PostgreSQL Connection
	engine = setup_environment.get_database()
	data.to_sql(table, engine, if_exists = 'append', index=False)

def insert_sites_table(table,data):
	#Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	connection = engine.raw_connection()
	cur = connection.cursor()
	with open(data, 'r') as f:
		reader = csv.reader(f)
		next(reader) # Skip the header row.
		for row in reader:
			#cur.execute("INSERT INTO sites (sitename,city,state,country,notes,greenhouse,geometry,time_zone,soil,soilnotes) VALUES (%s, %s, %s, %s,%s, %s, ST_Transform(ST_Geomfromtext(%s,32612),4326), %s,%s, %s)",row)
			cur.execute("INSERT INTO sites (sitename,city,state,country,notes,greenhouse,geometry,time_zone,soil,soilnotes) VALUES (%s, %s, %s, %s,%s, %s, ST_Geomfromtext(%s,4326), %s,%s, %s)",row)

			print(row)
			
		connection.commit()
     

def fetch_specie_id(species):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	connection = engine.connect()
	query = 'select id from species where scientificname = :name'
	result_set = connection.execute(text(query), name = species).fetchone()
	connection.close()
	for r in result_set:
		return r
	


def fetch_sites_id(sitename):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	connection = engine.connect()
	query = 'select id from sites where sitename = :name'
	result_set = connection.execute(text(query), name = sitename).fetchone()
	connection.close()
	for r in result_set:
		return r


def fetch_cultivars_id(name,specie_id):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	connection = engine.connect()
	query = 'select id from cultivars where name = :name and specie_id = :specie_id'
	result_set = connection.execute(text(query), name = name,specie_id=specie_id).fetchone()
	connection.close()
	for r in result_set:
		return r


def fetch_citations_id(author,year,title):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	connection = engine.connect()
	query = 'select id from citations where author = :author and year = :year and title = :title'
	result_set = connection.execute(text(query),author=author,year=year, title = title).fetchone()
	connection.close()
	for r in result_set:
		return r


#Fetching ID from Users,experiments,cultivars and treatments tables
def fetch_id(value,table):
    # Make PostgreSQL Connection
	connection = None
	engine = setup_environment.get_database()
	connection = engine.connect()
	query = 'select id from '+table+' where name = :name'
	result_set = connection.execute(text(query), name = value).fetchone()
	connection.close()
	for r in result_set:
		return r
	
