"""
This is the Meta module and supports all the REST actions for the yaba.yaml
"""
# Importing modules
import os
import geopandas as gpd
import traceback
import logging
import pandas as pd
from flask import make_response,jsonify
from db import *
from werkzeug import secure_filename,FileStorage
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import OperationalError
from shapely.geometry import Polygon

logging.basicConfig(filename='app.log',format='%(asctime)s %(message)s',level=logging.INFO)

UPLOAD_FOLDER = 'temp'


def save_tempFile(File):
    # Validate that what we have been supplied with is infact a FileStorage
    if not isinstance(File, FileStorage):
        raise TypeError("Storage must be a werkzeug.FileStorage")

    # Sanitise the filename
    a_file_name = secure_filename(File.filename)

    UPLOAD_PATH=os.path.join(os.getcwd(),UPLOAD_FOLDER,a_file_name)
    # Save file 
    File.save(UPLOAD_PATH)
    return None

def insert_experiments(username,fileName,status=True):
    """
    This function responds to a request for /yaba/v1/experiments with csv file.
    It first checks the file is appropriate one and then add new column user_id to dataframe.
    Insertion is done to "experiments" table.

    :fileName:      CSV file with experiments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    
    try:
        user_id=fetch_id(username, table='users')

        if not user_id:
            return 401
        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','start_date','end_date','description']
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Experiments'}
                
                return make_response(jsonify(msg), 200)
                
            data['user_id']=user_id
            insert_table(table='experiments',data=data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Experiments',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns', 
                   'Table' : 'Experiments'}

            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "unique_name_per_species"'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)
     
def insert_sites(fileName,shp_file,dbf_file,prj_file,shx_file,status=True):
    """
    This function responds to a request for  /yaba/v1/sites with csv and shape files.Checks
    file is appropriate one.Takes all the shape file.Extracts geometry from Geopandas dataframe
    and then added to Pandas dataframe.Insertion is done to "sites" table


    :shp_file:      .shp file
    :dbf_file:      .dbf file
    :prj_file:      .prj file
    :shx_file:      .shx file
    :fileName:      CSV file with Sites meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:      
        #Reading the csv as Dataframe
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['sitename','city','state','country','notes','greenhouse','geometry','time_zone','soil','soilnotes']
        
        #Saving files temporarily.(Will be deleted later)
        save_tempFile(shp_file)
        save_tempFile(dbf_file)
        save_tempFile(prj_file)
        save_tempFile(shx_file)

        #Getting the files path from temp folder
        shp_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,shp_file.filename)
        dbf_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,dbf_file.filename)
        prj_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,prj_file.filename)
        shx_file_target = os.path.join(os.getcwd(),UPLOAD_FOLDER,shx_file.filename)


        #Reading the shapefile as DataFrame
        data_g1=gpd.read_file(shp_file_target)              

        data_g  = data_g1.to_crs({'init': 'epsg:4326'})

        for index, row in data_g.iterrows():
            flat_list = []
            for pt in list(row['geometry'].exterior.coords):
                if len(pt) < 3:
                    pt=pt+(115,)
                flat_list.append(pt)
            poly = Polygon(flat_list)
            data.loc[index, 'geometry'] = poly
        
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Sites'}

                return make_response(jsonify(msg), 200)

            data['time_zone'].fillna("America/Phoenix", inplace = True)
            data['soilnotes'].fillna("", inplace = True)      
            data['greenhouse'].fillna("f", inplace = True)            
            data=data.fillna('')
            file_name='sites_n.csv'

            data.to_csv(file_name, encoding='utf-8', index=False)
                        
            #Inserting in Bety
            insert_sites_table(table='sites',data=file_name)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Sites',
                   'Lines Inserted': data_g.shape[0]}
            os.remove(file_name)
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Sites'}
            
            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "unique_name_per_species"'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)
    finally:
        os.remove(shp_file_target)
        os.remove(dbf_file_target)
        os.remove(prj_file_target)
        os.remove(shx_file_target)                

def insert_treatments(username,fileName,status=True):
    """
    This function responds to a request for  /yaba/v1/treatments
    with csv file.Insertion is done to "treatments" table.

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:
        user_id=fetch_id(username, table='users')

        if not user_id:
            return 401

        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','definition','control']
     
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Treatments'}

                return make_response(jsonify(msg), 200)

            data['user_id']=user_id
            insert_table(table='treatments',data=data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Treatments',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Treatments'}
            
            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "unique_name_per_species"'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)

def insert_cultivars(fileName, status=True):
    """
    This function responds to a request for /yaba/v1/cultivars
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    

    try:
        data = pd.read_csv(fileName,delimiter = ',')

        specie_id=fetch_specie_id(data['species'][0])

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['name','species','ecotype','notes']
     
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Cultivars'}
                
                return make_response(jsonify(msg), 200)

            new_data = pd.DataFrame(columns=['name', 'specie_id','name','ecotype','notes'])

            new_data['name']=data['name']
            new_data['specie_id']=specie_id
            new_data['ecotype']='some text'
            new_data['notes']='some text'

            insert_table(table='cultivars',data=new_data)

            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Cultivars',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Cultivars'}
            
            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "unique_name_per_species"'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)
   
