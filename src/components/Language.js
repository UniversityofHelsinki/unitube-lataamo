import React from 'react';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';


const Language = (props) => {

    props.setInitialLanguage(props.user.preferredLanguage);

    return (
        <div>

            <button onClick={e => props.onLanguageChange(e, 'fi')}>Suomeksi</button>
            <button onClick={e => props.onLanguageChange(e, 'en')}>Englanniksi</button>
            <button onClick={e => props.onLanguageChange(e, 'sv')}>Ruotsiksi</button>
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.ur.user
});

const mapDispatchToProps = dispatch => ({
    setInitialLanguage: (lang) => dispatch(setLocale(lang)),
    onLanguageChange: (event, lang) => dispatch(setLocale(lang))
});

export default connect(mapStateToProps, mapDispatchToProps)(Language);

