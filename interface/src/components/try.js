import React,{Component} from 'react';
import Grid from './grid';

class Try extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        let data=[
            {
                experiments: "ADH",
                x: 1,
                y: 1
            },
            {
                experiments: "HAD",
                x: 2,
                y: 1
            },
            {
                experiments: "DAH",
                x: 1,
                y: 2
            },
            {
                experiments: "HAD",
                x: 1,
                y: 4
            },
            {
                experiments: "HAD",
                x: 4,
                y: 3
            },
            {
                experiments: "ADH",
                x: 4,
                y: 2
            },
            {
                experiments: "ADH",
                x: 3,
                y: 2
            },
            {
                experiments: "HAD",
                x: 4,
                y: 5
            },
            {
                experiments: "HAD",
                x: 2,
                y: 3
            },
            {
                experiments: "ADH",
                x: 4,
                y: 4
            },
            {
                experiments: "HAD",
                x: 2,
                y: 4
            },
            {
                experiments: "HAD",
                x: 1,
                y: 3
            },            
        ]
        let type="experiments";
        return(
            <Grid data={data} type={type}/>
        );
    }
}

export default Try;
