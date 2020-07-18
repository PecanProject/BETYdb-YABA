import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import './stylesheets/error.css';

class Errorpage extends Component{
    constructor(props){
        super(props);
        this.onError=this.onError.bind(this);
    }

    onError(e){
        return this.props.history.push("/");
    }

    render(){
        let message="";
        console.log(this.props.location.state.message)
        if(this.props.location.state.message !== undefined){
            message= <ul>{this.props.location.state.message.map((msg, i)=><li key={i}>{msg}</li>)}</ul>;
        };
        return(   
            <div className="content">
                <div className="error-box">
                    <div>
                        <img src="/cross.png" alt="error" className="bg-svg"></img>
                    </div>
                    <div>
                        <span id="message">
                            <center><span>We have encountered some error:</span>
                            {message}
                            </center>
                        </span>
                    </div>
                </div>
                <div className="button">
                    <button className="danger ripple-danger" onClick={this.onError}>TRY AGAIN</button>
                </div>
            </div>
        )
    }
}

export default withRouter(Errorpage);