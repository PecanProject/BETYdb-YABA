import React,{Component} from 'react';
import GMap from './gmap';
import { withRouter } from 'react-router-dom'
import './stylesheets/visual.css'

class ExperimentsView extends Component{
    constructor(props){
        super(props);
        this.onError=this.onError.bind(this);
        this.onNext=this.onNext.bind(this);
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    onNext(e){
        return this.props.history.push("/tmap");
    }

    onError(e){
        return this.props.history.push("/");
    }
    
    render(){
        return(
            <div id="visualize">
                <div className="heading">Confirm the design of your experiments ?</div>
                <div className="map">
                    <GMap file={this.props.fileList.fileList.shapefile} sites={this.props.fileList.fileList} type="experiments"/>
                </div>
                <div className="choice">
                    <div>Do you want to continue ?</div>
                    <div className="options">
                        <button className="danger ripple-danger" onClick={this.onError}>TRY AGAIN</button>
                        <button className="primary ripple-primary" onClick={this.onNext}>NEXT</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ExperimentsView);
