import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionUploadVideoTextFile } from '../actions/eventsAction';

const VideoTextTrackForm = (props) => {
    const [selectedVideoTextFile, setVideoTextFile] = useState(null);

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const handleSubmit = async (event) => {
        event.persist();
        event.preventDefault();
        await uploadVideoTextFile();
    };

    const uploadVideoTextFile = async() => {
        const data = new FormData();
        data.set('videoTextfile', selectedVideoTextFile);
        const result = await props.onUploadVideoTextFile(data);
        return result;
    };

    const handleFileInputChange = (event) => {
        event.persist();
        const videoTextFile = event.target.files[0];
        setVideoTextFile(videoTextFile);
    };


    return (
        <div>
            <form id="upload_text_track_form" encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="events-bg">
                    <div className="form-group row">
                        <label className="series-title col-sm-10 col-form-label">{translate('video_text_track_label')}</label>
                    </div>
                    <div className="form-group row">
                        <label id="textTrack" className="col-sm-2 col-form-label">{translate('video_text_track')}</label>
                        <div className="col-sm-8">
                            <input id="video_text_track_file" onChange={handleFileInputChange} type="file" accept=".vtt" className="form-control" name="video_webvtt_file" required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_text_track_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-12">
                        <button  type="button" className="btn delete-button float-right button-position" >{translate('delete_text_track')}</button>
                        <button  type="submit" className="btn btn-primary float-right button-position mr-1">{translate('save_text_track')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onUploadVideoTextFile : (data) => dispatch(actionUploadVideoTextFile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoTextTrackForm);