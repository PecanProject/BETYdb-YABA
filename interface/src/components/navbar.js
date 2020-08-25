import React from 'react'
import './stylesheets/navbar.css'

const navbar= ()=>{
   
  return (
    <nav className="nav">
        <div className="brand">
            <img src="/bety.png" alt="bety" className='nav-img'></img>
            <span id="brand-txt">BETYdB</span>
        </div>
        <div className= "link" id="Link">
            <div>
                <a data-testid="Pecan-img" href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank"><img src="/pecan.jpeg" alt="PEcAn Project logo" className="nav-img"/></a>
            </div>
            <div>
                <span><a data-testid="Pecan-site" href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank">PEcAn Project</a></span>
            </div>
            <div>
                <a data-testid="BETYdb-github" href="http://github.com/PecanProject/BETYdb-YABA/" rel="noopener noreferrer" target="_blank"><img src="/gh.svg" alt="Github" className="gh-img"/></a>
            </div>
        </div>
    </nav>
    )
}

export default navbar;
