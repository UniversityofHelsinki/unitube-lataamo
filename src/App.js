import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import './stylesheets/layout/app.sass';
import VideoList from './components/VideoList';
import './stylesheets/main.sass';
import LoginRedirect from './components/LoginRedirect';
import Navigation from './components/Navigation';
import { fetchUser } from './actions/userAction';


const App = (props) => {

    useEffect(() => {
        props.onFetchUser();
    }, []);

    const SHIBBOLETH_LOGIN = process.env.REACT_APP_LATAAMO_LOGIN;

    return (
        <div className="container-fluid">
            { props.loggedUser && props.loggedUser.eppn
                ?
                <div>
                    <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
                    <Navigation />
                    <div className="content-wrapper">
                        <VideoList />
                    </div>
                </div>
                : (
                    <div className="container-fluid">
                        {props.apiError ?
                            <p>{props.apiError}</p>
                            : <p>Loading ...</p>}
                        <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
                    </div>
                )
            }
        </div>
    );
};


const mapStateToProps = state => ({
    apiError : state.sr.apiError,
    loggedUser : state.ur.user
});

const mapDispatchToProps = dispatch => ({
    onFetchUser: () => dispatch(fetchUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);