import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {
    const getVideoFiles = () => {
        return props.videoFiles.map((video, index) => {
            return (
                <div key={index} className="row">
                    <div className="col">
                        <div className="embed-responsive embed-responsive-16by9">
                            {video && video.url
                                ?
                                <video controls src={video.url}/>
                                : <div></div>
                            }
                        </div>
                    </div>
                    <div className="col">
                        <p></p>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="mb-2 container-fluid">
            {props.videoFiles && props.videoFiles.length > 0
                ?
                getVideoFiles()
                : (
                    <div></div>
                )
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videoFiles : state.vr.videoFiles
});

export default connect(mapStateToProps, null)(Video);
