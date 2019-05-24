import React from 'react';
import { connect } from "react-redux";
import './App.css';
import VideoList from './components/VideoList';
import {Translate} from 'react-redux-i18n';
import Language from './components/Language';

const App = (props) => {
    return (
        <div className="App">
            <Language />
            <Translate value="hello" />

            {/* { <p>Fetching the data from the backend :</p>}
            {props.api.error && <p>{props.api.error}</p>} */}

            <div>
                <h2> Videos</h2>
                <p>REACT_APP_LATAAMO_PROXY_SERVER: {process.env.REACT_APP_LATAAMO_PROXY_SERVER}</p>
                <VideoList />
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    error : state.vr.error
});

export default connect(mapStateToProps, null)(App);