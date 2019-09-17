import React, { useEffect, useState } from 'react';
import {actionUploadSeries} from "../actions/seriesAction";
import Alert from "react-bootstrap/Alert";
import ReactHintFactory from 'react-hint';

const ReactHint = ReactHintFactory(React);

const SeriesUploadForm = () => {
    const [inputs, setInputs] = useState({
        title: "",
        description: ""
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [inputs]);

    const uploadSeries = async() => {
        const newSeries = { ...inputs };
        //call unitube proxy api
        try {
            await actionUploadSeries(newSeries);
            setSuccessMessage('SERIES UPLOAD SUCCESS MESSAGE');
        }catch (error){
            setErrorMessage('SERIES UPLOAD ERROR MESSAGE');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await uploadSeries();
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]:event.target.value}));
    };

    return(
        <div>
            <ReactHint events autoPosition="true" />
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
            <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Sarjan nimi</label>
                    <div className="col-sm-8">
                        <input onChange={handleInputChange} type="text" name="title" className="form-control" maxLength="150" required/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary">?</button>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Kuvaus</label>
                    <div className="col-sm-8">
                        <textarea onChange={handleInputChange} type="text" name="description" className="form-control" maxLength="1500" required/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary">?</button>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10 offset-sm-9">
                        <button type="submit" className="btn btn-primary">Tallenna</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SeriesUploadForm;