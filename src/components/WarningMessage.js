import React from 'react';
import { connect } from 'react-redux';
import constants from '../utils/constants';

const WarningMessage = (props) => {

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const translations = props.i18n.translations[props.i18n.locale];

    return (
        <div>
            {!props.loading && props.videos.length >= constants.MAX_AMOUNT_OF_MESSAGES &&
                <h4 style={{ marginTop: '0px', color: 'red' }} >
                    { translate('warning_max_amount_of_messages') }
                </h4>
            }
        </div>
    );
};


const mapStateToProps = state => ({
    videos: state.er.inboxVideos,
    loading: state.er.loading,
    i18n: state.i18n
});

export default connect(mapStateToProps, null)(WarningMessage);
