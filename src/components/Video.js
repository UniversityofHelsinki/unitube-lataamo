import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {
    return (
        <div className="col-md-6 mx-auto">
            <div className="embed-responsive embed-responsive-16by9">
                { props.video && props.video.url
                    ?
                    <video controls src={props.video.url} />
                    : <div></div>
                }
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    video : state.vr.video
});

export default connect(mapStateToProps, null)(Video);
