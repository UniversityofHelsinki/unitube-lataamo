import React, { useEffect  } from 'react';
import { connect } from 'react-redux';
import { fileUploadProgressAction } from '../actions/fileUploadAction';

const FileUploadProgressbar = (props) => {

    useEffect(() => {
        props.onRemoveProgressBar(); // reset progress when component loads
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Filler percentage={props.percentage} />
        </div>
    );
};

const Filler = (props) => {
    return (
        <div className="progress-bar" style={{ width: `${props.percentage}%` }} >
            <span>{ props.percentage }% Complete</span>
        </div>
    );
};

const mapStateToProps = state => ({
    percentage : state.fur.percentage
});

const mapDispatchToProps = dispatch => ({
    onRemoveProgressBar : () => dispatch(fileUploadProgressAction(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadProgressbar);