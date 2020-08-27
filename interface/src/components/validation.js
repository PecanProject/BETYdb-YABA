import React,{Component} from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { uploadFiles } from './requests'
import './stylesheets/validation.css'

class Validation extends Component{
  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = { //state is by default an object
       onLoad: false,
       redirect: false
    }
    this.onError=this.onError.bind(this);
    this.onNext=this.onNext.bind(this);
 }

async componentDidMount(){
  let files= this.props.fileList;
  Promise.all([
    uploadFiles(files.cultivars, "cultivars", "", false),
    uploadFiles(files.experiments, "experiments", "guestuser", false),
    uploadFiles(files.treatments, "treatments", "guestuser", false),
    uploadFiles(files.citations, "citations", "guestuser", false),
    uploadFiles(files.sites_cultivars, "sites_cultivars", "", false),
    uploadFiles(files.experiments_sites, "experiments_sites", "", false),
    uploadFiles(files.experiments_treatments, "experiments_treatments", "", false),
    uploadFiles(files.citations_sites, "citations_sites", "", false)
  ])
  .then((values)=>{
    this.setState({
      status: values,
      onLoad: true
    })
  })
  .catch((err)=> {
    this.setState({
      redirect: true,
      path: "/error",
      message: [err.message]
  })
})
}

onNext(e){
  return this.props.history.push("/cmap");
}

onError(e){
  return this.props.history.push("/");
}

renderTableHeader() {
  let header = (Object.keys(this.state.status[0])).unshift("")
  return header.map((key, index) => {
     return <th key={index}>{key.toUpperCase()}</th>
  })
}

renderTableData() {
  return this.state.status.map((data, index) => {
     const { Message, Table } = data //destructuring
     return (
        <tr key={index}>
           <td>{index + 1}</td>
           <td>{Table}</td>
           <td>{Message}</td>
        </tr>
     )
  })
}

render() {
  if (this.state.redirect){
    return <Redirect
            to= {{
                pathname: this.state.path,
                state: { message: this.state.message }
            }}/>;
    }
  return (
    <div id="validation">
      <div className='table'>
        <h1 id='title'>Check weather your files are ready or not?</h1>
        <table id='status'>
           <tbody>
           <tr>
             <th>INDEX</th>
             <th>TABLE</th>
             <th>STATUS</th>
            </tr>
                {this.state.onLoad && this.renderTableData()}
           </tbody>
        </table>
      </div>
      <div className="choice">
        <div>Do you want to continue ?</div>
        <div className="options">
          <button className="danger ripple-danger" onClick={this.onError}>TRY AGAIN</button>
          <button className="primary ripple-primary" onClick={this.onNext}>NEXT</button>
        </div>
      </div>
    </div>
  )
}
}

export default withRouter(Validation);