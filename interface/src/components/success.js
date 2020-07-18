import React from 'react';
import './stylesheets/success.css';

const Successpage = ()=>{
    return(
        <div className="success-content">
            <div className="success-box">
                <div>
                    <img src="/tick.png" alt="success" className="bg-svg"></img>
                </div>
                <div>
                    <span id="message">
                        <center>Thank You!
                        <p>Your Metadata has beeen succesfully uploaded. You are ready to upload the field data and run HTP pipeline.</p></center>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Successpage;