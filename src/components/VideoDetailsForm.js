import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { actionUpdateEventDetails, updateEventList } from '../actions/eventsAction';
import Video from './Video';

const VideoDetailsForm = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.video);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [hideIfEventUpdate, setHideIfEventUpdate] = useState(false);

    const updateEventDetails = async() => {
        const eventId = inputs.identifier;
        const updatedEvent = { ...inputs }; // values from the form
        // call unitube-proxy api
        try {
            await actionUpdateEventDetails(eventId, updatedEvent);
            setSuccessMessage(translate('updated_event_details'));
            // update the eventlist to redux state
            props.onEventDetailsEdit();
            setHideIfEventUpdate(true);
        } catch (err) {
            setErrorMessage(translate('failed_to_update_event_details'));
        }
    };

    useEffect(() => {
        setInputs(props.video);
        setSuccessMessage(null);
        setErrorMessage(null);
        setHideIfEventUpdate(false);
    }, [props.video, props.series]);

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            await updateEventDetails();
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const drawSelectionValues = () => {
        return props.series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const drawLicenseSelectionValues = () => {
        return props.video.licenses.map((license) => {
            return <option key={license} id={license} value={license}>{license}</option>;
        });
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

    return (
        <div>
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
            <div hidden={hideIfEventUpdate}>
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
                                    <label htmlFor="series" className="col-sm-2 col-form-label">{translate('series')}</label>
                                    <div className="col-sm-8">
                                        <select required className="form-control" name="isPartOf" value={inputs.isPartOf} onChange={handleInputChange}>
                                            {drawSelectionValues()}
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_title')}</label>
                                    <div className="col-sm-8">
                                        <input type="text" name="title" className="form-control" onChange={handleInputChange}
                                            placeholder="Title" value={inputs.title} maxLength="150" required/>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_title_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="title" className="col-sm-2 col-form-label">{translate('video_description')}</label>
                                    <div className="col-sm-8">
                                        <textarea name="description" className="form-control" value={inputs.description}
                                            onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_description_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="licenses" className="col-sm-2 col-form-label">{translate('license')}</label>
                                    <div className="col-sm-8">
                                        <select required className="form-control" name="license" value={inputs.license} onChange={handleInputChange}>
                                            <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                            {drawLicenseSelectionValues()}
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('licenses_info')}</Tooltip>}>
                                            <span className="d-inline-block">
                                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-2">
                                    <button type="submit" className="btn btn-primary">{translate('save')}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    : (
                        <div></div>
                    )
                }
            </div>
        </div>
    );
};


const mapStateToProps = state => ({
    video : state.er.event,
    series : state.ser.series,
    videos : state.er.videos,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onEventDetailsEdit: () => dispatch(updateEventList())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetailsForm);
