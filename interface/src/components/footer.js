import React from 'react'
import './stylesheets/footer.css'

const footer=()=>{
    return(
    <footer>
        <div className="part1">
            <div className="f-brand">
                <div>
                    <a href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank"><img src="/pecan.jpeg" alt="PecanProject" className="f-img"/></a>
                </div>
                <div>
                    <span>PEcAn Project</span>
                </div>
            </div>
            <div>
                <p>PEcAn is an integrated ecoinformatics toolbox that consists of a set of scientific workflows
                that wrap around ecosystem models and manage flow of information in and out of models.</p>
            </div>
            <div className="f-link">
                <a href="http://pecanproject.org/" rel="noopener noreferrer" target="_blank">http://pecanproject.org/</a>
                <a href="http://https://github.com/PecanProject/" rel="noopener noreferrer" target="_blank"><img src="/f-gh.svg" alt="Github" className="gh-img"/></a>
                <a href="http://twitter.com/pecanproject" rel="noopener noreferrer" target="_blank"><img src="/f-tw.svg" alt="Github" className="tw-img"/></a>
            </div>
        </div>
        <div className="part2">
            <div>
                <span>Connect with BETYdB database!</span>
            </div>
            <div className="f-link2">
                <a href="http://github.com/PecanProject/BETYdb-YABA/" rel="noopener noreferrer" target="_blank"><img src="/f-gh.svg" alt="Github" className="gh-img"/></a>
                <a href="http://twitter.com/betydatabase" rel="noopener noreferrer" target="_blank"><img src="/f-tw.svg" alt="Github" className="tw-img"/></a> 
            </div>
        </div>
    </footer>
)
}

export default footer;