import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import languageChangeAction from '../actions/languageChangeAction';

const Language = (props) => {

    useEffect(() => {
        if(props.user && props.user.preferredLanguage) {
            props.setInitialLanguage(props.user.preferredLanguage);
        } else {
            props.setInitialLanguage('fi');
        }
    }, []);

    return (
        <React.Fragment>
            <li className={props.user.preferredLanguage === 'fi' ? 'nav-item active' : 'nav-item'}>
                <Link to="#" className='nav-link' onClick={() => props.onLanguageChange( 'fi')}>Suomeksi</Link>
            </li>
            <li className={props.user.preferredLanguage === 'en' ? 'nav-item active' : 'nav-item'}>
                <Link to="#"  className='nav-link' onClick={() => props.onLanguageChange( 'en')}>In English</Link>
            </li>
            <li className={props.user.preferredLanguage === 'sv' ? 'nav-item active' : 'nav-item'}>
                <Link to="#" className='nav-link' onClick={() => props.onLanguageChange('sv')}>På svenska</Link>
            </li>
        </React.Fragment>
    );
};

const mapStateToProps = state => ({
    user: state.ur.user
});

const mapDispatchToProps = dispatch => ({
    setInitialLanguage: (lang) => dispatch(setLocale(lang)),
    onLanguageChange: (lang) => {
        dispatch(languageChangeAction(lang));
        dispatch(setLocale(lang));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);

