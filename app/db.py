import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from setup import setup_environment
import traceback
import logging
from sqlalchemy.exc import SQLAlchemyError



def insert_table(table,data):
	#Make PostgreSQL Connection
	engine = setup_environment.get_database()
	try:
		data.to_sql(table, engine, if_exists = 'append', index=False)
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())
      

def fetch_specie_id(species):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from species where scientificname = :name'
	   result_set = connection.execute(text(query), name = species).fetchone()
	   connection.close()
	   for r in result_set:
	   	return r
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())


def fetch_sites_id(sitename):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from sites where sitename = :name'
	   result_set = connection.execute(text(query), name = sitename).fetchone()
	   connection.close()
	   for r in result_set:
	   	return r
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())


def fetch_cultivars_id(name,specie_id):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from cultivars where name = :name and specie_id = :specie_id'
	   result_set = connection.execute(text(query), name = name,specie_id=specie_id).fetchone()
	   connection.close()
	   for r in result_set:
	   	return r
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())


def fetch_citations_id(author,year,title):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from citations where author = :author and year = :year and title = :title'
	   result_set = connection.execute(text(query),author=author,year=year, title = title).fetchone()
	   connection.close()
	   for r in result_set:
	   	return r
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())


#Fetching Users,experiments,cultivars and treatments tables
def fetch_id(value,table):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from '+table+' where name = :name'
	   result_set = connection.execute(text(query), name = value).fetchone()
	   connection.close()
	   for r in result_set:
	   	return r
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())
