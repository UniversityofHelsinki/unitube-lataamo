import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'; // maybe refactor to separate file
import Alert from 'react-bootstrap/Alert';


const VideoDetailsForm = (props) => {
    const [inputs, setInputs] = useState(props.event);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);


    // maybe refactor to separate file
    const update = (id, newObject) => {
        const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
        const PATH = '/api/userVideos';
        return axios.put(`${VIDEO_SERVER_API}${PATH}/${id}`, newObject);
    };


    const updateVideoDetails = () => {
        const videoId = inputs.id;

        const video = {
            id: inputs.id,
            title: inputs.title,
            description: inputs.description,
            duration: inputs.duration,
            creator: inputs.creator,
            processing_state: inputs.processing_state,
            isPartOf: inputs.isPartOf,
            visibility: inputs.visibility
        };

        // call unitube-proxy api
        update(videoId, video)
            .then(response => {
                console.log('success', response);
                setSuccessMessage('JUST A PLACE HOLDER TEXT');
            })
            .catch(error => {
                console.log('fail', error);
                setErrorMessage('JUST A PLACE HOLDER TEXT');
            });
    };

    useEffect(() => {
        setInputs(props.event);
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [props.event, props.series]);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            updateVideoDetails();
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const drawSelectionValues = () => {
        return props.series.map((serie) => {
            return <option key={serie.id} id={serie.id} value={serie.id}>{serie.title}</option>;
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

            {props.event && props.event.id !== undefined
                ?
                <form onSubmit={handleSubmit} className="was-validated">
                    <div className="form-group row">
                        <label htmlFor="series" className="col-sm-2 col-form-label">Series</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="isPartOf" value={inputs.isPartOf} onChange={handleInputChange}>
                                {drawSelectionValues()}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-10">
                            <input type="text" name="title" className="form-control" onChange={handleInputChange}
                                placeholder="Title" value={inputs.title} maxLength="150" required/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <textarea name="description" className="form-control" value={inputs.description}
                                onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
                        </div>
                    </div>
                    {!props.event.id  ?
                        <div className="form-group row">
                            <label htmlFor="title" className="col-sm-2 col-form-label">Video</label>
                            <div className="col-sm-10">
                                <input type="file" className="form-control" name="video" required/>
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
    series : state.ser.series
});

export default connect(mapStateToProps, null)(VideoDetailsForm);