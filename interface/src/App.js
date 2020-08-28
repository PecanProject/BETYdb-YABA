import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './components/stylesheets/style.css'
import Navbar from './components/navbar';
import Footer from './components/footer';
import Homepage from './components/homepage';
import Upload1 from './components/upload1';
import Upload2 from './components/upload2';
import Validation from './components/validation';
import CultivarsView from './components/cultivars-visual'
import ExperimentsView from './components/experiments-visual'
import TreatmentsView from './components/treatments-visual'
import Successpage from './components/success';
import Errorpage from './components/error'

class App extends Component {
  constructor(){
    super();
    this.state= { fileList: {}};
    this.setUser= this.setUser.bind(this);
    this.getFiles= this.getFiles.bind(this);
  }
  
  setUser(user){
    this.setState({user: user});
  }

  getFiles(files){
    this.setState((state)=>({ fileList: Object.assign(state.fileList,files) }));
  }

  render(){
    return (
      <BrowserRouter>
      <div className='App'>
        <Navbar user={this.state.user}/>
        <Switch>
        <Route path="/" component={()=> <Homepage setUser={this.setUser} user={this.state.user}/>} exact/>
        <Route path="/upload1" component={()=> <Upload1 getFiles={this.getFiles}/>} exact/>
        <Route path="/upload2" component={()=> <Upload2 getFiles={this.getFiles}/>} exact/>
        <Route path="/validate" component={()=> <Validation fileList={this.state.fileList} user={this.state.user}/>} exact/>
        <Route path="/cmap" component={()=> <CultivarsView fileList={this.state.fileList}  user={this.state.user}/>} exact/>
        <Route path="/emap" component={()=> <ExperimentsView fileList={this.state.fileList}  user={this.state.user}/>} exact/>        
        <Route path="/tmap" component={()=> <TreatmentsView fileList={this.state.fileList}  user={this.state.user}/>} exact/>
        <Route path="/success" component={Successpage} exact/>
        <Route path="/error" component={Errorpage} exact/>
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
