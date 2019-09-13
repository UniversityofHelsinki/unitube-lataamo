import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { updateSerieList, actionUpdateSerieDetails } from "../actions/seriesAction";

import ReactHintFactory from 'react-hint';

const ReactHint = ReactHintFactory(React);


const SerieDetailsForm = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.serie);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const updateSerieDetails = async() => {
        const serieId = inputs.identifier;
        const updatedSerie = { ...inputs }; // values from the form
        // call unitube-proxy api
        try {
            await actionUpdateSerieDetails(serieId, updatedSerie);
            setSuccessMessage('JUST A PLACE HOLDER TEXT');
            // update the serielist to redux state
            props.onSerieDetailsEdit(props.series.map(
                serie => serie.identifier !== serieId ? serie :  updatedSerie));
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT');
        }
    };

    useEffect(() => {
        setInputs(props.serie);
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [props.serie]);

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            await updateSerieDetails();
        }
    };
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    return (
        <div>
            <ReactHint events autoPosition="true" />
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

            {props.serie && props.serie.identifier !== undefined
                ?
                <form onSubmit={handleSubmit} className="was-validated">

                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-8">
                            <input type="text" name="title" className="form-control" value={inputs.title}
                                   onChange={handleInputChange} placeholder="Title"  maxLength="150" required/>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-primary" data-rh={translate('serie_title_info')}>?</button>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-8">
                            <textarea name="description" className="form-control" value={inputs.description}
                                      onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
                        </div>
                        <div className="col-sm-2">
                            <button className="btn btn-primary" data-rh={translate('serie_description_info')}>?</button>
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
    serie : state.ser.serie,
    series : state.ser.series,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onSerieDetailsEdit: (freshSerieList) => dispatch(updateSerieList(freshSerieList))
});

export default connect(mapStateToProps, mapDispatchToProps)(SerieDetailsForm);
