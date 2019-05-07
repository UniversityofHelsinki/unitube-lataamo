import React, { useEffect } from 'react';
import { connect } from "react-redux";
import rotateAction from "./actions/rotateAction";
import {fetchData} from './actions/apiAction';
import logo from './logo.svg';
import './App.css';


const App = (props) => {

    // https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        props.onFetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img
                    src={logo}
                    className={
                        "App-logo" +
                        (props.rotate.rotating ? "":" App-logo-paused")
                    }
                    alt="logo"
                />
                <button className="rotate-button" onClick={() => props.rotateAction(!props.rotate.rotating)} >{props.rotate.rotating ? "STOP ROTATE" : "START ROTATE"}</button>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p>Fetching the data from the backend :</p>
                    {props.api.error && <p>{props.api.error}</p>}
                    {props.api.helloPayload && <p>{props.api.helloPayload.message}</p>}
            </header>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    rotateAction: (payload) => dispatch(rotateAction(payload)),
    onFetchData: () => dispatch(fetchData())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);