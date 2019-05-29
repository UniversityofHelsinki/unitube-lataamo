import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import Language from './components/Language';
import User from './components/User';
import LoginRedirect from './components/LoginRedirect';


const App = (props) => {

    const LATAAMO_DEV_LOGIN = 'https://lataamo-dev.it.helsinki.fi/Shibboleth.sso/Login';

    return (
        <div className="App">
            <Language />
            {props.apiError && <p>{props.apiError}</p>}
            <div>
                <User />
                <VideoList />
            </div>

            <LoginRedirect loginUrl={LATAAMO_DEV_LOGIN} />

        </div>
    );
};


const mapStateToProps = state => ({
    apiError : state.sr.apiError
});

export default connect(mapStateToProps, null)(App);