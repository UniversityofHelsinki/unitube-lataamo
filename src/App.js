import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import './stylesheets/layout/app.sass';
import VideoList from './components/VideoList';
import SeriesList from './components/SeriesList';
import './stylesheets/main.sass';
import LoginRedirect from './components/LoginRedirect';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchUser } from './actions/userAction';
import { Translate } from 'react-redux-i18n';


const App = (props) => {

    useEffect(() => {
        props.onFetchUser();
    }, []);

    const SHIBBOLETH_LOGIN = process.env.REACT_APP_LATAAMO_LOGIN;

    return (
        <div id="wrapper" className="container-fluid">
            { props.loggedUser && props.loggedUser.eppn
                ?
                <div>
                    <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
                    <Header />
                    <div id="main-content" className="content-wrapper">
                        <Switch>
                            <Route exact path='/' component={VideoList}/>
                            <Route exact path='/series' component={SeriesList}/>
                            <Route path="/series/:id" component={SeriesList} />
                        </Switch>
                    </div>
                </div>
                : (
                    <div className="container-fluid">
                        {props.apiError ?
                            <p>{props.apiError}</p>
                            : <p><Translate value="redirecting"/></p>}
                        <LoginRedirect loginUrl={SHIBBOLETH_LOGIN} />
                    </div>
                )
            }
        <Footer/>
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