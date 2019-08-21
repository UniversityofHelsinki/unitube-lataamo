import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { updateVideoList } from '../actions/videosAction';


// maybe refactor to a separate file
const update = (id, newObject) => {
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/userVideos';
    return axios.put(`${VIDEO_SERVER_API}${PATH}/${id}`, newObject);
};


const VideoDetailsForm = (props) => {
    const [inputs, setInputs] = useState(props.video);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const updateVideoDetails = () => {
        const videoId = inputs.id;
        const updatedVideo = { ...inputs }; // values from the form

        // call unitube-proxy api
        update(videoId, updatedVideo)
            .then(response => {
                setSuccessMessage('JUST A PLACE HOLDER TEXT');

                // update the videolist to redux state
                props.onVideoDetailsEdit(props.videos.map(
                    video => video.id !== videoId ? video : updatedVideo));
            })
            .catch(error => {
                setErrorMessage('JUST A PLACE HOLDER TEXT');
            });
    };

    useEffect(() => {
        setInputs(props.video);
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [props.video, props.series]);

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

            {props.video && props.video.id !== undefined
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
                    {!props.video.id  ?
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
    video : state.er.event,
    series : state.ser.series,
    videos : state.vr.videos,
});

const mapDispatchToProps = dispatch => ({
    onVideoDetailsEdit: (freshVideoList) => dispatch(updateVideoList(freshVideoList))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetailsForm);