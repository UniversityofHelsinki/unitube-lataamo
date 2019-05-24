import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import { BrowserRouter as Router,Route, Redirect } from 'react-router-dom';


const App = (props) => {


  const LATAAMO_DEV = 'https://lataamo-dev.it.helsinki.fi/Shibboleth.sso/Login';

  return (
    <div className="App">

      {/* { <p>Fetching the data from the backend :</p>}
            {props.api.error && <p>{props.api.error}</p>} */}

      <div>
        <h2> Videos</h2>
        <p>REACT_APP_LATAAMO_PROXY_SERVER: {process.env.REACT_APP_LATAAMO_PROXY_SERVER}</p>
        <VideoList />
      </div>

      <Router>
        <h1>Unitube lataamo</h1>
        <Redirect to="/login" />
        <Route path="/login" render={() => window.location.href = LATAAMO_DEV} />
      </Router>
    </div>
  );
};

const mapStateToProps = state => ({
  error : state.vr.error
});

export default connect(mapStateToProps, null)(App);