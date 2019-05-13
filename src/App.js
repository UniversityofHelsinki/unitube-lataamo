import React, { useEffect } from 'react';
import { connect } from "react-redux";
import rotateAction from "./actions/rotateAction";
import {fetchVideos} from './actions/apiAction';
import './App.css';
import VideoList from './components/VideoList';


const App = (props) => {
    
    // https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        props.onFetchVideos();
    }, []);


    return (
        <div className="App">

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
    ...state
});

const mapDispatchToProps = dispatch => ({
    rotateAction: (payload) => dispatch(rotateAction(payload)),
    onFetchVideos: () => dispatch(fetchVideos())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);