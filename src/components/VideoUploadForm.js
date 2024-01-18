import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { fetchSeriesWithOutTrash } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';
import { isAuthorizedToTranslation } from '../actions/userAction';
import { FaSpinner } from 'react-icons/fa';
import {
    actionEmptyFileUploadProgressErrorMessage,
    actionEmptyFileUploadProgressSuccessMessage,
    fileUploadProgressAction
} from '../actions/fileUploadAction';
import FileUploadProgressbar from '../components/FileUploadProgressbar';
import routeAction from '../actions/routeAction';
import Constants from '../utils/constants';
import constants from '../utils/constants';
import DatePicker, { registerLocale } from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { addMonths, addYears, subDays } from 'date-fns';

import { enUS, fi, sv } from 'date-fns/locale';
import { fetchInboxEvents, fetchLicenses } from '../actions/eventsAction';
import WarningMessage from './WarningMessage';

registerLocale('fi', fi);
registerLocale('en', enUS);
registerLocale('sv', sv);

const VideoUploadForm = (props) => {
    const [selectedVideoFile, setVideoFile] = useState(null);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [validationMessage, setValidationMessage] = useState(null);
    const [onProgressVisible, setOnProgressVisible]= useState(null);
    const [archivedDate, setArchivedDate] = useState(addMonths(new Date(), 12));
    const [inputs, setInputs] = useState({ isPartOf: '', description: '', license : '' , title: '', translationLanguage: '', translationModel : '' });

    useEffect(() => {
        props.onFetchLicenses();
        props.onFetchEvents(false);
        props.onRouteChange(props.route);
        props.onFetchSeries();
        props.onSuccessMessageClick();
        props.onFailureMessageClick();
        props.onAuthorizedToTranslation();
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
        data.set('selectedSeries', inputs.isPartOf);
        data.set('description', inputs.description);
        data.set('license', inputs.license);
        data.set('title', inputs.title);
        data.set('translationLanguage', inputs.translationLanguage);
        data.set('translationModel', inputs.translationModel);
        // call unitube-proxy api
        const result = await props.onUploadVideo(data);
        return result;
    };

    const maxAmountOfInboxEvents = () => {
        return props.videos.length >= constants.MAX_AMOUNT_OF_MESSAGES;
    };

    const submitButtonStatus = () => submitButtonDisabled || !selectedVideoFile ||  !inputs.isPartOf || !inputs.description || !inputs.license || !inputs.title;
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
        inputs.description = '';
        inputs.title = '';
        inputs.license = '';
        inputs.isPartOf = '';
        inputs.translationLanguage = '';
        inputs.translationModel = '';
        setOnProgressVisible(false);
        setArchivedDate(addMonths(new Date(), 12));
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

    const getVisibilities = (visibilities) => {
        let visibilityArray = [];
        for (const visibility of visibilities) {
            visibilityArray.push(translate(visibility));
        }
        return '( ' + visibilityArray.join(', ') + ' )';
    };

    const drawSelectionValues = () => {
        let series = [...props.series];
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title} {getVisibilities(series.visibility)}</option>;
        });
    };

    const replaceIllegalCharacters = (target, value) => {
        if (target === 'title' || target === 'description') {
            let regExp = new RegExp(constants.ILLEGAL_CHARACTERS, 'g');
            return value.replace(regExp, '');
        } else {
            return value;
        }
    };

    const replaceCharacter = (replaceStr) => {
        if (replaceStr) {
            return replaceStr.replace(/-/g, '_');
        }
    };

    const getLanguage = (language) => {
        if (language === constants.TRANSLATION_LANGUAGE_FI) {
            return translate('finnish');
        } else if (language === constants.TRANSLATION_LANGUAGE_SV) {
            return translate('swedish');
        } else {
            return translate('english');
        }
    };

    const getModelName = (model) => {
        if (model === constants.TRANSLATION_MODEL_MS_WHISPER) {
            return translate('ms_whisper');
        } else {
            return translate('ms_asr');
        }
    };

    const drawLanguageSelectionValues = () => {
        return constants.TRANSLATION_LANGUAGES.map(language => {
            return <option key={ language } id={ language } value={ language }>{getLanguage(language)}</option>;
        });
    };

    const drawModelSelectionValues = () => {
        return constants.TRANSLATION_MODELS.map(model => {
            return <option key={ model } id={ model } value={ model }>{getModelName(model)}</option>;
        });
    };

    const drawLicenseSelectionValues = () => {
        return props.licenses.map((license) => {
            return <option key={ license } id={ license } value={ license }>{ translate(replaceCharacter(license)) }</option>;
        });
    };

    const handleInputChange = (event) => {
        event.target.value = replaceIllegalCharacters(event.target.name, event.target.value);
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    useEffect(() => { // this hook will get called everytime when inputs has changed
    }, [inputs]);

    const handleSelectionChange = async (event) => {
        handleInputChange(event);

        // Check if translationModel is not defined, then empty translationLanguage
        if (event.target.name === 'translationModel' && event.target.value === '') {
            setInputs((prevInputs) => ({
                ...prevInputs,
                translationLanguage: '',
            }));
        }
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

            <WarningMessage warning={'warning_max_amount_of_messages'} />

            <form id="upload_video_form" encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="events-bg">
                    <div className="form-group row">
                        <h3 className="series-title col-sm-10 margin-top-position col-form-label">{translate('events_basic_info')}</h3>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="video_input_file"
                            className="col-sm-2 col-form-label">{translate('video_file')}</label>
                        <div className="col-sm-8">
                            <input disabled={browseButtonStatus() || maxAmountOfInboxEvents()}
                                onChange={handleFileInputChange} id="video_input_file" type="file"
                                accept="video/mp4,video/x-m4v,video/*" className="form-control" name="video_file"
                                required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={<Tooltip id="tooltip-disabled">{translate('video_file_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="series" className="col-sm-2 col-form-label">{translate('series')}</label>
                        <div className="col-sm-8">
                            <select required className="form-control" name="isPartOf"
                                data-cy="upload-test-event-is-part-of" value={inputs.isPartOf}
                                onChange={handleSelectionChange}>
                                <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                {drawSelectionValues()}
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={<Tooltip id="tooltip-disabled">{translate('series_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled
                                        style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_title')}</label>
                        <div className="col-sm-8">
                            <input type="text" name="title" className="form-control" onChange={handleInputChange}
                                data-cy="upload-test-event-title" placeholder="Title" value={inputs.title}
                                maxLength="150" required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={<Tooltip id="tooltip-disabled">{translate('video_title_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled
                                        style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title"
                            className="col-sm-2 col-form-label">{translate('video_description')}</label>
                        <div className="col-sm-8">
                            <textarea name="description" className="form-control" data-cy="test-video-description"
                                value={inputs.description}
                                onChange={handleInputChange}
                                placeholder={translate('video_description_placeholder')} maxLength="1500"
                                required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip
                                id="tooltip-disabled">{translate('video_description_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled
                                        style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="licenses" className="col-sm-2 col-form-label">{translate('license')}</label>
                        <div className="col-sm-8">
                            <select required className="form-control" data-cy="upload-test-licences-select"
                                name="license" value={inputs.license} onChange={handleSelectionChange}>
                                <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                {drawLicenseSelectionValues()}
                            </select>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={<Tooltip id="tooltip-disabled">{translate('licenses_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled
                                        style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="last_expiry_date"
                            className="col-sm-2 col-form-label">{translate('video_datepicker')}</label>
                        <div className="col-sm-8">
                            <DatePicker
                                id="last_expiry_date"
                                required
                                disabled={maxAmountOfInboxEvents()}
                                locale={props.preferredLanguage}
                                showPopperArrow={false}
                                dateFormat="dd.MM.yyyy"
                                selected={archivedDate}
                                dropdownMode="select"
                                minDate={subDays(addMonths(new Date(), 6), 0)}
                                maxDate={addYears(new Date(), 3)}
                                showMonthYearDropdown
                                onChange={(date) => setArchivedDate(date)}
                            />
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={<Tooltip id="tooltip-disabled">{translate('video_datepicker_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    {props.isAllowedToTranslate && (
                        <div>
                            <div className="form-group row">
                                <h3 className="series-title col-sm-10 margin-top-position col-form-label">{translate('automatic_video_text_track_label')}</h3>
                            </div>
                            <div>
                                <div className="form-group row">
                                    <label htmlFor="translationModel"
                                        className="col-sm-2 col-form-label">{translate('translation_model')}</label>
                                    <div className="col-sm-8">
                                        <select className="form-control" data-cy="upload-test-translation-model-select"
                                            name="translationModel" value={inputs.translationModel}
                                            onChange={handleSelectionChange}>
                                            <option key="-1" id="NOT_SELECTED"
                                                value="">{translate('no_translation_model')}</option>
                                            {drawModelSelectionValues()}
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip
                                            id="tooltip-disabled">{translate('translation_model_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled
                                                    style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="translationLanguages"
                                        className="col-sm-2 col-form-label">{translate('translation_language')}</label>
                                    <div className="col-sm-8">
                                        <select disabled={!inputs.translationModel} className="form-control"
                                            data-cy="upload-test-translation-language-select"
                                            name="translationLanguage"
                                            value={inputs.translationModel ? inputs.translationLanguage : ''}
                                            onChange={handleSelectionChange}>
                                            <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                            {drawLanguageSelectionValues()}
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip
                                            id="tooltip-disabled">{translate('translation_language_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled
                                                    style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <p className="font-weight-bold">{translate('video_upload_info_text')}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12">
                        <FileUploadProgressbar/>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-primary"
                            disabled={submitButtonStatus() || maxAmountOfInboxEvents()}>{translate('upload')}</button>
                    </div>
                    <div hidden={!onProgressVisible} className="col-sm-4">
                        <span>{translate('upload_in_progress_wait')}<FaSpinner className="icon-spin"></FaSpinner></span>
                        <div
                            hidden={props.timeRemaining === 0 || props.percentage >= 80}>{props.timeRemaining} {translate('upload_estimate_remaining_in_minutes')}</div>
                        <div hidden={props.percentage < 80}>{translate('upload_is_being_processed')}</div>
                    </div>
                </div>
            </form>
        </div>
    );
};


const mapStateToProps = state => ({
    event: state.er.event,
    series: state.ser.series,
    i18n: state.i18n,
    fur: state.fur,
    timeRemaining: state.fur.timeRemaining,
    percentage: state.fur.percentage,
    preferredLanguage: state.ur.user.preferredLanguage,
    videos: state.er.inboxVideos,
    licenses: state.er.licenses,
    isAllowedToTranslate: state.ur.isAuthorizedToTranslation
});

const mapDispatchToProps = dispatch => ({
    onFetchLicenses: () => dispatch(fetchLicenses()),
    onFetchEvents: (refresh, inbox) => dispatch(fetchInboxEvents(refresh, inbox)),
    onFetchSeries: () => dispatch(fetchSeriesWithOutTrash()),
    onUploadVideo: (data) => dispatch(actionUploadVideo(data)),
    onSuccessMessageClick: () => dispatch(actionEmptyFileUploadProgressSuccessMessage()),
    onFailureMessageClick: () => dispatch(actionEmptyFileUploadProgressErrorMessage()),
    onResetProgressbar: () => dispatch(fileUploadProgressAction(0)),
    onRouteChange: (route) => dispatch(routeAction(route)),
    onAuthorizedToTranslation: () => dispatch(isAuthorizedToTranslation())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploadForm);
