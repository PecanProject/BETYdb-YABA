import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from setup import setup_environment
import traceback
import logging
from sqlalchemy.exc import SQLAlchemyError



def insert_table(table,data):
	# Make PostgreSQL Connection
	engine = setup_environment.get_database()
	try:
		data.to_sql(table, engine, if_exists = 'append', index=False)
		#print(engine.execute("SELECT * FROM experiments").fetchall())
	except Exception as e:
	    # Logs the error appropriately
		logging.error(traceback.format_exc())
        


def fetch_specie_id(specie_id):
    # Make PostgreSQL Connection
	engine = setup_environment.get_database()
	connection = None
	try:
	   connection = engine.connect()
	   query = 'select * from species where specie_id == :id'
	   result_set = connection.execute(text(query), id = specie_id)

	   for r in result_set:
	   	print(r)
	except:
		pass




	