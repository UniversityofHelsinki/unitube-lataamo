import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import LoginRedirect from './components/LoginRedirect';


const App = (props) => {

    const LATAAMO_DEV_LOGIN = 'https://lataamo-dev.it.helsinki.fi/Shibboleth.sso/Login';

    return (
        <div className="App">
            <div>
                {props.apiError && <p>{props.apiError}</p>}
                <h2> Videos</h2>
                <p>REACT_APP_LATAAMO_PROXY_SERVER: {process.env.REACT_APP_LATAAMO_PROXY_SERVER}</p>
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