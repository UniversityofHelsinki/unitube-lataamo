import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import VideoList from './components/VideoList';
import SeriesList from './components/SeriesList';
import VideoUploadForm from './components/VideoUploadForm';
import SeriesUploadForm from './components/SeriesUploadForm';
import './stylesheets/main.sass';
import LoginRedirect from './components/LoginRedirect';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchUser } from './actions/userAction';
import InboxVideoList from './components/InboxVideoList';
import TrashVideoList from './components/TrashVideoList';

const App = (props) => {

    useEffect(() => {
        props.onFetchUser();
        // eslint-disable-next-line
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
                        <Routes>
                            <Route path='/' element={<InboxVideoList {...props} route={'inbox'}/>}/>
                            <Route path='/events' element={<VideoList {...props} route={'events'}/>}/>
                            <Route path='/series' element={<SeriesList {...props} route={'series'}/>}/>
                            <Route path='/uploadVideo' element={<VideoUploadForm {...props} route={'uploadVideo'}/>}/>
                            <Route path='/uploadSeries' element={<SeriesUploadForm {...props} route={'uploadSeries'}/>}/>
                            <Route path='/trash' element={<TrashVideoList {...props} route={'trash'}/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
                : (
                    <div className="container-fluid">
                        {props.apiError ?
                            <p>{props.apiError}</p>
                            : <div></div>}
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
