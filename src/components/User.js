import React from 'react';
import { connect } from 'react-redux';

const User = (props) => {
    const loggedUser = props.user ? props.user : {};

    return (
        <div>
            Username: {loggedUser.eppn} preferredLanguage: {loggedUser.preferredLanguage}
        </div>
    );
};

const mapStateToProps = state => ({
    user : state.ur.user
});


export default connect(mapStateToProps, null)(User);