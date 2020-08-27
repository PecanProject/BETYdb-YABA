import React,{Component} from 'react';
import GMap from './gmap';
import { withRouter } from 'react-router-dom'
import './stylesheets/visual.css'

class CultivarsView extends Component{
    constructor(props){
        super(props);
        this.onError=this.onError.bind(this);
        this.onNext=this.onNext.bind(this);
    }

    componentDidMount(){
        window.scrollTo(0, 0);
    }

    onNext(e){
        return this.props.history.push("/emap");
    }

    onError(e){
        return this.props.history.push("/");
    }
    
    render(){
        return(
            <div id="visualize">
                <div className="heading">Confirm the design of your cultivars ?</div>
                <div className="map">
                <GMap file={this.props.fileList.shapefile} sites={this.props.fileList} type="cultivars"/>
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

export default withRouter(CultivarsView);
