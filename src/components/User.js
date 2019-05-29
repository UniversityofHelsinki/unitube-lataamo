import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userAction';


const User = (props) => {

    useEffect(() => {
        props.onFetchUser();
    }, []);

    const content = props.user ? props.user : '';

    return (
        <div>
            <p>Username: {content.eppn} preferredLanguage: {content.preferredLanguage}</p>
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