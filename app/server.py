"""
Main module of the Server file
"""

#Importing moudles
from flask import Flask, g, render_template,request,redirect,Response
import connexion
import json
from time import sleep



# Create the application instance
app = connexion.App(__name__, specification_dir="./")

sleep(5)

# Read the swagger.yml file to configure the endpoints
app.add_api("yaba.yaml",validate_responses=False)


# create a URL route in our application for "/"
@app.route("/")
def home():
    """
    This function just responds to the browser URL
    localhost:5000/  
    (on docker:     localhost:5001/)
    :return:        the below json message
    """
    return Response(json.dumps("Welcome to YABA API Index Route"), mimetype='application/json')


if __name__ == "__main__":
    app.run(host="localhost",port=5000,debug=False)