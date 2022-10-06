import React from "react";
import { Link } from "react-router-dom";

import '../styles/Error.css';
import notFound from '../images/404.png' 



class Error extends React.Component {  
    render() {
        return(
            <div className="error-page">
                <div className="error-content">
                    <img src={notFound} alt="page not found" />
                        <h1 style={ { 'fontWeight': '500' } }>
                            Sorry, there seems to be a problem
                        </h1>
                        <h1 style={ { 'fontWeight': '700' } }>
                            PAGE NOT FOUND
                        </h1>
                    <Link to='/'>
                        <button>
                            Back to Homepage
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Error;