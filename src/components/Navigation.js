import React from 'react';
import { Link } from 'react-router-dom';
import Language from '../components/Language';
import { Translate } from 'react-redux-i18n';

function Navigation() {

    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-fixed-top navbar-dark bg-dark main-nav">
                <div className="container">
                    <ul className="nav navbar-nav">
                        <li className="nav-item active">
                            <Link to="/" className="nav-link"><Translate value="videos" /></Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/series" className="nav-link"><Translate value="series" /></Link>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav mx-auto">
                        <h2 className='text-white'><Translate value="lataamo"/></h2>
                    </ul>
                    <ul className="nav navbar-nav">
                        <Language />
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navigation;
