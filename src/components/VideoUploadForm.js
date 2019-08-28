import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { fetchSeries } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';


const VideoUploadForm = (props) => {
    const [selectedVideoFile, setVideoFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        props.onFetchSeries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadVideo = async() => {
        //https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
        const data = new FormData();
        data.set('videofile', selectedVideoFile);

        // call unitube-proxy api
        try {
            const response = await actionUploadVideo(data);
            setSuccessMessage('JUST A PLACE HOLDER TEXT ' + response.message);
            // no state udpates here
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT ' + err);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await uploadVideo();
    };

    const handleFileInputChange = (event) => {
        event.persist();
        setVideoFile(event.target.files[0]);
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