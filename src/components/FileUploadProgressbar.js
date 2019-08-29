import React from 'react';
import { connect } from 'react-redux';

const FileUploadProgressbar = (props) => {
    return (
        <div>
            <Filler percentage={props.percentage} />
        </div>
    );
};

const Filler = (props) => {
    const showProgress = () => {
        return parseInt(props.percentage);
    };

    return (
        <div className="progress-bar" style={{ width: `${props.percentage}%` }} >
            <span>{ showProgress() }% Complete</span>
        </div>
    );
};

const mapStateToProps = state => ({
    percentage : state.fur.percentage
});

export default connect(mapStateToProps, null)(FileUploadProgressbar);