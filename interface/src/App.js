import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './components/stylesheets/style.css'
import Navbar from './components/navbar';
import Footer from './components/footer';
import Homepage from './components/homepage';
import Upload1 from './components/upload1';
import Upload2 from './components/upload2';
import Validation from './components/validation';
import Try from './components/try';

class App extends Component {
  constructor(){
    super();
    this.state= { fileList: {}};
    this.getFiles= this.getFiles.bind(this);
    this.viewFiles= this.viewFiles.bind(this);
  }
  
  getFiles(files){
    this.setState((state)=>({ fileList: Object.assign(state.fileList,files) }));
  }

  viewFiles(){
    console.log(this.state)
  }


  render(){
    return (
      <BrowserRouter>
      <div className='App'>
        <Navbar />
        <Switch>
        <Route path="/" component={Homepage} exact/>
        <Route path="/upload1" component={()=> <Upload1 getFiles={this.getFiles}/>} exact/>
        <Route path="/upload2" component={()=> <Upload2 getFiles={this.getFiles}/>} exact/>
        <Route path="/validate" component={()=> <Validation fileList={this.state}/>} exact/>
        <Route path="/try" component={()=> <Try />} exact/>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
