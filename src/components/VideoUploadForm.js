import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { fetchSeries } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';


const VideoUploadForm = (props) => {
    const [inputs, setInputs] = useState(props.event);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        props.onFetchSeries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadVideo = async() => {
        const newVideo = { ...inputs }; // values from the form

        // call unitube-proxy api
        try {
            await actionUploadVideo(newVideo);
            setSuccessMessage('JUST A PLACE HOLDER TEXT');
            // no state udpates here
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        uploadVideo();
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const handleFileInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.files[0] }));
    };

    const drawSelectionValues = () => {
        return props.series.map((serie) => {
            return <option key={serie.identifier} id={serie.identifier} value={serie.identifier}>{serie.title}</option>;
        });
    };


    return (
        <div>
            {/* https://getbootstrap.com/docs/4.0/components/alerts/ */}
            {successMessage !== null ?
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    <p>{successMessage}</p>
                </Alert>
                : (<></>)
            }
            {errorMessage !== null ?
                <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                    <p>{errorMessage}</p>
                </Alert>
                : (<></>)
            }
            <h2>I am the upload form, who are you?</h2>
            <form encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="form-group row">
                    <label htmlFor="title" className="col-sm-2 col-form-label">Video file</label>
                    <div className="col-sm-10">
                        <input onChange={handleFileInputChange} type="file" className="form-control" name="video_file" required/>
                    </div>
                </div>
                <br></br>
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
                <div className="form-group row">
                    <div className="col-sm-10 offset-sm-2">
                        <button type="submit" className="btn btn-primary">Tallenna</button>
                    </div>
                </div>
            </form>
        </div>
    );
};


const mapStateToProps = state => ({
    event : state.er.event,
    series : state.ser.series
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploadForm);