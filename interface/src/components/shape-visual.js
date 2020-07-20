import React,{Component} from 'react';
import GMap from './gmap';
import { uploadFiles, uploadSites} from './requests'
import { withRouter, Redirect} from 'react-router-dom'
import './stylesheets/visual.css'

class ShapeView extends Component{
    constructor(props){
        super(props);
        this.state={
            redirect: false
        }
        this.onError=this.onError.bind(this);
        this.onNext=this.onNext.bind(this);
    }

    async onNext(e){
        try{
            let files= this.props.fileList.fileList;
            let val= [];
            Promise.all([
                    uploadFiles(files.cultivars, "cultivars", ""),
                    uploadFiles(files.experiments, "experiments", "guestuser"),
                    uploadFiles(files.treatments, "treatments", "guestuser"),
                    uploadFiles(files.citations, "citations", "guestuser"),
                ])
                .then((values)=> val.push(values[0],values[1],values[2],values[3]))
                .then(()=> Promise.all([
                    uploadFiles(files.sites_cultivars, "sites_cultivars", ""),
                    uploadFiles(files.experiments_sites, "experiments_sites", ""),
                    uploadFiles(files.experiments_treatments, "experiments_treatments", ""),
                    uploadFiles(files.citations_sites, "citations_sites", "")
                ]))
            .then((values)=>{
                val.push(values[0],values[1],values[2],values[3])
                let files=['cultivars', 'experiments',  'treatments', 'citations', 'sites_cultivars','experiments_sites', 'experiments_treatments', 'citations_sites'];
                return val.map((data,i)=>{
                    if(!data.hasOwnProperty('Lines Inserted')){
                        if(data === 410)
                            return `410 while uploading ${files[i]}`;
                        else
                            return `${data['Message']} while uploading ${files[i]}`;
                    }
                    return `success`;
                }).filter((data)=>{
                    return data !== 'success';
                })
            })
            .then((err_list)=>{
                if(err_list.length>0){
                    this.setState({
                        redirect: true,
                        path: "/error",
                        message: err_list
                    });
                }
                else{
                    this.setState({
                        redirect: true,
                        path: "/success",
                        message: [""]
                    });
                }
            })
        }
        catch(err){
            this.setState({
                redirect: true,
                path: "/error",
                message: [err.message]
            });
        }
    }

    onError(e){
        return this.props.history.push("/");
    }
    
    render(){
        if (this.state.redirect){
            return <Redirect
                    to= {{
                        pathname: this.state.path,
                        state: { message: this.state.message }
                    }}/>;
            }
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
