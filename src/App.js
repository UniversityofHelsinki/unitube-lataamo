import React from 'react';
import { connect } from "react-redux";
import './stylesheets/layout/app.sass';
import VideoList from './components/VideoList';
import Header from './components/Header';
import Footer from './components/Footer';
import './stylesheets/main.sass';
import Language from './components/Language';
import User from './components/User';
import LoginRedirect from './components/LoginRedirect';


const App = (props) => {

    const SHIBBOLETH_LOGIN = process.env.REACT_APP_LATAAMO_LOGIN;

    return (
        <div className="container-fluid">
            <Header />
            <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
            <div className="content-wrapper">
            <Language />
            <User />
            {props.apiError && <p>{props.apiError}</p>}
            <VideoList />
            </div>
            <Footer />
        </div>
    );
};


const mapStateToProps = state => ({
    apiError : state.sr.apiError
});

export default connect(mapStateToProps, null)(App);