def insert_citations(username,fileName, status=True):
    """
    This function responds to a request for  /yaba/v1/citations
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:
        user_id=fetch_id(username, table='users')

        if not user_id:
            return 401

        data = pd.read_csv(fileName,delimiter = ',')
        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['author','year','title','journal','vol','pg','url','pdf','doi']
     
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Citations'}
        
                return make_response(jsonify(msg), 200)
            #Reading the CSV file into DataFrame            
            data['user_id']=user_id
            insert_table(table='citations',data=data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Citations',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Citations'}

            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violation.'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)
        
def insert_experimentSites(fileName, status=True):
    """
    This function responds to a request for /yaba/v1/experiments_sites
    with csv file


    :fileName:      CSV file with experimentsSites meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:
        data = pd.read_csv(fileName,delimiter = ',')
        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['experiment_name','sitename']
     
        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Experiments_sites'}
                    
                return make_response(jsonify(msg), 200)
            
            new_data = pd.DataFrame(columns=['experiment_id', 'site_id'])
            new_data['experiment_id'] = data.apply(lambda row: fetch_id(row['experiment_name'],table='experiments'), axis=1)
            new_data['site_id'] = data.apply(lambda row: fetch_sites_id(row['sitename']), axis=1)            
            insert_table(table='experiments_sites',data=new_data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Experiments_sites',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Experiments_sites'}

            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violation.'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)

def insert_experimentTreatments(fileName, status=True):
    """
    This function responds to a request for /yaba/v1/experiments_treatments
    with csv file


    :fileName:      CSV file with experiments_treatments meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:
    
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['experiment_name','treatment_name']    

        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Experiments_treatments'}
                    
                return make_response(jsonify(msg), 200)
                        
            new_data = pd.DataFrame(columns=['experiment_id', 'treatment_id'])
            new_data['experiment_id'] = data.apply(lambda row: fetch_id(row['experiment_name'],table='experiments'), axis=1)
            new_data['treatment_id'] = data.apply(lambda row: fetch_id(row['treatment_name'],table='treatments'), axis=1)
            insert_table(table='experiments_treatments',data=new_data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Experiments_treatments',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Experiments_treatments'}

            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violation.'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)

def insert_sitesCultivars(fileName, status=True):
    """
    This function responds to a request for /yaba/v1/sites_cultivars
    with csv file


    :fileName:      CSV file with sites_cultivars meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    try:
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['sitename','cultivar_name','specie_id']    

        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Sites_cultivars'}
                    
                return make_response(jsonify(msg), 200)

            new_data = pd.DataFrame(columns=['site_id', 'cultivar_id'])
            new_data['site_id'] = data.apply(lambda row: fetch_sites_id(row['sitename']), axis=1)
            new_data['cultivar_id'] = data.apply(lambda row: fetch_cultivars_id(row['cultivar_name'],row['specie_id']), axis=1)
            insert_table(table='sites_cultivars',data=new_data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Sites_cultivars',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable. Check the format of file or columns',
                   'Table' : 'Sites_cultivars'}

            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error or Inconsistent Data'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violation.'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)
    
def insert_citationsSites(fileName, status=True):
    """
    This function responds to a request for /yaba/v1/citations_sites
    with csv file


    :fileName:      CSV file with citations_sites meta data
    :return:        201 on success
                    400 if file is unsuitable or does not contain appropriate columns
                    409 Intregrity or Constraint error : 23503 foreign_key_violation | 23505 unique_violation
                    500 Database Connection Error
                    401 Unauthorized | No user exists
                    410 Default error.See logs for more information
    """
    
    try:
        data = pd.read_csv(fileName,delimiter = ',')

        #Checking necessary columns are there.
        columns=data.columns.values.tolist()
        accepted_columns=['author','year','title','sitename']

        if(all(x in columns for x in accepted_columns)):
            if status == False:
                msg = {'Message' : 'Successfully Validated',
                       'Table' : 'Citations_sites'}
                    
                return make_response(jsonify(msg), 200)
                        
            new_data = pd.DataFrame(columns=['citation_id','site_id'])
            new_data['site_id'] = data.apply(lambda row: fetch_sites_id(row['sitename']), axis=1)
            new_data['citation_id'] = data.apply(lambda row: fetch_citations_id(row['author'],row['year'],row['title']), axis=1)

            insert_table(table='citations_sites',data=new_data)
            msg = {'Message' : 'Successfully inserted',
                   'Table Affected' : 'Citations_sites',
                   'Lines Inserted': data.shape[0]}
            
            return make_response(jsonify(msg), 201)

        else:
            msg = {'Message' : 'File not acceptable and Check the format of file or columns',
                   'Table':'Citations_sites'}
            return make_response(jsonify(msg), 400)
    
    except OperationalError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Database Conection Error'}
        return make_response(jsonify(msg), 500)
    except IntegrityError:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : '(psycopg2.errors.UniqueViolation) duplicate key value violation.'}
        return make_response(jsonify(msg), 409)
    except Exception as e:
        # Logs the error appropriately
        logging.error(traceback.format_exc())
        msg = {'Message' : 'Error' + str(e)}
        return make_response(jsonify(msg), 410)