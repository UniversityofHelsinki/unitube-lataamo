import React from 'react';
import { connect } from 'react-redux';

const Video = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const getFileName = (url) => {
        // console.log(url);
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const getTrackObjectUrl = (track) => {
        // console.log('track content:' , track);
        const trackBlob = new Blob([track], {
            type:'text/plain;charset=utf-8'
        });
        const trackObjectUrl = URL.createObjectURL(trackBlob);
        return trackObjectUrl;
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
                                    <video controls onContextMenu={e => e.preventDefault()} src={video.url}>
                                        {
                                            video.vttFile && video.vttFile.track ?
                                                <track id="caption-track" src={getTrackObjectUrl(video.vttFile.track)} kind="subtitles" srcLang="fi" label="Suomi" default/>
                                                : ''
                                        }
                                    </video>
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
                            <div className="form-group row" data-cy="test-video-text-track">
                                {translate('added_vtt_file')} : {video.vttFile && video.vttFile.url && getFileName(video.vttFile.url) !== 'empty.vtt' ? getFileName(video.vttFile.url)  : ''}
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
