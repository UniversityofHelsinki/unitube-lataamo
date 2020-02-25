import React from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const VideoTextTrackForm = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    return (
        <div>
            <div className="events-bg">
                <div className="form-group row">
                    <label className="series-title col-sm-10 col-form-label">{translate('video_text_track_label')}</label>
                </div>

                <div className="form-group row">
                    <label id="textTrack" className="col-sm-2 col-form-label">{translate('video_text_track')}</label>
                    <div className="col-sm-8">

                        <form id="upload_text_track_form" encType="multipart/form-data" className="was-validated">
                            <input id="video_text_track_file" type="file" accept=".vtt" className="form-control" name="video_webvtt_file" required/>
                        </form>
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
        </div>
    )
};

const mapStateToProps = state => ({
    i18n: state.i18n
});

export default connect(mapStateToProps, null)(VideoTextTrackForm);