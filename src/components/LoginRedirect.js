import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const LoginRedirect = (props) => {
  console.log(props);
  if(props.apiError || props.redirect401) {
    window.location.assign(props.loginUrl);
  }
  return null;
};

LoginRedirect.propTypes = {
  loginUrl: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  redirect401 : state.sr.redirect401,
  apiError : state.sr.apiError
});

export default connect(mapStateToProps, null)(LoginRedirect);