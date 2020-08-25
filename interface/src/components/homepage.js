import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './stylesheets/homepage.css'

class homepage extends Component{
    render(){
        return(
            <div className="home-content">
                <div className="heading" >
                    <span>Metadata Upload Interface</span>
                </div>
                <div className="description">
                    <p>You can upload your metadata for a season here. You'll need to provide a 
                    list of cultivators, experimental metadata, a shapefile, and some other stuff.</p>
                </div>
                <div className="steps">
                    <div><span>Steps</span></div>
                    <ol>
                        <li>Fill out Metadata in the google spreadsheet template (<a href="https://docs.google.com/spreadsheets/d/1c_5j7q3TO6gQ24KSopE-_LXA5HhfsUEqMupckGZAbo8/edit#gid=0" target="_blank" style= { { color: "blue"} }>How to do this</a>).</li>
                        <li>Prepare a shapefile or table with plot polygons (<a  href="https://desktop.arcgis.com/en/arcmap/latest/manage-data/shapefiles/creating-a-new-shapefile.htm" target="_blank" style= { { color: "blue"} }>How to do this</a>).</li>
                    </ol>
                </div>
                <div className="field">
                    <div><span>Provide your API Key</span></div>
                    <div><input type="text" placeholder="asdf-my-secret-key-asodihf"/></div>
                </div>
                <div id="start">
                    <Link to="/upload1"><button className="primary ripple-primary">START</button></Link>
                </div>
            </div>
        )
    }
}

export default homepage