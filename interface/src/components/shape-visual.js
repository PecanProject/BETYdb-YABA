import React,{Component} from 'react';
import GMap from './gmap';
import { uploadFiles, uploadSites} from './requests'
import { withRouter} from 'react-router-dom'
import './stylesheets/visual.css'

class ShapeView extends Component{
    constructor(props){
        super(props);
        this.onError=this.onError.bind(this);
        this.onNext=this.onNext.bind(this);
    }

    async onNext(e){
        try{
            let files= this.props.fileList.fileList;
            Promise.all([
                uploadFiles(files.cultivars, "cultivars", ""),
                uploadFiles(files.sites_cultivars, "sites_cultivars", ""),
                uploadFiles(files.experiments, "experiments", "guestuser"),
                uploadFiles(files.experiments_sites, "experiments_sites", ""),
                uploadFiles(files.treatments, "treatments", "guestuser"),
                uploadFiles(files.experiments_treatments, "experiments_treatments", ""),
                uploadFiles(files.citations, "citations", "guestuser"),
                uploadFiles(files.citations_sites, "citations_sites", "")
            ])
            .then((data)=>{
                this.props.history.push("/success")
            })
        }
        catch(err){
            return this.props.history.push("/error");
        }
    }

    onError(e){
        return this.props.history.push("/");
    }
    
    render(){
        return(
            <div className="shape-view">
                <div className="heading">Confirm the view of your shapefile ?</div>
                <div className="map">
                    <GMap file={this.props.fileList.fileList.shapefile} />
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

export default withRouter(ShapeView);
