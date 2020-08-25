import React, { Component } from 'react'
import { Map, Polygon, Popup, GeoJSON, TileLayer } from 'react-leaflet'
import getRandomColors from './getRandomColor'
import * as d3 from 'd3';
import { getGeoJSON, getVisualData } from './requests'
import './stylesheets/map.css'
import { bbox } from '@turf/turf'


class GMap extends Component{    
    constructor(props) {
        super(props);
        this.state={
            position: [ 33.056702, -112.046656 ]
      }   
        this.geoFeature= this.geoFeature.bind(this);
    }
    
    async componentDidMount(){
        try{
            const geoJSON= await getGeoJSON(this.props.file);
            const sites= await getVisualData(this.props.sites, this.props.type);
            const colors= getRandomColors(sites.length);
            const bboxArray = bbox(geoJSON);
            const type= this.props.type;
            let features= geoJSON.features
            const corner1 = [bboxArray[1], bboxArray[0]];
            const corner2 = [bboxArray[3], bboxArray[2]];
            const bounds= [corner1, corner2];
            this.setState({
                sites,
                features,
                colors,
                bounds
            })

            let label=[];            
            for(let i=0; i < sites.length; i++){
                if(!label.includes(sites[i][type])){
                    label.push(sites[i][type])
                }
            }

            let legend = d3.select(`#legend${type}`).append("svg")
            // Usually you have a color scale in your chart already
            let scale = d3.scaleOrdinal()
            .domain(label)
            .range(colors);
            
            // Add one dot in the legend for each name.
            let size = 20
            legend.selectAll("mydots")
            .data(label)
            .enter()
            .append("rect")
                .attr("x", 0)
                .attr("y", (d,i)=>{ return i*(size+5)}) // 0 is where the first dot appears. 5 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", (d)=>{ return scale(d)})
                .style("stroke", "#222222")
            
            // Add one dot in the legend for each name.
            legend.selectAll("mylabels")
            .data(label)
            .enter()
            .append("text")
                .attr("x", size*1.2)
                .attr("y", (d,i)=>{ return 3 + i*(size+5) + (size/2)}) // 13 is where the first dot appears. 5 is the distance between dots
                .style("fill", (d)=>{ return scale(d)})
                .text((d)=>{ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
        catch(err){
            console.log(err);
        }
    }

    geoFeature(geoJSON, sites, colors){
        let geoData;
        if(geoJSON !== undefined && sites !== undefined){
            geoData= geoJSON.map((feature)=>{
            feature.properties.color="#FFFFFF";   
            sites.map((site,i)=>{
                   if(site.polygon.type === feature.geometry.type && JSON.stringify(site.polygon.coordinates) === JSON.stringify(feature.geometry.coordinates))
                            feature.properties.color= colors[i];
               })
            return(
            <GeoJSON key={feature.properties.Id} data={feature} 
                style={{
                    fillColor: feature.properties.color,
                    weight: 0.5,
                    color: "#000000",
                    fillOpacity: 1}}>
                        <Popup>
                            <p>Range {feature.properties.f_range} Column {feature.properties.f_column}</p>
                        </Popup>
            </GeoJSON>
            )
         })
        }
        return geoData;        
    }

    render(){
        return (
            <div>
                <div id={`legend${this.props.type}`} className="legend"></div>
                <Map
                center={this.state.position}
                zoom={19} maxZoom={30}
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

                    {this.geoFeature(this.state.features, this.state.sites, this.state.colors)}
            );
            })}

                </Map>
            </div>
        )
    }
}

export default GMap;