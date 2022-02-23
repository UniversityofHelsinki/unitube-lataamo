import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { fetchSeries } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';
import { FaSpinner } from 'react-icons/fa';
import {
    actionEmptyFileUploadProgressErrorMessage,
    actionEmptyFileUploadProgressSuccessMessage,
    fileUploadProgressAction
} from '../actions/fileUploadAction';
import FileUploadProgressbar from '../components/FileUploadProgressbar';
import routeAction from '../actions/routeAction';
import Constants from '../utils/constants';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { subDays, addDays } from 'date-fns';

const VideoUploadForm = (props) => {

    const [selectedVideoFile, setVideoFile] = useState(null);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [validationMessage, setValidationMessage] = useState(null);
    const [onProgressVisible, setOnProgressVisible]= useState(null);
    const [archivedDate, setArchivedDate] = useState(addDays(new Date(), 365));

    useEffect(() => {
        props.onRouteChange(props.route);
        props.onFetchSeries();
        props.onSuccessMessageClick();
        props.onFailureMessageClick();
        // eslint-disable-next-line
    }, []);// Only re-run the effect if values of arguments changes

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };


    const uploadVideo = async() => {
        //https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
        const data = new FormData();
        data.set('archivedDate', archivedDate);
        data.set('videofile', selectedVideoFile);
        // call unitube-proxy api
        const result = await props.onUploadVideo(data);
        return result;
    };

    const submitButtonStatus = () => submitButtonDisabled || !selectedVideoFile;
    const browseButtonStatus = () => submitButtonDisabled && selectedVideoFile;

    const validateVideoFileLength = (selectedVideoFile, video) => {
        if (selectedVideoFile && selectedVideoFile.size > Constants.MAX_FILE_SIZE_LIMIT) {
            setValidationMessage('input_file_size_exceeded');
            return false;
        } else if (video && video.duration < Constants.MIN_DURATION_IN_SECONDS) {
            setValidationMessage('video_duration_below_one_second');
            return false;
        } else {
            return true;
        }
    };

    const handleSubmit = async (event) => {
        event.persist();
        event.preventDefault();
        setSubmitButtonDisabled(true);
        setOnProgressVisible(true);
        const response = await uploadVideo();
        if (response && response.status) {
            clearVideoFileSelection();
            setSubmitButtonDisabled(false);
        }
        setOnProgressVisible(false);
    };

    const loadVideo = file => new Promise((resolve, reject) => {
        let video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
            resolve(this);
        };

        video.onerror = function () {
            setValidationMessage('invalid_video_format');
        };

        video.src = window.URL.createObjectURL(file);
    });

    const handleFileInputChange = async (event) => {
        event.persist();
        const videoFile = event.target.files[0];
        setValidationMessage(null);
        if(videoFile){
            const video = await loadVideo(videoFile);
            if (video && validateVideoFileLength(videoFile, video)) {
                setVideoFile(videoFile);
                setSubmitButtonDisabled(false);
            } else {
                clearVideoFileSelection();
            }
        }
        props.onResetProgressbar();
    };

    const clearVideoFileSelection = () => {
        let element = document.getElementById('upload_video_form');
        if (element !== null && element.value === '') {
            document.getElementById('upload_video_form').reset();
        }
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
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_datepicker')}</label>
                        <div className="col-sm-8">
                            <DatePicker
                                required
                                showPopperArrow={false}
                                dateFormat="dd.MM.yyyy"
                                selected={archivedDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                includeDateIntervals={[
                                    { start: subDays(addDays(new Date(), 365), 0), end: addDays(new Date(), 1095) },
                                ]}
                                onChange={(date) => setArchivedDate(date)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_datepicker_info')}</Tooltip>}>
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
                    <div hidden={!onProgressVisible} className="col-sm-4">
                        <span>{ translate('upload_in_progress_wait') }<FaSpinner className="icon-spin"></FaSpinner></span>
                        <div hidden={props.timeRemaining === 0 || props.percentage >= 80}>{props.timeRemaining}  { translate('upload_estimate_remaining_in_minutes') }</div>
                        <div hidden={props.percentage < 80}>{ translate('upload_is_being_processed') }</div>
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
    fur: state.fur,
    timeRemaining: state.fur.timeRemaining,
    percentage : state.fur.percentage
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
