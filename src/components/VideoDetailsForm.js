import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import { actionUpdateEventDetails, updateEventList } from '../actions/eventsAction';

const VideoDetailsForm = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.video);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const updateEventDetails = async() => {
        const eventId = inputs.identifier;
        const updatedEvent = { ...inputs }; // values from the form
        // call unitube-proxy api
        try {
            await actionUpdateEventDetails(eventId, updatedEvent);
            setSuccessMessage('JUST A PLACE HOLDER TEXT');
            // update the eventlist to redux state
            props.onEventDetailsEdit(props.videos.map(
                event => event.identifier !== eventId ? event :  updatedEvent));
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT');
        }
    };

    useEffect(() => {
        setInputs(props.video);
        setSuccessMessage(null);
        setErrorMessage(null);
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

            {props.video && props.video.identifier !== undefined
                ?
                <form onSubmit={handleSubmit} className="was-validated">
                    <div className="form-group row">
                        <label htmlFor="series" className="col-sm-2 col-form-label">Series</label>
                        <div className="col-sm-8">
                            <select className="form-control" name="isPartOf" value={inputs.isPartOf} onChange={handleInputChange}>
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
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
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
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
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
                        <div className="col-sm-10 offset-sm-2">
                            <button type="submit" className="btn btn-primary">Tallenna</button>
                        </div>
                    </div>
                </form>
                : (
                    <div></div>
                )
            }
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
    onEventDetailsEdit: (freshEventList) => dispatch(updateEventList(freshEventList))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetailsForm);