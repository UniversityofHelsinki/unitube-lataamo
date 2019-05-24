import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import VideoList from './components/VideoList';
import LoginRedirect from './components/LoginRedirect';


const App = () => {

  const LATAAMO_DEV_LOGIN = 'REPLACE_WITH_VALUE';

  return (
    <div className="App">

      <div>
        <h2> Videos</h2>
        <p>REACT_APP_LATAAMO_PROXY_SERVER: {process.env.REACT_APP_LATAAMO_PROXY_SERVER}</p>
        <VideoList />
      </div>

      <LoginRedirect loginUrl={LATAAMO_DEV_LOGIN} />

    </div>
  );
};


const mapStateToProps = state => ({
  error : state.vr.error
});

export default connect(mapStateToProps, null)(App);