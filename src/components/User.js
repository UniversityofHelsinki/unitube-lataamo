import React from 'react';
import { connect } from 'react-redux';
import { IconContext } from "react-icons";
import { FaUserAlt } from 'react-icons/fa';
import { Translate } from 'react-redux-i18n';

const User = (props) => {
    const loggedUser = props.user ? props.user : {};

    return (
        <React.Fragment>
            <IconContext.Provider value={{ color: "grey", className: "global-class-name" }}>
                <FaUserAlt /> <span>{loggedUser.displayName} | </span>
                <a href="/Shibboleth.sso/Logout"><Translate value="logout" /></a>
            </IconContext.Provider>
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    user : state.ur.user
});


export default connect(mapStateToProps, null)(User);