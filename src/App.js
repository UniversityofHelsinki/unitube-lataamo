import React from 'react';
import { connect } from "react-redux";
import './App.css';
import VideoList from './components/VideoList';
import Header from './components/Header';
import Footer from './components/Footer';
import './stylesheets/main.sass';


const App = (props) => {
    return (
        <div className="App">
            <Header />
            <div className="content-wrapper">
                <h2> Videos</h2>
                <p>REACT_APP_LATAAMO_PROXY_SERVER: {process.env.REACT_APP_LATAAMO_PROXY_SERVER}</p>
                <VideoList />
            </div>
            <Footer />
        </div>
    );
}

const mapStateToProps = state => ({
    error : state.vr.error
});

export default connect(mapStateToProps, null)(App);