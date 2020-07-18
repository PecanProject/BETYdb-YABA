import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import * as d3 from 'd3';
import getRandomColors from './getRandomColor'
import { getVisualData } from './requests'

class Grid extends Component{
    constructor(props){
        super(props);
    }
    
    async componentDidMount(){
        try{
            let type=this.props.type;
            let username= this.props.username;
            let data= await getVisualData(this.props.data, type, username);
            let label=[],color=[];
            let mrow=0,mcol=0;
            for(let i=0; i < data.length; i++){
                if(data[i]["x"] > mrow)
                    mrow= data[i]["x"] ;
                if(data[i]["y"] > mcol)
                    mcol= data[i]["y"] ;
                if(!label.includes(data[i][type])){
                    label.push(data[i][type])
                }
            }
            color= getRandomColors(label.length)
            let plots = new Array();
            let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
            let ypos = 1;
            let width = 25;
            let height = 25;
            let gcol='';
            let x,y,idx,name='';
            // iterate for rows 
            for (let row = 0; row < mrow; row++) {
                plots.push( new Array() );
                
                // iterate for cells/columns inside rows
                for (let column = 0; column < mcol; column++) {
                    gcol="#fff"
                    data.forEach((set)=>{
                        name= set.experiments;
                        y= ((set.x -1) * 25 )+ 1;
                        x= ((set.y -1) * 25 )+ 1;
                        if( x==xpos && y==ypos ){
                            idx= label.indexOf(set[type])
                            gcol= color[idx];
                        }
                    })
                    
                    plots[row].push({
                        name: name,
                        x: xpos,
                        y: ypos,
                        width: width,
                        height: height,
                        color: gcol
                    })
                    // increment the x position. I.e. move it over by 50 (width letiable)
                    xpos += width;
                    }
                // reset the x position after a row is complete
                xpos = 1;
                // increment the y position for the next row. Move it down 50 (height letiable)
                ypos += height; 
            }
        
            let grid = d3.select(`#grid${type}`)
            .append("svg")
            .attr("width",26 * mcol)
            .attr("height",26 * mrow);

            let row = grid.selectAll(".row")
            .data(plots)
            .enter().append("g")
            .attr("class", "row");

            row.selectAll(".square")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("class","square")
            .attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; })
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", function(d) { return d.color; })
            .style("stroke", "#222")
            .attr("data-legend",function(d) { return d.name})
            .append("title")
            .text(function(d,i){
                let x= ((d.x-1)/25) + 1;
                let y= ((d.y-1)/25) + 1;
                return "Range "+ y +" Column " + x})

            var SVG = d3.select(`#legend${type}`).append("svg")
            // Usually you have a color scale in your chart already
            var legend = d3.scaleOrdinal()
            .domain(label)
            .range(color);
            
            // Add one dot in the legend for each name.
            var size = 20
            SVG.selectAll("mydots")
            .data(label)
            .enter()
            .append("rect")
                .attr("x", 0)
                .attr("y", function(d,i){ return i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("width", size)
                .attr("height", size)
                .style("fill", function(d){ return legend(d)})
                .style("stroke", "#222")
            
            // Add one dot in the legend for each name.
            SVG.selectAll("mylabels")
            .data(label)
            .enter()
            .append("text")
                .attr("x", size*1.2)
                .attr("y", function(d,i){ return 3 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return legend(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
        catch(err){
            console.log(err)
        }
    }

    render(){
        let legend=`legend${this.props.type}`;
        let grid=`grid${this.props.type}`;
        let title= this.props.type[0].toUpperCase() + this.props.type.slice(1);
        return (
        <div className="grid">
        <div className="title">{title}</div>
        <div id={legend}></div>
        <div id={grid}></div>
        </div>
        );
    }

}

export default withRouter(Grid);