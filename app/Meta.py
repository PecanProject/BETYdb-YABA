"""
This is the Meta module and supports all the REST actions for the yaba.yaml
"""

# Importing modules
import os

from flask import make_response, abort,Response
import pandas as pd
import json
from db import *
import geopandas as gpd
from werkzeug import secure_filename, FileStorage
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import OperationalError
import traceback
import logging
from shapely import geos, wkb, wkt
from shapely.geometry.multipolygon import MultiPolygon



UPLOAD_FOLDER = 'temp'



def save_tempFile(File):
    # Validate that what we have been supplied with is infact a FileStorage
    if not isinstance(File, FileStorage):
        raise TypeError("storage must be a werkzeug.FileStorage")

    # Sanitise the filename
    a_file_name = secure_filename(File.filename)

    # Build target
    a_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,a_file_name)
    # Save file 
    File.save(a_file_target)
    return None

def insert_experiments(username,fileName):
    """
    This function responds to a request for /yaba/v1/experiments with csv file.
    It first checks the file is appropriate one and then add new column user_id to dataframe.
    Insertion is done to "experiments" table. 


    :fileName:      CSV file with experiments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    
    try:
        user_id=fetch_id(username,table='users')

        if user_id =='':
            return 403
        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','start_date','end_date','description','design']
     
        if(all(x in accepted_columns for x in columns)):
            data['user_id']=user_id
            data['design'].fillna('some text', inplace=True)
            insert_table(table='experiments',data=data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
                
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410     
     
def insert_sites(fileName,shp_file,dbf_file,prj_file,shx_file):
    """
    This function responds to a request for  /yaba/v1/sites with csv and shape files.Checks
    file is appropriate one.Takes all the shape file.Extracts geometry from Geopandas dataframe
    and then added to Pandas dataframe.Insertion is done to "sites" table


    :shp_file:      .shp file
    :dbf_file:      .dbf file
    :prj_file:      .prj file
    :shx_file:      .shx file
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:
        save_tempFile(shp_file)
        save_tempFile(dbf_file)
        save_tempFile(prj_file)
        save_tempFile(shx_file)

        #Getting the shp file from temp folder
        shp_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,shp_file.filename)
    
        #Reading the shapefile as DataFrame
        data_g=gpd.read_file(shp_file_target)
    
        #Reading the csv as Dataframe
        data = pd.read_csv(fileName,delimiter = ',')
        
        data['geometry'] = data.geometry.astype(str)
        
        geos.WKBWriter.defaults['include_srid'] = True



        for i in range(data.shape[1]):
            p=MultiPolygon([data_g.iat[i,10]])
            geos.lgeos.GEOSSetSRID(p._geom, 4326)
            data.iat[i,6]=p.wkb_hex

        #data['geometry']=data_g['geometry'].wkb_hex
        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['sitename','city','state','country','notes','greenhouse','geometry','time_zone','soil','soilnotes']
        
        if(all(x in accepted_columns for x in columns)):
            
            data['notes']=data_g['notes']
            data['soil']='some text'
            data['soilnotes']='some text'

            #Inserting in Bety
            insert_table(table='sites',data=data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400        

    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410     

def insert_treatments(username,fileName):
    """
    This function responds to a request for  /yaba/v1/treatments
    with csv file.Insertion is done to "treatments" table.

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:
        user_id=fetch_id(username,table='users')

        if user_id =='':
            return 403

        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','definition','control']
     
        if(all(x in accepted_columns for x in columns)):
            data['user_id']=user_id
            insert_table(table='treatments',data=data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
            
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410

def insert_cultivars(fileName):
    """
    This function responds to a request for /yaba/v1/cultivars
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    

    try:
        data = pd.read_csv(fileName,delimiter = ',')

        specie_id=fetch_specie_id(data['species'][0])

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','species','ecotype','notes']
     
        if(all(x in accepted_columns for x in columns)):
            new_data = pd.DataFrame(columns=['name', 'specie_id','name','ecotype','notes'])

            new_data['name']=data['name']
            new_data['specie_id']=specie_id
            new_data['name']='some text'
            new_data['ecotype']='some text'
            new_data['notes']='some text'

            insert_table(table='cultivars',data=new_data)

            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410   
   

def insert_citations(username,fileName):
    """
    This function responds to a request for  /yaba/v1/citations
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:    
        user_id=fetch_id(username,table='users')

        if user_id =='':
            return 403
        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['author','year','title','journal','vol','pg','url','pdf','doi']
     
        if(all(x in accepted_columns for x in columns)):
            #Reading the CSV file into DataFrame
            data = pd.read_csv(fileName,delimiter = ',')
            data['user_id']=user_id
            insert_table(table='citations',data=data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410                   
        

def insert_experimentSites(fileName):
    """
    This function responds to a request for /yaba/v1/experiments_sites
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:       201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:
        data = pd.read_csv(fileName,delimiter = ',')
        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['experiment_name','sitename']
     
        if(all(x in accepted_columns for x in columns)):
            new_data = pd.DataFrame(columns=['experiment_id', 'site_id'])

            new_data['experiment_id'] = [fetch_id(x,table='experiments') for x in data['experiment_name']]

            new_data['site_id'] = [fetch_sites_id(x) for x in data['sitename']]

            insert_table(table='experiments_sites',data=new_data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201

        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410

def insert_experimentTreatments(fileName):
    """
    This function responds to a request for /yaba/v1/experiments_treatments
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:
    
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['experiment_name','treatment_name']    

        if(all(x in accepted_columns for x in columns)):
            new_data = pd.DataFrame(columns=['experiment_id', 'treatment_id'])

            new_data['experiment_id'] = [fetch_id(x,table='experiments') for x in data['experiment_name']]

            new_data['treatment_id'] = [fetch_id(x,table='treatments') for x in data['treatment_name']]
            insert_table(table='experiments_treatments',data=new_data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201

        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410

def insert_sitesCultivars(fileName):
    """
    This function responds to a request for /yaba/v1/sites_cultivars
    with csv file


    :fileName:      CSV file with sites_cultivars meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    try:
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['sitename','cultivar_name','specie_id']    

        if(all(x in accepted_columns for x in columns)):
            new_data = pd.DataFrame(columns=['site_id', 'cultivar_id'])
            new_data['site_id'] = [fetch_sites_id(x) for x in data['sitename']]
            new_data['cultivar_id'] = [fetch_cultivars_id(x[0],x[1]) for x in data[['cultivar_name','specie_id']].values]

            insert_table(table='sites_cultivars',data=new_data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201

        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410
    

def insert_citationsSites(fileName):
    """
    This function responds to a request for /yaba/v1/citations_sites
    with csv file


    :fileName:      CSV file with citations_sites meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    401 Intregrity or Constraint error
                    402 Database Connection Error
                    403 No user exists
                    410 Default error.See logs for more information
    """
    
    try:
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['sitename','cultivar_name']    

        if(all(x in accepted_columns for x in columns)):
            new_data = pd.DataFrame(columns=['citation_id','author','year','title'])

            new_data['site_id'] = [fetch_sites_id(x) for x in data['sitename']]

            new_data['citation_id'] = [fetch_citations_id(x[0],x[1],x[2]) for x in data[['author','year','title']].values]

            insert_table(table='citations_sites',data=new_data)
            return Response(json.dumps("Successfully inserted"), mimetype='application/json'), 201
        else:
            return Response(json.dumps("File not acceptable"), mimetype='application/json'), 400
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 402
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        return 401
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        pass
        return 410
    







