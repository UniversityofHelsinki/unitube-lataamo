import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import User from './components/User';


const App = () => {
    return (
        <div className="App">

            {/* { <p>Fetching the data from the backend :</p>}
            {props.api.error && <p>{props.api.error}</p>} */}
            <div>
                <User />
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