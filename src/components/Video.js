import React from 'react';
import { connect } from 'react-redux';
import { playVideo, getVTTFile } from '../actions/videosAction';
import DownloadVTTFile from './DownloadVTTFile';
import DeleteVTTFile from './DeleteVTTFile';

const Video = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];
    const translate = (key) => {
        return translations ? translations[key] : '';
    };
    const hasVTTFile = (video) => {
        return video.vttFile && video.vttFile.filename && video.vttFile.filename !== 'empty.vtt';
    };
    const getVideoFiles = () => {
        return props.videoFiles.map((video, index) => {
            return (
                <div key={index}>
                    <h2>{translate('video')}</h2>
                    <div key={index} className="row">
                        <div className="col events-bg">
                            <div className="form-group row">
                                <h3 className="events-title margin-top-position col-sm-10 ">{translate('video_preview')}</h3>
                            </div>
                            <div className="embed-responsive embed-responsive-16by9">
                                {video && video.url
                                    ?
                                    <video crossOrigin="anonymous" preload="metadata" controlsList='nodownload' controls onContextMenu={e => e.preventDefault()} src={playVideo(video.url)}>
                                        {
                                            video.vttFile && video.vttFile.url ?
                                                <track id="caption-track" src={getVTTFile(video.vttFile.url)} kind="subtitles"
                                                    srcLang="fi" label={translate('subtitles_on')} default/>
                                                : ''
                                        }
                                    </video>
                                    : <div></div>
                                }
                            </div>
                        </div>
                        <div className="col events-bg">
                            <div className="form-group row">
                                <h3 className="events-title margin-top-position col-sm-10 ">{translate('video_info')}</h3>
                            </div>
                            <div className="form-group row">
                                {translate('video_resolution')}: {video.resolution}
                            </div>
                            <div className="form-group row">
                                {translate('video_duration')}: {video.duration}
                            </div>
                            <div className="form-group row">
                                {translate('video_views')}: {props.event.views}
                            </div>
                            {hasVTTFile(video) ? (
                                <>
                                    <div className="form-group row">
                                        <h3 className="events-title col-sm-12 ">{translate('added_vtt_file')}</h3>
                                        {video.vttFile.filename}
                                    </div>
                                    <div className="form-group row">
                                        <DownloadVTTFile />
                                        <DeleteVTTFile />
                                    </div>
                                </>
                            ) : null}
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
    i18n: state.i18n,
    event: state.er.event
});


export default connect(mapStateToProps, null)(Video);
