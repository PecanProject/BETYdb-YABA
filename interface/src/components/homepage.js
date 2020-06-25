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
                        <li>Fill out Metadata in this google spreadsheet template (How to do this).</li>
                        <li>Prepare a shapefile or table with plot polygons (How to do this).</li>
                    </ol>
                </div>
                <div className="field">
                    <div><span>Provide your API Key</span></div>
                    <div><input type="text" placeholder="asdf-my-secret-key-asodihf"/></div>
                </div>
                <div id="start">
                    <Link to="/upload1"><button className="ripple">START</button></Link>
                </div>
            </div>
        )
    }
}

export default homepage