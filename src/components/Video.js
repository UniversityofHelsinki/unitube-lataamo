import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {
    return (
        <div className="embed-responsive embed-responsive-16by9">
            { props.video && props.video.url
                ?
                <video width="500" height="500" controls src={props.video.url} />
                : <div></div>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    video : state.vr.video
});

export default connect(mapStateToProps, null)(Video);
