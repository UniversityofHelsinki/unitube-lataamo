import React, { useEffect  } from 'react';
import { connect } from 'react-redux';
import { actionRemoveProgressBar } from "../actions/fileUploadAction";

const FileUploadProgressbar = (props) => {

    useEffect(() => {
        props.onRemoveProgressBar(0);
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
    onRemoveProgressBar : (value) => dispatch(actionRemoveProgressBar(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadProgressbar);