import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { updateVideoList, actionUpdateVideoDetails } from '../actions/videosAction';


const VideoDetailsForm = (props) => {
    const [inputs, setInputs] = useState(props.video);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const updateVideoDetails = async() => {
        const videoId = inputs.id;
        const updatedVideo = { ...inputs }; // values from the form

        // call unitube-proxy api
        try {
            await actionUpdateVideoDetails(videoId, updatedVideo);
            setSuccessMessage('JUST A PLACE HOLDER TEXT');
            // update the videolist to redux state
            props.onVideoDetailsEdit(props.videos.map(
                video => video.id !== videoId ? video : updatedVideo));
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT');
        }
    };

    useEffect(() => {
        setInputs(props.video);
    }, [props.video, props.series]);

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            await updateVideoDetails();
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
                            <input type="text" name="title" className="form-control" onChange={handleInputChange} placeholder="Title" value={inputs.title} maxLength="150" required/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <textarea name="description" className="form-control" value={inputs.description} onChange={handleInputChange} placeholder="Description" maxLength="1500" required/>
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