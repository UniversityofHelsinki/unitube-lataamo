import React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import languageChangeAction from '../actions/languageChangeAction';


const Language = (props) => {
    props.setInitialLanguage(props.user.preferredLanguage);

    return (
        <div>
            <li className="">
                <button type="button" className={props.user.preferredLanguage === 'fi' ? 'btn btn-outline-secondary mr-1 active' : 'btn btn-outline-secondary mr-1'} onClick={e => props.onLanguageChange(e, 'fi')}>Suomeksi</button>
                <button type="button" className={props.user.preferredLanguage === 'en' ? 'btn btn-outline-secondary mr-1 active' : 'btn btn-outline-secondary mr-1'} onClick={e => props.onLanguageChange(e, 'en')}>Englanniksi</button>
                <button type="button" className={props.user.preferredLanguage === 'sv' ? 'btn btn-outline-secondary mr-1 active' : 'btn btn-outline-secondary mr-1'} onClick={e => props.onLanguageChange(e, 'sv')}>Ruotsiksi</button>
            </li>
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.ur.user
});

const mapDispatchToProps = dispatch => ({
    setInitialLanguage: (lang) => dispatch(setLocale(lang)),
    onLanguageChange: (event, lang) => {
        dispatch(languageChangeAction(lang));
        dispatch(setLocale(lang));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);

