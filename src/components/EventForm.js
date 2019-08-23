import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactHintFactory from 'react-hint';

const ReactHint = ReactHintFactory(React);

const EventForm = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.event);

    useEffect(() => {
        setInputs(props.event);
    }, [props.event, props.series]);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
    };
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const drawSelectionValues = () => {
        return props.series.map((serie) => {
            return <option key={serie.identifier} id={serie.identifier} value={serie.identifier}>{serie.title}</option>;
        });
    };

    return (
        <div>
            <ReactHint events autoPosition="true" />
            {props.event && props.event.identifier !== undefined
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
                            <button className="btn btn-primary" data-rh={translate('series_info')}>?</button>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-8">
                            <input type="text" name="title" className="form-control" onChange={handleInputChange}
                                placeholder="Title" value={inputs.title} maxLength="150" required/>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-primary" data-rh={translate('video_title_info')}>?</button>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-8">
                            <textarea name="description" className="form-control" value={inputs.description}
                                onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-primary" data-rh={translate('video_description_info')}>?</button>
                        </div>
                    </div>
                    {!props.event.identifier  ?
                        <div className="form-group row">
                            <label htmlFor="title" className="col-sm-2 col-form-label">Video</label>
                            <div className="col-sm-8">
                                <input type="file" className="form-control" name="video" required/>
                            </div>
                            <div className="col-sm-2">
                                <ReactHint events />
                                <button className="btn btn-primary" data-rh={translate('video_file_info')}>?</button>
                            </div>
                        </div>
                        : (
                            <div></div>
                        )
                    }
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
    event : state.er.event,
    series : state.ser.series,
    i18n: state.i18n
});

export default connect(mapStateToProps, null)(EventForm);