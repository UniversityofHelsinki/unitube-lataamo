import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import { Translate } from 'react-redux-i18n';
import languageChangeAction from '../actions/languageChangeAction';

const Language = (props) => {

    useEffect(() => {
        if (props.user && props.user.preferredLanguage) {
            props.setInitialLanguage(props.user.preferredLanguage);
        } else {
            props.setInitialLanguage('fi');
        }
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            <button className={props.user.preferredLanguage === 'fi' ? 'hidden' : 'lang-opt'}>
                <Link to="#" className='lang-opt' onClick={() => props.onLanguageChange( 'fi')}><Translate value="finnish" /></Link>
            </button>
            <button className={props.user.preferredLanguage === 'sv' ? 'hidden' : 'lang-opt'}>
                <Link to="#" className='lang-opt' onClick={() => props.onLanguageChange('sv')}><Translate value="swedish" /></Link>
            </button>
            <button className={props.user.preferredLanguage === 'en' ? 'hidden' : 'lang-opt'} >
                <Link to="#"  className='lang-opt' onClick={() => props.onLanguageChange( 'en')}><Translate value="english" /></Link>
            </button>
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
