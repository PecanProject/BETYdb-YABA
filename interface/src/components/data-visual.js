import React,{Component} from 'react';
import Grid from './grid';
import { withRouter } from 'react-router-dom'
import './stylesheets/visual.css'

class Visual extends Component{
    constructor(props){
        super(props);
        this.onError=this.onError.bind(this);
        this.onNext=this.onNext.bind(this);
    }

    onNext(e){
        return this.props.history.push("/map");
    }

    onError(e){
        return this.props.history.push("/");
    }
    
    render(){
        return(
            <div id="visualize">
                <div className="heading">Confirm the design of your experiments ?</div>
                <div className="grid-container">
                    <Grid data={this.props.fileList.fileList} type='cultivars' username=''/>
                    <Grid data={this.props.fileList.fileList} type='experiments' username='guestuser'/>
                    <Grid data={this.props.fileList.fileList} type='treatments' username='guestuser'/>
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

export default withRouter(Visual);
