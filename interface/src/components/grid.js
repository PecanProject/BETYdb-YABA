import React, {Component} from 'react';
import * as d3 from 'd3';
import getRandomColors from './getRandomColor'

class Grid extends Component{
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        let data= this.props.data;
        let type=this.props.type;
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
        console.log(data,mrow,mcol)
        console.log(label,color)
        let plots = new Array();
        let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
        let ypos = 1;
        let width = 25;
        let height = 25;
        let gcol='';
        let x,y,idx;
        // iterate for rows 
        for (let row = 0; row < mrow; row++) {
            plots.push( new Array() );
            
            // iterate for cells/columns inside rows
            for (let column = 0; column < mcol; column++) {
                gcol="#fff"
                data.forEach((set)=>{
                    x= ((set.x -1) * 25 )+ 1;
                    y= ((set.y -1) * 25 )+ 1;
                    if( y==xpos && x==ypos ){
                        idx= label.indexOf(set[type])
                        gcol= color[idx];
                    }
                })
                
                plots[row].push({
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
        console.log(plots)

        let grid = d3.select("#grid")
        .append("svg")
        .attr("width",26 * mcol)
        .attr("height",26 * mrow);

        let row = grid.selectAll(".row")
        .data(plots)
        .enter().append("g")
        .attr("class", "row");

        let column = row.selectAll(".square")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("class","square")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; })
        .style("fill", function(d) { return d.color; })
        .style("stroke", "#222")

        let legend=[];
        for(let i=0; i < label.length; i++){
            legend.push([label[i],color[i]])
        }
    }

    render(){
        return (
        <div>
        <div id="legend"></div>
        <div id="grid"></div>
        </div>
        );
    }

}

export default Grid;