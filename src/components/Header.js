import React from 'react';
import Language from '../components/Language';
import User from '../components/User';
import Navigation from './Navigation';
import { Translate } from 'react-redux-i18n';

const Header = () => {
    return (
        <>
            <header id="banner" role="banner">
                <div className="topbar">
                    <div className="left-content left">
                        <a href="https://www.helsinki.fi/fi/" target="_blank" rel="noopener noreferrer"><Translate value="hy" /></a>
                    </div>
                    <div className="right-content right">
                        <div className="left user-name">
                            <User />
                        </div>
                        <div className="left language-change">
                            <Language />
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>

                <div className="main-header">
                    <div className="header-left left">
                        <div className="site-title">
                            <div className="logo"> LATAAMO </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
                <div className="clear"></div>
            </header>
            <Navigation />
        </>
    );
};

export default Header;
