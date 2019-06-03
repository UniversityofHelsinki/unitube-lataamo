import React from 'react';
import Language from '../components/Language';
import User from '../components/User';

function Navigation() {

    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-fixed-top navbar-dark bg-dark main-nav">
                <div className="container">
                    <ul className="nav navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Download</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Register</a>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav mx-auto">
                        <li className="nav-item"><a className="nav-link" href="#">Website Name</a></li>
                    </ul>
                    <ul className="nav navbar-nav">
                        <Language/>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;
