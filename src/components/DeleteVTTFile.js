import { connect } from 'react-redux';
import { actionDeleteVideoTextFile, setEventProcessingState, updateEventList } from '../actions/eventsAction';
import constants from '../utils/constants';
import SweetAlert from 'sweetalert2';
import { Alert } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { FiTrash } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const DeleteVTTFile = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoTextFile, hasVideoTextFile] = useState(false);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const [deletionProcessStarted, setDeletionProcessStarted] = useState(false);

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const getFileName = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const hasVttVideoFile = () => {
        props.videoFiles.forEach(videoFile => {
            if (videoFile.vttFile && videoFile.vttFile.filename !== constants.EMPTY_VTT_FILE_NAME) {
                hasVideoTextFile(true);
            } else {
                hasVideoTextFile(false);
            }
        });
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

    const showDeleteSuccessMessage = () => {
        SweetAlert.fire({
            title: translate('remove_webvtt_successful_title'),
            text: translate('remove_webvtt_successful'),
            icon: 'success',
            showClass: {
                popup: 'animate__animated animate__backInRight'
            },
            hideClass: {
                popup: 'animate__animated animate__backOutRight'
            },
            width: '300 px',
            toast: true,
            timer: 20000,
            timerProgressBar: true,
            position: 'top-right',
            showConfirmButton: false,
            showCloseButton: true
        });
    };

    useEffect(() => {
        let isDisabled  = props.event.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        hasVttVideoFile();
        // eslint-disable-next-line
    }, [props.videoFiles, props.event]);// Only re-run the effect if values of arguments changes

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
            setDeletionProcessStarted(true);
            const result = await actionDeleteVideoTextFile(props.event.identifier);
            if (result) {
                const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(props.event.identifier) : getUpdatedVideos(props.event.identifier);
                props.onEventDetails(props.inbox, updatedVideos);
                props.onSetEventProcessingState({ ...props.event, processing_state: constants.VIDEO_PROCESSING_INSTANTIATED });
                showDeleteSuccessMessage();
                setDeletionProcessStarted(false);
            }
        } catch (err) {
            console.log(err);
            setErrorMessage(translate('remove_webvtt_failed'));
        }
    };
    const showAlert = async () => {
        const result = await createAlert();
        if (result.value && result.value === true) {
            await deleteVideoTextFile();
        }
    };

    return (
        <div>
            {errorMessage !== null ?
                <Alert variant="danger" onClose={() => {
                    setErrorMessage(null);
                }} dismissible>
                    <p>{errorMessage}</p>
                </Alert>
                : (<></>)
            }
            <button type="button" disabled={!videoTextFile || disabledInputs}
                className="btn delete-button float-right button-position"
                onClick={showAlert}>{translate('remove_text_track')}<FiTrash></FiTrash>
                {deletionProcessStarted ? (
                    <>
                        <FaSpinner
                            className="icon-spin"/>
                    </>
                ) : (
                    <></>
                )}
            </button>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    videoFiles: state.vr.videoFiles,
    event: state.er.event,
});

const mapDispatchToProps = dispatch => ({
    onSetEventProcessingState: (data) => dispatch(setEventProcessingState(data)),
    onEventDetails: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});


export default connect(mapStateToProps, mapDispatchToProps)(DeleteVTTFile);
