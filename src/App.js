import React from 'react';
import { connect } from "react-redux";
import './App.css';
import VideoList from './components/VideoList';


const App = (props) => {
    return (
        <div className="App">

            { <p>Fetching the data from the backend :</p>}
            {props.error && <p>{props.error}</p>}

            <div>
                <h2> All videos</h2>
                <VideoList />
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    error : state.vr.error
});

export default connect(mapStateToProps, null)(App);