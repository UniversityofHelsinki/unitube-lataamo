import React from 'react';
import { connect } from 'react-redux';

const FileUploadProgressbar = (props) => {

    console.log(props.percentage);

    return (
        <div className="progress-bar-container">
            <Filler percentage={props.percentage} />
        </div>
    );
};

const Filler = (props) => {
    return <div className="progress-bar" style={{ width: `${props.percentage}%` }} />;
};

const mapStateToProps = state => ({
    percentage : state.fur.percentage
});

export default connect(mapStateToProps, null)(FileUploadProgressbar);