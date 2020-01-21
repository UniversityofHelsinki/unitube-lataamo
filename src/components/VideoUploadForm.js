import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { fetchSeries } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';
import {
    actionEmptyFileUploadProgressErrorMessage,
    actionEmptyFileUploadProgressSuccessMessage,
    fileUploadProgressAction
} from '../actions/fileUploadAction';
import FileUploadProgressbar from '../components/FileUploadProgressbar';
import routeAction from '../actions/routeAction';
import Constants from '../utils/constants';

const VideoUploadForm = (props) => {

    const [selectedVideoFile, setVideoFile] = useState(null);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [validationMessage, setValidationMessage] = useState(null);

    useEffect(() => {
        props.onRouteChange(props.route);
        props.onFetchSeries();
        props.onSuccessMessageClick();
        props.onFailureMessageClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);// Only re-run the effect if values of arguments changes

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };


    const uploadVideo = async() => {
        //https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
        const data = new FormData();
        data.set('videofile', selectedVideoFile);
        // call unitube-proxy api
        await props.onUploadVideo(data);
    };

    const submitButtonStatus = () => submitButtonDisabled || !selectedVideoFile;
    const browseButtonStatus = () => submitButtonDisabled && selectedVideoFile;

    const validateVideoFileLength = (selectedVideoFile) => {
        if (selectedVideoFile && selectedVideoFile.size > Constants.MAX_FILE_SIZE_LIMIT) {
            setValidationMessage('input_file_size_exceeded');
            return false;
        } else if (selectedVideoFile && selectedVideoFile.size < Constants.MIN_FILE_SIZE_LIMIT) {
            setValidationMessage('input_file_size_below_two_megabytes')
        } else {
            return true;
        }
    };

    const handleSubmit = async (event) => {
        event.persist();
        event.preventDefault();
        setSubmitButtonDisabled(true);
        await uploadVideo();
        clearVideoFileSelection();
        setSubmitButtonDisabled(false);
    };

    const handleFileInputChange = (event) => {
        event.persist();
        const videoFile = event.target.files[0];
        if (validateVideoFileLength(videoFile)) {
            setVideoFile(videoFile);
            setSubmitButtonDisabled(false);
        } else {
            clearVideoFileSelection();
        }
    };

    const clearVideoFileSelection = () => {
        document.getElementById('upload_video_form').reset();
        document.getElementById('video_input_file').value = '';
        setVideoFile('');
    };

    return (
        <div>
            {/* https://getbootstrap.com/docs/4.0/components/alerts/ */}
            {props.fur.updateSuccessMessage !== null ?
                <Alert variant="success" onClose={() => {props.onSuccessMessageClick(); props.onResetProgressbar();}} dismissible>
                    <p>{translate(props.fur.updateSuccessMessage)}</p>
                </Alert>
                : (<></>)
            }
            {props.fur.updateFailedMessage !== null ?
                <Alert variant="danger" onClose={() => props.onFailureMessageClick() } dismissible>
                    <p>{translate(props.fur.updateFailedMessage)}</p>
                </Alert>
                : (<></>)
            }
            {validationMessage !== null ?
                <Alert variant="danger" onClose={() => setValidationMessage(null) } dismissible>
                    <p>{translate(validationMessage)}</p>
                </Alert>
                : (<></>)
            }

            <h2>{translate('video_file_title')}</h2>
            <form id="upload_video_form" encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="events-bg">
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_file')}</label>
                        <div className="col-sm-8">
                            <input disabled={browseButtonStatus()} onChange={handleFileInputChange} id="video_input_file" type="file" accept="video/mp4,video/x-m4v,video/*" className="form-control" name="video_file" required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_file_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12">
                        <FileUploadProgressbar />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-primary" disabled={submitButtonStatus()}>{ translate('upload') }</button>
                    </div>
                </div>
            </form>
        </div>
    );
};


const mapStateToProps = state => ({
    event : state.er.event,
    series : state.ser.series,
    i18n: state.i18n,
    fur: state.fur
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries()),
    onUploadVideo : (data) => dispatch(actionUploadVideo(data)),
    onSuccessMessageClick : () => dispatch(actionEmptyFileUploadProgressSuccessMessage()),
    onFailureMessageClick : () => dispatch(actionEmptyFileUploadProgressErrorMessage()),
    onResetProgressbar: () => dispatch(fileUploadProgressAction(0)),
    onRouteChange: (route) =>  dispatch(routeAction(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploadForm);
