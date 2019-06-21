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
        


def fetch_user_id(username):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select id from users where name = :name'
	   result_set = connection.execute(text(query), name = username)
	   connection.close()
	   for r in result_set:
	   	return r[0]
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
	   result_set = connection.execute(text(query), name = species)
	   connection.close()
	   for r in result_set:
	   	return r[0]
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())




	