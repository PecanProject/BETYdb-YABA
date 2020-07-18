import React from 'react'
import './stylesheets/navbar.css'

const navbar= ()=>{

    const Responsive= ()=>{
        var x = document.getElementById("Link");
        if (x.className === "link") {
        x.className += " responsive";
        x.style.display="flex !important;";
        } else {
        x.className = "link";
        }
        console.log(x);
    }
   
  return (
    <nav className="nav">
        <div className="brand">
            <img src="/bety.png" alt="bety" className='nav-img'></img>
            <span id="brand-txt">BETYdB</span>
        </div>
        <div className= "link" id="Link">
            <div>
                <a href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank"><img src="/pecan.jpeg" alt="PecanProject" className="nav-img"/></a>
            </div>
            <div>
                <span><a href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank">PEcAn Project</a></span>
            </div>
            <div>
                <a href="http://github.com/PecanProject/BETYdb-YABA/" rel="noopener noreferrer" target="_blank"><img src="/gh.svg" alt="Github" className="gh-img"/></a>
            </div>
            <div className="bars" onClick={Responsive}>
                <i className="fa fa-bars"></i>
            </div>
        </div>
    </nav>
    )
}

export default navbar;