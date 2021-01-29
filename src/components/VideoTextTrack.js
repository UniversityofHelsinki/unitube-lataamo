import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Alert, Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {
    actionDeleteVideoTextFile,
    actionUploadVideoTextFile,
    setEventProcessingState,
    updateEventList
} from '../actions/eventsAction';
import {downloadFile} from "../actions/videosAction";
import constants from '../utils/constants';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {FiDownload} from "react-icons/fi";

const SweetAlert = withReactContent(Swal);

const VideoTextTrackForm = (props) => {
    const [selectedVideoTextFile, setVideoTextFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoTextFile, hasVideoTextFile] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const translations =  props.i18n.translations[props.i18n.locale];
    const [disabledInputs, setDisabledInputs] = useState(false);

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const createAlert = async () => {
        const result = await SweetAlert.fire({
            title: translate('confirm_delete_vtt_file'),
            text: translate('vtt_file_deletion_info_text'),
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: translate('remove_text_track'),
            cancelButtonText: translate('close_alert')
        });
        return result;
    };

    const showAlert = async () => {
        const result = await createAlert();
        if (result.value && result.value === true) {
            await deleteVideoTextFile();
        }
    };

    const getFileName = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const hasVttVideoFile = () => {
        props.videoFiles.forEach(videoFile => {
            if (videoFile.vttFile && videoFile.vttFile.url && getFileName(videoFile.vttFile.url) !== constants.EMPTY_VTT_FILE_NAME) {
                hasVideoTextFile(true);
            } else {
                hasVideoTextFile(false);
            }
        });
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

    const deleteVideoTextFile = async () => {
        try {
            setDisabledInputs(true);
            await actionDeleteVideoTextFile(props.event.identifier);
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(props.event.identifier) : getUpdatedVideos(props.event.identifier);
            props.onEventDetails(props.inbox, updatedVideos);
            props.onSetEventProcessingState({ ...props.event, processing_state: constants.VIDEO_PROCESSING_INSTANTIATED });
            setSuccessMessage(translate('remove_webvtt_successful'));
        } catch (err) {
            setDisabledInputs(false);
            setErrorMessage(translate('remove_webvtt_failed'));
        }
    };

    const uploadVideoTextFile = async() => {
        const data = new FormData();
        data.set('video_text_track_file', selectedVideoTextFile);
        data.set('eventId', props.event.identifier);
        try {
            await actionUploadVideoTextFile(data);
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(props.event.identifier) : getUpdatedVideos(props.event.identifier);
            props.onEventDetails(props.inbox, updatedVideos);
            props.onSetEventProcessingState({ ...props.event, processing_state: constants.VIDEO_PROCESSING_INSTANTIATED });
            setSuccessMessage(translate('save_webvtt_successful'));
        } catch (err) {
            setDisabledInputs(false);
            setErrorMessage(translate('save_webvtt_failed'));
        }
    };

    const downloadVTTFile = async(event) => {
        event.preventDefault();
        try {
            const fileName = getFileName(props.videoFiles[0].vttFile.url);
            await downloadFile(props.event.identifier, fileName);
        }
        catch (err) {
            setErrorMessage(translate('download_webvtt_failed'));
        }
    };

    useEffect(() => {
        let isDisabled  = props.event.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        hasVttVideoFile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.videoFiles]);// Only re-run the effect if values of arguments changes

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
                            <input disabled={disabledInputs} id="video_text_track_file" onChange={handleFileInputChange} type="file" accept=".vtt, .srt"  className="form-control" name="video_text_track_file"/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_text_track_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                            <a href={translate('text_track_upload_help_link')}>{translate('text_track_upload_help_link_text')}</a>
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-12">
                        <button  type="button" disabled={!videoTextFile || disabledInputs} className="btn delete-button float-right button-position" onClick={showAlert} >{translate('remove_text_track')}</button>
                        <button  type="submit" disabled={disabledInputs} className="btn btn-primary float-right button-position mr-1">{translate('save_text_track')}</button>
                        <button type="submit"  disabled={!videoTextFile || disabledInputs} className="btn btn-primary float-right button-position mr-1" onClick={downloadVTTFile}><FiDownload></FiDownload></button>
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
    inboxVideos : state.er.inboxVideos,
    videoFiles : state.vr.videoFiles
});

const mapDispatchToProps = dispatch => ({
    onSetEventProcessingState: (data) => dispatch(setEventProcessingState(data)),
    onEventDetails: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoTextTrackForm);
