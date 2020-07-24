import React,{Component} from 'react'
import DragAndDrop from'./draganddrop'
import { withRouter } from 'react-router-dom'
import parseToCsv from './sheet-parser'
import './stylesheets/upload1.css'


class Upload extends Component{
    constructor(props){
        super(props);
        this.state={
                    shapefile: {},
                    sites: {},
                    citations:{},
                    citations_sites: {},
                    cultivars:{}
                }
        this.fileUpload=this.fileUpload.bind(this);
        this.sendFile=this.sendFile.bind(this);
        this.urlUpload=this.urlUpload.bind(this);
    }

    fileUpload(file , data){
         this.setState({ [data]: file });
    }

    urlUpload(e){
        const data= e.target.name;
        const url= e.target.value;
        let pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        if(pattern.test(url)){
            this.setState({ [data]: { url } })
        }
    }

    async sendFile(){
        let str=[];
        for(let key in this.state){
            if(!Object.keys(this.state[key]).length>0){
                str.push(key);
            }
            if((this.state[key]).hasOwnProperty("url")){
                console.log(key);
               await parseToCsv(this.state[key].url)
                .then((data)=>{
                    console.log(data)
                    this.setState({[key]:data})
                })
                .catch(err=> console.log(err))
            }
        }
        if(str.length===0){
            this.props.getFiles(this.state)
            return this.props.history.push("/upload2");
        }
        str.join(", ");
        alert(`You have not uploaded your ${str} files`);
    
    }
    
    render(){
        return(
            <div className="upload-content">
                <div className="upload" id="upload-shapefile">
                    <div className="heading" >
                        <span>Upload your shapefile as zip</span>
                    </div>
                    <DragAndDrop fileUpload={this.fileUpload} data="shapefile"/>
                </div>    

                <div className="upload" id="upload-spreadsheet">
                    <div className="heading" >
                        <span>Upload your sites spreadsheet</span>
                    </div>
                    <div className="upload-input">
                        <input type="text" name="sites" onInput={this.urlUpload} placeholder="Paste the link to completed google sheet"/>
                        <span>or</span>
                    </div>
                    <DragAndDrop fileUpload={this.fileUpload} data="sites"/>
                </div>

                <div className="upload" id="upload-spreadsheet">
                    <div className="heading" >
                        <span>Upload your citations spreadsheet</span>
                    </div>
                    <div className="upload-input">
                        <input type="text" name="citations" onInput={this.urlUpload} placeholder="Paste the link to completed google sheet"/>
                        <span>or</span>
                    </div>
                    <DragAndDrop fileUpload={this.fileUpload} data="citations"/>
                </div>

                <div className="upload" id="upload-spreadsheet">
                    <div className="heading" >
                        <span>Upload your citations_sites spreadsheet</span>
                    </div>
                    <div className="upload-input">
                        <input type="text" name="citations_sites" onInput={this.urlUpload} placeholder="Paste the link to completed google sheet"/>
                        <span>or</span>
                    </div>
                    <DragAndDrop fileUpload={this.fileUpload} data="citations_sites"/>
                </div>

                <div className="upload" id="upload-spreadsheet">
                    <div className="heading" >
                        <span>Upload your cultivars spreadsheet</span>
                    </div>
                    <div className="upload-input">
                        <input type="text" name="cultivars" onInput={this.urlUpload} placeholder="Paste the link to completed google sheet"/>
                        <span>or</span>
                    </div>
                    <DragAndDrop fileUpload={this.fileUpload} data="cultivars"/>
                </div>

                <div className="next">
                            <button className="primary ripple-primary" onClick={this.sendFile}>NEXT</button>
                </div>
            </div>
        )
    }
}

export default withRouter(Upload)
