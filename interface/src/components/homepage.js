import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { getUserData } from './requests'
import './stylesheets/homepage.css'

class Homepage extends Component{
    constructor(props){
        super(props);
        this.updateUser=this.updateUser.bind(this);
    }

    async updateUser(){
        let apikey= document.getElementById("api-key").value;
        if(apikey !== ""){
            let user= await getUserData(apikey);
            if(user.hasOwnProperty("error")){
                return alert('Encountered error: '+ user.error);
            }
            if(Object.keys(user).length === 0)
                return alert('User not found. Please enter a valid API key');
            let isValid = window.confirm(`Please confirm, are you ${user}?`);
            if(isValid === true){
                this.props.setUser(user);
                return this.props.history.push("/upload1");
            }
            return;
        }
        if(this.props.user !== undefined)
        return this.props.history.push("/upload1");
        return alert('Please enter a valid API key');
    }

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
                        <li>Fill out Metadata in the google spreadsheet template (<a href="https://docs.google.com/spreadsheets/d/1Fr_8xYOucyCQ9WH5_1bfPTMpm3IhKX5oqW4UOMvPoSY/edit#gid=0" rel="noopener noreferrer" target="_blank" style= { { color: "blue"} }>How to do this</a>).</li>
                        <li>Prepare a shapefile or table with plot polygons (<a  href="https://desktop.arcgis.com/en/arcmap/latest/manage-data/shapefiles/creating-a-new-shapefile.htm" rel="noopener noreferrer" target="_blank" style= { { color: "blue"} }>How to do this</a>).</li>
                    </ol>
                </div>
                <div className="field">
                    <div><span>Provide your API Key</span></div>
                    <div><input id="api-key" type="text" placeholder="asdf-my-secret-key-asodihf"/></div>
                </div>
                <div id="start">
                    <button className="primary ripple-primary" onClick={this.updateUser}>START</button>
                </div>
            </div>
        )
    }
}

export default withRouter(Homepage)