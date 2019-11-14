import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const getVideoFiles = () => {
        return props.videoFiles.map((video, index) => {
            return (
                <div key={index}>
                    <h2>{translate('video')}</h2>
                    <div key={index} className="row">
                        <div className="col events-bg">
                            <div className="form-group row">
                                <label className="events-title col-sm-10 col-form-label">{translate('video_preview')}</label>
                            </div>
                            <div className="embed-responsive embed-responsive-16by9">
                                {video && video.url
                                    ?
                                    <video controls src={video.url}/>
                                    : <div></div>
                                }
                            </div>
                        </div>
                        <div className="col events-bg">
                            <div className="form-group row">
                                <label className="events-title col-sm-10 col-form-label">{translate('video_info')}</label>
                            </div>
                            <div className="form-group row">
                                {translate('video_resolution')}: {video.resolution}
                            </div>
                            <div className="form-group row">
                                {translate('video_duration')}: {video.duration}
                            </div>
                        </div>
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
    videoFiles : state.vr.videoFiles,
    i18n: state.i18n
});

export default connect(mapStateToProps, null)(Video);
