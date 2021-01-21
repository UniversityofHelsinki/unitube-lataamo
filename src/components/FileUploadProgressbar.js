import React, { useEffect  } from 'react';
import { connect } from 'react-redux';
import { fileUploadProgressAction } from '../actions/fileUploadAction';

const FileUploadProgressbar = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];
    const translate = (key) => {
        return translations ? translations[key] : '';
    };
    useEffect(() => {
        props.onRemoveProgressBar(); // reset progress when component loads
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <div className="progress-bar" style={{ width: `${props.percentage}%` }} >
                <span hidden={props.percentage === 0 || props.percentage >= 80}>{ props.percentage }{ translate('percentage_complete') } </span>
                <span hidden={props.percentage === 0 || props.percentage < 80 || props.percentage === 100 }>{ props.percentage }{ translate('percentage_complete') } { translate('upload_is_being_processed') } </span>
                <span hidden={props.percentage === 0 || props.percentage < 100}>{props.percentage}% </span>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    percentage : state.fur.percentage,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onRemoveProgressBar : () => dispatch(fileUploadProgressAction(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadProgressbar);
