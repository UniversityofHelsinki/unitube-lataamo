import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionMoveEventToTrashSeries, actionUpdateEventDetails, updateEventList } from '../actions/eventsAction';
import Video from './Video';
import constants from '../utils/constants';
import { IconContext } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [hovered, setHovered] = useState(false);

    const toggleHover = () => {
        setHovered(!hovered);
    };

    const copyTextToClipboard = (event) => {
        event.preventDefault();
        event.persist();
        let copyEventId = document.getElementById('eventId').innerText;
        let eventId = document.createElement('input');
        document.body.appendChild(eventId);
        eventId.value = copyEventId;
        eventId.select();
        //for mobile devices
        eventId.setSelectionRange(0,99999);
        document.execCommand('copy');
        eventId.remove();
        setSuccessMessage(translate('video_id_copied_to_clipboard'));
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
        // call unitube-proxy api
        try {
            await actionUpdateEventDetails(eventId, updatedEvent);
            setSuccessMessage(translate('updated_event_details'));
            // update the eventlist to redux state
            const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(eventId, updatedEvent) : getUpdatedVideos(eventId, updatedEvent);
            props.onEventDetailsEdit(props.inbox, updatedVideos);
        } catch (err) {
            setErrorMessage(translate('failed_to_update_event_details'));
        }
    };

    useEffect(() => {
        let isDisabled  = props.video.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        if (!isBeingEdited) {
            setInputs(props.video);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.video, props.series, props.inbox]);

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

    const handleInputChange = (event) => {
        event.persist();
        setIsBeingEdited(true);
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const drawSelectionValues = () => {
        let series = [...props.series];
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const drawLicenseSelectionValues = () => {
        return props.video.licenses.map((license) => {
            return <option key={license} id={license} value={license}>{translate(replaceCharacter(license))}</option>;
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
            cancelButtonText: translate('close_alert')
        });
        return result;
    };

    const showSuccessMessage = () => {
        SweetAlert.fire({
            title: translate('succeeded_to_delete_event'),
            text: translate('succeeded_to_delete_event'),
            icon: 'success'
        });
    };

    const showAlert = async () => {
        const result = await createAlert();
        if (result.value && result.value === true) {
            await deleteEvent();
        }
    };

    return (
        <div>
            <Video/>
            {props.video && props.video.identifier !== undefined
                ?
                <div>
                    <form onSubmit={handleSubmit} className="was-validated">
                        <div className="events-bg">
                            <div className="form-group row">
                                <label className="series-title col-sm-10 col-form-label">{translate('events_basic_info')}</label>
                            </div>

                            {inboxSeries(props.video.series.title)}
                            <div className="form-group row">
                                <label htmlFor="eventId" className="col-sm-2 col-form-label">{translate('event_id')}</label>
                                <label id="eventId" className="col-sm-3 col-form-label">{props.video.identifier}</label>
                                <div className="col-sm-3">
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <div>
                                            <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyTextToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                        </div>
                                    </IconContext.Provider>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="series" className="col-sm-2 col-form-label">{translate('series')}</label>
                                <div className="col-sm-8">
                                    <select disabled={disabledInputs} required className="form-control" name="isPartOf" value={inputs.isPartOf} onChange={handleInputChange}>
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
                            <div className="form-group row">
                                <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_title')}</label>
                                <div className="col-sm-8">
                                    <input disabled={disabledInputs} type="text" name="title" className="form-control" onChange={handleInputChange}
                                        placeholder="Title" value={inputs.title} maxLength="150" required/>
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
                                <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_description')}</label>
                                <div className="col-sm-8">
                                    <textarea disabled={disabledInputs} name="description" className="form-control" value={inputs.description}
                                        onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
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
                                <label htmlFor="licenses" className="col-sm-2 col-form-label">{translate('license')}</label>
                                <div className="col-sm-8">
                                    <select disabled={disabledInputs} required className="form-control" name="license" value={inputs.license} onChange={handleInputChange}>
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
                                <button disabled={disabledInputs} type="button" className="btn delete-button float-right button-position" onClick={showAlert}>{translate('delete_event')}</button>
                                <button disabled={disabledInputs} type="submit" className="btn btn-primary float-right button-position mr-1">{translate('save')}</button>
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
    videos : state.er.videos,
    inboxVideos : state.er.inboxVideos,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onEventDetailsEdit: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetailsForm);
