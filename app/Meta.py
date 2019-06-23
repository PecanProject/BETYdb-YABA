"""
This is the Meta module and supports all the ReST actions for the yaba.yaml
"""

# Importing modules
import os

from flask import make_response, abort,Response
import pandas as pd
import json
from db import *
import geopandas as gpd
from werkzeug import secure_filename, FileStorage


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
    This function responds to a request for /yaba/v1/experiments
    with csv file


    :fileName:      CSV file with experiments meta data
    :return:        201 on success,
    """
    user_id=fetch_id(username,table='users')

    if user_id =='':
        return 403
    else:
        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')
        data['user_id']=user_id
        data['design'].fillna('some text', inplace=True)
                
        try:
            insert_table(table='experiments',data=data)
            return Response(json.dumps("File Received"), mimetype='application/json'), 201
        except:
            return 400
     
def insert_sites(fileName,shp_file,dbf_file,prj_file,shx_file):
    """
    This function responds to a request for  /yaba/v1/sites
    with files


    :shp_file:      .shp file
    :dbf_file:      .dbf file
    :prj_file:      .prj file
    :shx_file:      .shx file
    :return:        appropriate message
    """
    
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

    data['geometry']=data_g['geometry']
    data['notes']=data_g['notes']
    data['soil']='some text'
    data['soilnotes']='some text'

    
    try:
        #Inserting in Bety
        insert_table(table='sites',data=data)
        return Response(json.dumps("File Received"), mimetype='application/json'), 201
    except:
        return 400

def insert_treatments(username,fileName):
    """
    This function responds to a request for  /yaba/v1/treatments
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
    """
    
    user_id=fetch_id(username,table='users')

    if user_id =='':
        return 403
    else:
        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')
        data['user_id']=user_id
                
        try:
            insert_table(table='treatments',data=data)
            return Response(json.dumps("File Received"), mimetype='application/json'), 201
        except:
            return 400

def insert_cultivars(fileName):
    """
    This function responds to a request for /yaba/v1/cultivars
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
    """
    data = pd.read_csv(fileName,delimiter = ',')

    specie_id=fetch_specie_id(data['species'][0])

    new_data = pd.DataFrame(columns=['name', 'specie_id','name','ecotype','notes'])

    new_data['name']=data['name']
    new_data['specie_id']=specie_id
    new_data['name']='some text'
    new_data['ecotype']='some text'
    new_data['notes']='some text'

    try:
        insert_table(table='cultivars',data=new_data)
        return Response(json.dumps("File Received"), mimetype='application/json'), 201
    except:
        return 400

def insert_citations(username,fileName):
    """
    This function responds to a request for  /yaba/v1/citations
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
    """
    
    user_id=fetch_id(username,table='users')

    if user_id =='':
        return 403
    else:
        #Reading the CSV file into DataFrame
        data = pd.read_csv(fileName,delimiter = ',')
        data['user_id']=user_id
                
        try:
            insert_table(table='citations',data=data)
            #print(data)
            return Response(json.dumps("File Received"), mimetype='application/json'), 201
        except:
            return 400

def insert_experimentSites(fileName):
    """
    This function responds to a request for /yaba/v1/experiments_sites
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
    """

    
    data = pd.read_csv(fileName,delimiter = ',')

    new_data = pd.DataFrame(columns=['experiment_id', 'site_id'])

    new_data['experiment_id'] = [fetch_id(x,table='experiments') for x in data['experiment_name']]

    new_data['site_id'] = [fetch_sites_id(x) for x in data['sitename']]

    try:
        insert_table(table='experiments_sites',data=new_data)
        return Response(json.dumps("File Received"), mimetype='application/json'), 201
    except:
        return 400

    
    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_experimentTreatments(fileName):
    """
    This function responds to a request for /yaba/v1/experiments_treatments
    with csv file


    :fileName:      CSV file with cultivars meta data
    :return:        201 on success
    """
    
    
    data = pd.read_csv(fileName,delimiter = ',')

    new_data = pd.DataFrame(columns=['experiment_id', 'treatment_id'])

    new_data['experiment_id'] = [fetch_id(x,table='experiments') for x in data['experiment_name']]

    new_data['treatment_id'] = [fetch_id(x,table='treatments') for x in data['treatment_name']]

    try:
        insert_table(table='experiments_treatments',data=new_data)
        return Response(json.dumps("File Received"), mimetype='application/json'), 201
    except:
        return 400

def insert_sitesCultivars(fileName):
    """Yet to be Implemensted"""

    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_citationsSites(fileName):
    """Yet to be Implemensted"""

    return Response(json.dumps("File Received"), mimetype='application/json')







