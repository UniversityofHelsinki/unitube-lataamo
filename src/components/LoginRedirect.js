import React from 'react';
import { BrowserRouter as Router,Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const LoginRedirect = (props) => {

  console.log('LoginRedirect', props);

  // TODO check this
  //   if(props.redirect401){
  //     return(
  //       <Router>
  //         <Redirect to="/login" />
  //         <Route path="/login" render={() => window.location.href = props.loginUrl} />
  //       </Router>
  //     );
  //   }
  console.log('LoginRedirect EKA KERTA', props);
  return null;
};

LoginRedirect.propTypes = {
  loginUrl: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  redirect401 : state.sr.redirect401
});

export default connect(mapStateToProps, null)(LoginRedirect);