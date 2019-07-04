import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {
    return (
        <div className="mb-2 container-fluid">
            {props.video && props.video.url
                ?
                <div className="row">
                    <div className="col">
                        <div className="embed-responsive embed-responsive-16by9">
                            {props.video && props.video.url
                                ?
                                <video controls src={props.video.url}/>
                                : <div></div>
                            }
                        </div>
                    </div>
                    <div className="col">
                        <p>TÄHÄN TULEE VIDEON DETAILIT</p>
                    </div>
                </div> : (
                    <div></div>
                )
            }
        </div>
    );
};

const mapStateToProps = state => ({
    video : state.vr.video
});

export default connect(mapStateToProps, null)(Video);
