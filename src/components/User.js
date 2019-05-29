import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userAction';


const User = (props) => {

    useEffect(() => {
        props.onFetchUser();
    }, []);

    const loggedUser = props.user ? props.user : '';

    return (
        <div>
            <p>Username: {loggedUser.eppn} preferredLanguage: {loggedUser.preferredLanguage}</p>
        </div>
    );
};

const mapStateToProps = state => ({
    user : state.ur.user
});

const mapDispatchToProps = dispatch => ({
    onFetchUser: () => dispatch(fetchUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(User);