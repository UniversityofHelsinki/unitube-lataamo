import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionUploadVideoTextFile, setEventProcessingState, updateEventList } from '../actions/eventsAction';
import constants from '../utils/constants';

const VideoTextTrackForm = (props) => {
    const [selectedVideoTextFile, setVideoTextFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const translations =  props.i18n.translations[props.i18n.locale];
    const [disabledInputs, setDisabledInputs] = useState(false);

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const handleSubmit = async (event) => {
        if (event) {
            setDisabledInputs(true);
            event.persist();
            event.preventDefault();
            await uploadVideoTextFile();
        }
    };

    const getUpdatedInboxVideos = (eventId) => {
        if (props.inboxVideos && props.inboxVideos.length > 0) {
            return props.inboxVideos.map(event => event.identifier !== eventId ? event : {
                ...event,
                processing_state : constants.VIDEO_PROCESSING_INSTANTIATED
            });
        }
    };

    const getUpdatedVideos = (eventId) => {
        if (props.videos && props.videos.length > 0) {
            return props.videos.map(event => event.identifier !== eventId ? event : {
                ...event,
                processing_state : constants.VIDEO_PROCESSING_INSTANTIATED
            });
        }
    };

    const uploadVideoTextFile = async() => {
        const data = new FormData();
        data.set('video_webvtt_file', selectedVideoTextFile);
        data.set('eventId', props.event.identifier);
        try {
            await actionUploadVideoTextFile(data);
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(props.event.identifier) : getUpdatedVideos(props.event.identifier);
            props.onEventDetails(props.inbox, updatedVideos);
            props.onSetEventProcessingState({ ...props.event, processing_state: constants.VIDEO_PROCESSING_INSTANTIATED });
            setSuccessMessage(translate('save_webvtt_successful'));
        } catch (err) {
            setErrorMessage(translate('failed_to_delete_event'));
        }
    };

    useEffect(() => {
        let isDisabled  = props.event.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);// Only re-run the effect if values of arguments changes

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
                            <input disabled={disabledInputs} id="video_text_track_file" onChange={handleFileInputChange} type="file"  className="form-control" name="video_webvtt_file" required/>
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
                        <button  type="button" disabled={disabledInputs} className="btn delete-button float-right button-position" >{translate('delete_text_track')}</button>
                        <button  type="submit" disabled={disabledInputs} className="btn btn-primary float-right button-position mr-1">{translate('save_text_track')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    fur: state.fur,
    event: state.er.event,
    videos : state.er.videos,
    inboxVideos : state.er.inboxVideos
});

const mapDispatchToProps = dispatch => ({
    onSetEventProcessingState: (data) => dispatch(setEventProcessingState(data)),
    onEventDetails: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoTextTrackForm);