#################
#### imports ####
#################

import requests
import csv
import os
from flask import Flask, g, render_template,request,redirect,Response,flash,jsonify, make_response
from flask import request

import json
from time import sleep

# Create app
app = Flask(__name__)
app.secret_key = 'my unobvious secret key'

# The maximum allowed payload to 16 megabytes.
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


ALLOWED_EXTENSIONS = set(['csv', 'xls','xlsx'])

@app.route("/")
def index():    
    return render_template("index.html")

@app.route('/experiments',methods = ['POST'])
def experiments():    
    if request.method == 'POST':
        response=postRequest(request,'experiments')
        return Response(response.text,mimetype="application/json")

@app.route('/sites',methods = ['POST'])
def sites():    
    if request.method == 'POST':
        response=postRequest_with_shpFile(request,'sites')
        return Response(response.text,mimetype="application/json")

        
@app.route('/treatments',methods = ['POST'])
def treatments():    
    if request.method == 'POST':
        response=postRequest(request,'treatments')
        return Response(response.text,mimetype="application/json")

@app.route('/cultivars',methods = ['POST'])
def cultivars():    
    if request.method == 'POST':
        response=postRequest(request,'cultivars')
        return Response(response.text,mimetype="application/json") 

@app.route('/citations',methods = ['POST'])
def citations():    
    if request.method == 'POST':
        response=postRequest(request,'citations')
        return Response(response.text,mimetype="application/json") 

@app.route('/experiments_sites',methods = ['POST'])
def experiments_sites():    
    if request.method == 'POST':
        response=postRequest(request,'experiments_sites')
        return Response(response.text,mimetype="application/json") 

@app.route('/experiments_treatments',methods = ['POST'])
def experiments_treatments():    
    if request.method == 'POST':
        response=postRequest(request,'experiments_treatments')
        return Response(response.text,mimetype="application/json") 

@app.route('/sites_cultivars',methods = ['POST'])
def sites_cultivars():    
    if request.method == 'POST':
        response=postRequest(request,'sites_cultivars')
        return Response(response.text,mimetype="application/json") 

@app.route('/citations_sites',methods = ['POST'])
def citations_sites():    
    if request.method == 'POST':
        response=postRequest(request,'citations_sites')
        return Response(response.text,mimetype="application/json") 

#adding experiments via GUI . For GET it simply renders the GUI 
#from add_experiments.html and for POST, 
# 1.it extracts data from the form,
# 2.creates a temporary file and adds data in that file in csv format ,
# 3.sends it to the client via API Call using post request and 
# 4. deletes the file 
# 5. and again renders the GUI if user needs to add more experiments
@app.route('/add_experiment',method=['GET','POST'])
def add_experiment():
	if request.method=='GET':
		return render_template('add_experiment.html')
	if request.method=='POST':
		exp_name=request.form["e_name"]
		s_date=request.form["s_date"]
		e_date=request.form["e_date"]
		description=request.form["description"]
		design=request.form["design"]
		file=("experiments.csv", "w")
		file.truncate(0)
		writer = csv.writer(file)
		writer.writerow([exp_name, s_date, e_date,description,design])
		file.close()
		requests.post('http://localhost:6001/experiments?username=guestuser', files={'fileName': ('experiments.csv', open('experiments.csv', 'rb'))})
		os.remove("experiments.csv")
		return render_template(add_experiment.html)



@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.errorhandler(500)
def server_error(e):
    return render_template("500.html"), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def _url(path):
    return 'http://yaba_api:5000/yaba/v1/' + path

def postRequest(request,endpoint):
    if 'fileName' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['fileName']
    if not file.filename:
        flash('No file selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        payload = {'fileName':file}
        flash('File successfully uploaded')

        if 'username' not in request.args:
            sleep(1)
            response = requests.post(_url(endpoint),files=payload)
            
        else:
            username=request.args['username']
            params={'username':username}
            sleep(1)
            response = requests.post(_url(endpoint),files=payload,params=params)

        return response
            
    else:
        flash('Allowed file types are csv, xls, xlsx')
        return redirect(request.url)

def postRequest_with_shpFile(request,endpoint):
    if 'fileName' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file     = request.files['fileName']
    shp_file = request.files['shp_file']
    dbf_file = request.files['dbf_file']
    prj_file = request.files['prj_file']
    shx_file = request.files['shx_file']
        
    if not file.filename:
        flash('No file selected for uploading')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        #payload = {'fileName':file}
        payload= {'fileName': file,
                 'shp_file' : shp_file,
                 'dbf_file' : dbf_file,
                 'prj_file' : prj_file,
                 'shx_file' : shx_file }

        flash('File successfully uploaded')
        sleep(1)
        response = requests.post(_url(endpoint),files=payload)
        return response
            
    else:
        flash('Allowed file types are csv, xls, xlsx')
        return redirect(request.url)

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=6000,debug=True)

