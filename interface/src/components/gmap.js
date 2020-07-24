import React, { Component } from 'react'
import { Map, GeoJSON, TileLayer } from 'react-leaflet'
import { getGeoJSON } from './requests'
import './stylesheets/leaflet.css'
import { bbox } from '@turf/turf'


class GMap extends Component{    
    constructor(props) {
        super(props);
        this.state={
            position: [51.505, -0.09]
      }    
    }
    
    async componentDidMount(){
        try{
        const geoJSON= await getGeoJSON(this.props.file);
        const bboxArray = bbox(geoJSON);
        const corner1 = [bboxArray[1], bboxArray[0]];
        const corner2 = [bboxArray[3], bboxArray[2]];
        const bounds= [corner1, corner2];
        this.setState({
            geoJSON,
            bounds
        })
        }
        catch(err){
            console.log(err);
        }
    }

    render(){
        return (
            <Map
            center={this.state.position}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            touchZoom= {true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
            bounds= {this.state.bounds}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />

                    <GeoJSON
                        data={this.state.geoJSON}
                    >
                    </GeoJSON>

            </Map>
        )
    }
}

export default GMap;