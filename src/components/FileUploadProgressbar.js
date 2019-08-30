import React from 'react';
import { connect } from 'react-redux';

const FileUploadProgressbar = (props) => {
    console.log(props.percentage);

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

export default connect(mapStateToProps, null)(FileUploadProgressbar);