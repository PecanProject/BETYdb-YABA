"""
Main module of the Server file
"""

#Importing moudles
from flask import Flask, g, render_template,request,redirect,Response
import connexion
import json


# Create the application instance
app = connexion.App(__name__, specification_dir="./")

# Read the swagger.yml file to configure the endpoints
app.add_api("yaba.yaml",validate_responses=True)


# create a URL route in our application for "/"
@app.route("/")
def home():
    """
    This function just responds to the browser URL
    localhost:5000/  
    (on docker: localhost:5001/)
    :return:        the below json message
    """
    return Response(json.dumps("Welcome to YABA API Index Route"), mimetype='application/json')


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)