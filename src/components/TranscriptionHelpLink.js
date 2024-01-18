import constants from '../utils/constants';
import React from 'react';
import { connect } from 'react-redux';

const TranscriptionHelpLink = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };
    const transcriptionHelpLinkElement = (link, colSmX, linkText) => {
        return <a href={link} id="transcriptionHelpLink" target="_blank" rel="noreferrer" className={`${colSmX} col-form-label`}>{linkText}</a>;
    };
    return (
        <div>
            <label htmlFor="transcriptionHelpLink"></label>
            {transcriptionHelpLinkElement(translate('transcription_help_link'), 'col-sm-4', translate('transcription_help_link_text'))}
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
});


export default connect(mapStateToProps, null)(TranscriptionHelpLink);
