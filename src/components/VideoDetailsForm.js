import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import VideoTextTrackForm from './VideoTextTrack';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionMoveEventToTrashSeries, actionUpdateEventDetails, updateEventList, actionUpdateDeletionDate } from '../actions/eventsAction';
import { fetchSerie } from '../actions/seriesAction';
import Video from './Video';
import constants from '../utils/constants';
import { IconContext } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addYears, addMonths } from 'date-fns';
import { fi, sv, enUS } from 'date-fns/locale';
registerLocale('fi', fi);
registerLocale('en', enUS);
registerLocale('sv', sv);


const SweetAlert = withReactContent(Swal);

const VideoDetailsForm = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.video);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const [disabledSubmit, setDisabledSubmit] = useState(false);
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [deletionDate, setDeletionDate] = useState(null);
    const [showLink, setShowLink] = useState(false);
    const [invalidSerie, setInvalidSerie] = useState(false);
    const [selectedSerie, setSelectedSerie] = useState(props.selectedSerie);

    const toggleHover = () => {
        setHovered(!hovered);
    };

    const copyEventIdToClipboard = (event) => {
        event.preventDefault();
        event.persist();
        copyTextToClipboard('eventId');
        setSuccessMessage(translate('video_id_copied_to_clipboard'));
    };

    const copyEmbeddedEventToClipboard = (event) => {
        event.preventDefault();
        event.persist();
        copyTextToClipboard('embeddedVideo');
        setSuccessMessage(translate('embedded_video_copied_to_clipboard'));
    };

    const copyToClipboard = ({ elementId, successMessage }) => {
        return (event) => {
            event.preventDefault();
            event.persist();
            copyTextToClipboard(elementId);
            setSuccessMessage(translate(successMessage));
        };
    };

    const copyTextToClipboard = (id) => {
        let copyText = document.getElementById(id).innerText;
        let element = document.createElement('input');
        document.body.appendChild(element);
        element.value = copyText;
        element.select();
        //for mobile devices
        element.setSelectionRange(0,99999);
        document.execCommand('copy');
        element.remove();
    };

    const getUpdatedInboxVideos = (eventId, updatedEvent) => {
        if (props.inboxVideos && props.inboxVideos.length > 0) {
            return props.inboxVideos.map(event => event.identifier !== eventId ? event : {
                ...event,
                title: updatedEvent.title,
                processing_state : constants.VIDEO_PROCESSING_INSTANTIATED
            });
        }
    };

    const getUpdatedVideos = (eventId, updatedEvent) => {
        if (props.videos && props.videos.length > 0) {
            return props.videos.map(event => event.identifier !== eventId ? event : {
                ...event,
                title: updatedEvent.title,
                processing_state : constants.VIDEO_PROCESSING_INSTANTIATED
            });
        }
    };

    const moveEventToTrashSeries = async() => {
        const eventId = inputs.identifier;
        const deletedEvent = { ...inputs }; // values from the form
        try {
            await actionMoveEventToTrashSeries(eventId, deletedEvent);
            showSuccessMessage();
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(eventId, deletedEvent) : getUpdatedVideos(eventId, deletedEvent);
            props.onEventDetailsEdit(props.inbox, updatedVideos);
        } catch (err) {
            setErrorMessage(translate('failed_to_delete_event'));
        }
    };

    const updateEventDetails = async() => {
        props.video.processing_state = constants.VIDEO_PROCESSING_INSTANTIATED;
        const eventId = inputs.identifier;
        const updatedEvent = { ...inputs }; // values from the form
        const updatedDeletionDate = { deletionDate : deletionDate };
        // call unitube-proxy api
        try {
            await actionUpdateDeletionDate(eventId, updatedDeletionDate);
            await actionUpdateEventDetails(eventId, updatedEvent);
            showUpdateSuccessMessage();
            // update the eventlist to redux state
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(eventId, updatedEvent) : getUpdatedVideos(eventId, updatedEvent);
            props.onEventDetailsEdit(props.inbox, updatedVideos);
        } catch (err) {
            setDisabledInputs(false);
            setErrorMessage(translate('failed_to_update_event_details'));
        }
    };
    useEffect(() => {
        let isDisabled  = props.video.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        if (!isBeingEdited) {
            setInputs(props.video);
        }
        if (props.deletionDate) {
            setDeletionDate(new Date(props.deletionDate));
        }
        // eslint-disable-next-line
    }, [props.video, props.series, props.inbox]);

    const embedVideo = () => {
        let targetElement = document.getElementById('embeddedVideo');
        if(targetElement){
            targetElement.innerText='<iframe ' +
                'src="https://unitube.it.helsinki.fi/unitube/embed.html?id='+ props.video.identifier +'" ' +
                'scrolling="no" allowfullscreen="true" frameBorder="0" marginHeight="0px" marginWidth="0px" height="360" width="640"></iframe>';
        }
    };

    const deleteEvent = async () => {
        setDisabledInputs(true);
        await moveEventToTrashSeries();
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            setDisabledInputs(true);
            await updateEventDetails();
        }
    };

    const replaceIllegalCharacters = (target, value) => {
        if (target === 'title' || target === 'description') {
            let regExp = new RegExp(constants.ILLEGAL_CHARACTERS, 'g');
            return value.replace(regExp, '');
        } else {
            return value;
        }
    };

    const handleInputChange = (event) => {
        event.target.value = replaceIllegalCharacters(event.target.name, event.target.value);
        event.persist();
        setIsBeingEdited(true);
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const handleSelectionChange = async (event) => {
        handleInputChange(event);
        const seriesId = event.target.value;
        await props.fetchSerie(seriesId);
    };

    useEffect(() => {
        if (props.video.series) {
            setInvalidSerie(selectedSerie.identifier !== props.video.series.identifier && selectedSerie.eventsCount >= constants.MAX_AMOUNT_OF_MESSAGES);
        }
    }, [selectedSerie]);

    useEffect(() => {
        setSelectedSerie(props.video.series);
    }, [props.video]);

    useEffect(() => {
        setSelectedSerie(props.selectedSerie);
    }, [props.selectedSerie]);

    const drawSelectionValues = () => {
        let series = [...props.series];
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const drawLicenseSelectionValues = () => {
        return props.video.licenses.map((license) => {
            return <option key={ license } id={ license } value={ license }>{ translate(replaceCharacter(license)) }</option>;
        });
    };

    const replaceCharacter = (replaceStr) => {
        if (replaceStr) {
            return replaceStr.replace(/-/g, '_');
        }
    };

    const inboxSeries = (seriesName) => {
        if (seriesName && seriesName.toLowerCase().includes('inbox')) {
            return (
                <div className='col'>
                    <p>
                        {translate('events_link_series')}
                    </p>
                </div>
            );
        }
    };

    const createAlert = async () => {
        const result = await SweetAlert.fire({
            title: translate('confirm_delete_event'),
            text: translate('event_deletion_info_text'),
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#d33',
            confirmButtonText: translate('delete_event'),
            cancelButtonText: translate('close_alert'),
            customClass: {
                popup: 'test-delete-event-pop-up',
                confirmButton: 'test-delete-event-confirm-button',
                cancelButton: 'test-delete-event-cancel-button',
            }
        });
        return result;
    };

    const showSuccessMessage = () => {
        SweetAlert.fire({
            title: translate('succeeded_to_delete_event'),
            text: translate('succeeded_to_delete_event'),
            icon: 'success',
            customClass: {
                confirmButton: 'test-delete-event-success-confirm-button',
            }
        });
    };
    const showUpdateSuccessMessage = () => {
        SweetAlert.fire({
            title: translate('succeeded_to_update_event_title'),
            text: translate('succeeded_to_update_event'),
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

    const showAlert = async () => {
        const result = await createAlert();
        if (result.value && result.value === true) {
            await deleteEvent();
        }
    };

    useEffect(() => {
        if (props.video && props.video.visibility) {
            setShowLink(props.video.visibility.filter(v => [constants.STATUS_PUBLISHED, constants.STATUS_UNLISTED].includes(v)).length > 0);
        }
    }, [props.video]);

    const publishedLink = props.video && `${process.env.REACT_APP_KATSOMO_PUBLISHED_LINK_URL}${props.video.identifier}`;
    const unlistedLink = props.video && `${process.env.REACT_APP_KATSOMO_UNLISTED_LINK_URL}${props.video.identifier}`;

    const hasStatus = (status) => {
        return props.video && props.video.visibility && props.video.visibility.includes(status);
    };

    const linkElement = (link, colSmX) => {
        return <a href={link} id="videoLink" target="_blank" rel="noreferrer" className={`${colSmX} col-form-label`}>{link}</a>;
    };

    return (
        <div>
            <Video/>
            {props.video && props.video.identifier !== undefined
                ?
                <div>
                    <VideoTextTrackForm inbox={props.inbox} />
                    <form onSubmit={handleSubmit} className="was-validated">
                        <div className="events-bg">
                            <div className="form-group row">
                                <h3 className="series-title col-sm-10 margin-top-position col-form-label">{translate('events_basic_info')}</h3>
                            </div>
                            {inboxSeries(props.video.series.title)}
                            <div className="form-group row">
                                <label htmlFor="eventId" className="col-sm-2 col-form-label">{translate('event_id')} LLL</label>
                                <label id="eventId" className="col-sm-3 col-form-label" data-cy="test-event-id">{props.video.identifier}</label>
                                <div className="col-sm-3">
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <div>
                                            <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyEventIdToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                        </div>
                                    </IconContext.Provider>
                                </div>
                            </div>
                            { showLink &&
                            <div className="form-group row">
                                <label htmlFor="videoLink" className="col-sm-2 col-form-label">{translate('video_link')}</label>
                                {(hasStatus(constants.STATUS_PUBLISHED) && linkElement(publishedLink, 'col-sm-6')) || (hasStatus(constants.STATUS_UNLISTED) && linkElement(unlistedLink, 'col-sm-7'))}
                                <div className={(hasStatus(constants.STATUS_PUBLISHED) ? 'col-sm-2' : 'col-sm-1')}>
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <div>
                                            <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyToClipboard({ elementId: 'videoLink', successMessage: 'video_link_copied_to_clipboard' }) } >{translate('copy_to_clipboard')}</FiCopy>
                                        </div>
                                    </IconContext.Provider>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_link_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            }
                            <div className="form-group row">
                                <label htmlFor="series" className="col-sm-2 col-form-label">{translate('series')}</label>
                                <div className="col-sm-8">
                                    <select disabled={disabledInputs} required className="form-control" name="isPartOf"
                                        data-cy="test-event-is-part-of" value={inputs.isPartOf} onChange={handleSelectionChange}>
                                        {drawSelectionValues()}
                                    </select>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            { invalidSerie &&
                            <div className="form-group row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-8">
                                    <span style={{ color: 'red' }}>{translate('selected_serie_video_limit_exceeded')}</span>
                                </div>
                            </div>
                            }
                            <div className="form-group row">
                                <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_title')}</label>
                                <div className="col-sm-8">
                                    <input id="title" disabled={disabledInputs} type="text" name="title" className="form-control" onChange={handleInputChange}
                                        data-cy="test-event-title" placeholder="Title" value={inputs.title} maxLength="150" required/>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_title_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="description" className="col-sm-2 col-form-label">{translate('video_description')}</label>
                                <div className="col-sm-8">
                                    <textarea id="description" disabled={disabledInputs} name="description" className="form-control" data-cy="test-video-description" value={inputs.description}
                                        onChange={handleInputChange} placeholder={translate('video_description_placeholder')} maxLength="1500" required/>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_description_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="exprdate"  className="col-sm-2">{translate('deletion_date_title')}</label>
                                <div className="col-sm-8">
                                    <DatePicker id="exprdate"
                                        disabled={disabledInputs}
                                        required
                                        dateFormat="dd.MM.yyyy"
                                        locale={props.preferredLanguage}
                                        showPopperArrow={false}
                                        minDate={addMonths(new Date(), 6)}
                                        maxDate={addYears(new Date(), 3)}
                                        showMonthYearDropdown
                                        dropdownMode="select"
                                        selected={deletionDate}
                                        onChange={(date) => setDeletionDate(date)}/>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('deletion_date_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="licenses" className="col-sm-2 col-form-label">{translate('license')}</label>
                                <div className="col-sm-8">
                                    <select id="licenses" disabled={disabledInputs} required className="form-control" data-cy="test-licences-select" name="license" value={inputs.license} onChange={handleInputChange}>
                                        <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                        {drawLicenseSelectionValues()}
                                    </select>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('licenses_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-2">
                                    <a href={translate('licence_link')}>{translate('licence_link_text')}</a>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-2"></div>
                                <div className="col-sm-8">
                                    <p className="licence-long-info">{translate(replaceCharacter(inputs.license) + '_long_info')}</p>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2">{translate('embedded_video_title')}</label>
                                <div id='embeddedVideo' className="col-sm-7 embeddedVideo" data-cy="test-embedded-video">
                                    {embedVideo()}
                                </div>
                                <div className="col-sm-1">
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <div>
                                            <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyEmbeddedEventToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                        </div>
                                    </IconContext.Provider>
                                </div>
                                <div className="col-sm-2">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('embedded_video_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                {/* https://getbootstrap.com/docs/4.0/components/alerts/ */}
                                {successMessage !== null ?
                                    <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                                        <p>
                                            {successMessage}
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                {errorMessage !== null ?
                                    <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                                        <p>
                                            {errorMessage}
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                <button disabled={disabledInputs} type="button" className="btn delete-button float-right button-position" data-cy="test-delete-event-button" onClick={showAlert}>{translate('delete_event')}</button>
                                <button disabled={disabledInputs || invalidSerie} type="submit" className="btn btn-primary float-right button-position mr-1" data-cy="test-save-event-button">{translate('save')}</button>
                            </div>
                        </div>
                    </form>
                </div>
                : (
                    <div></div>
                )
            }
        </div>
    );
};


const mapStateToProps = state => ({
    video : state.er.event,
    series : state.ser.seriesDropDown,
    selectedSerie: state.ser.serie,
    videos : state.er.videos,
    inboxVideos : state.er.inboxVideos,
    deletionDate : state.er.deletionDate,
    i18n: state.i18n,
    preferredLanguage: state.ur.user.preferredLanguage
});

const mapDispatchToProps = dispatch => ({
    onEventDetailsEdit: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos)),
    fetchSerie: (identifier) => dispatch(fetchSerie({ identifier }))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetailsForm);
