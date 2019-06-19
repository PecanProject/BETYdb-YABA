"""
This is the Meta module and supports all the ReST actions for the yaba.yaml
"""

# Importing modules
import os

from flask import make_response, abort,Response
import pandas as pd
import json
from db import insert_table
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

def insert_experiments(fileName):
    """
    This function responds to a request for /yaba/v1/experiments
    with csv file


    :fileName:      CSV or XLS file with experiments meta data
    :return:        201 on success,
    """
    
    #Reading the CSV file into DataFrame
    data = pd.read_csv(fileName,delimiter = ',')
    
    #Inserting the data into Tables
    insert_table(table='experiments',data=data)

    return Response(json.dumps("File Received"), mimetype='application/json'), 201
    
def insert_sites(shp_file,dbf_file,prj_file,shx_file):
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
    
    #Reading the file as DataFrame
    data_g=gpd.read_file(shp_file_target)

    data = pd.DataFrame(data_g)

    #Inserting in POSTGRES table
    insert_table(table='sites',data=data)

    return Response(json.dumps("File Received"), mimetype='application/json'), 201

def insert_treatments(fileName):
    """
    This function responds to a request for  /yaba/v1/treatments
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
    """
    
    data = pd.read_csv(fileName,delimiter = ',')
    insert_table(table='treatments',data=data)
    return Response(json.dumps("File Received"), mimetype='application/json'), 201

def insert_cultivars(fileName):
    """Yet to be Implemensted"""
    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_citations(fileName):
    """
    This function responds to a request for  /yaba/v1/citations
    with csv file

    :fileName:      CSV  with treatments meta data
    :return:        201 on success
    """
    
    data = pd.read_csv(fileName,delimiter = ',')
    insert_table(table='citations',data=data)
    return Response(json.dumps("File Received"), mimetype='application/json'),201

def insert_experimentSites(fileName):
    """Yet to be Implemensted"""

    
    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_experimentTreatments(fileName):
    """Yet to be Implemensted"""

    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_sitesCultivars(fileName):
    """Yet to be Implemensted"""

    return Response(json.dumps("File Received"), mimetype='application/json')

def insert_citationsSites(fileName):
    """Yet to be Implemensted"""

    return Response(json.dumps("File Received"), mimetype='application/json')







