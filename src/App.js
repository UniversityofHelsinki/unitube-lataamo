import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import Language from './components/Language';
import User from './components/User';
import LoginRedirect from './components/LoginRedirect';


const App = (props) => {

    const SHIBBOLETH_LOGIN = process.env.REACT_APP_LATAAMO_LOGIN;

    return (
        <div className="App">
            <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
            <Language />
            <User />
            {props.apiError && <p>{props.apiError}</p>}
            <VideoList />
        </div>
    );
};


const mapStateToProps = state => ({
    apiError : state.sr.apiError
});

export default connect(mapStateToProps, null)(App);