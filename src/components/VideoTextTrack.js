import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionUploadVideoTextFile } from '../actions/eventsAction';

const VideoTextTrackForm = (props) => {
    const [selectedVideoTextFile, setVideoTextFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fur.textFileSuccessMessage]);// Only re-run the effect if values of arguments changes

    const handleSubmit = async (event) => {
        event.persist();
        event.preventDefault();
        await uploadVideoTextFile();
    };

    const uploadVideoTextFile = async() => {
        const data = new FormData();
        data.set('video_webvtt_file', selectedVideoTextFile);
        data.set('eventId', props.event.identifier);
        try {
            await actionUploadVideoTextFile(data);
            setSuccessMessage(translate('save_webvtt_successful'));
        } catch (err) {
            setErrorMessage(translate('failed_to_delete_event'));
        }

    };

    const handleFileInputChange = (event) => {
        event.persist();
        const videoTextFile = event.target.files[0];
        setVideoTextFile(videoTextFile);
    };


    return (
        <div>
            {successMessage !== null ?
                <Alert variant="success" onClose={() => {setSuccessMessage(null);}} dismissible>
                    <p>{successMessage}</p>
                </Alert>
                : (<></>)
            }

            {errorMessage  !== null ?
                <Alert variant="danger" onClose={() => {setErrorMessage(null);}} dismissible>
                    <p>{errorMessage}</p>
                </Alert>
                : (<></>)
            }

            <form id="upload_text_track_form" encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="events-bg">
                    <div className="form-group row">
                        <label className="series-title col-sm-10 col-form-label">{translate('video_text_track_label')}</label>
                    </div>
                    <div className="form-group row">
                        <label id="textTrack" className="col-sm-2 col-form-label">{translate('video_text_track')}</label>
                        <div className="col-sm-8">
                            <input id="video_text_track_file" onChange={handleFileInputChange} type="file"  className="form-control" name="video_webvtt_file" required/>
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
    i18n: state.i18n,
    fur: state.fur,
    event: state.er.event
});

export default connect(mapStateToProps, null)(VideoTextTrackForm);