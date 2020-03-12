"""
Main module of the Server file
"""

#Importing moudles
import connexion
from flask import jsonify
from flask import json
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
    return jsonify("Welcome to YABA API Index Route")


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=False)
    #http_server = WSGIServer(('0.0.0.0', 5000), app)
    #http_server.serve_forever()
