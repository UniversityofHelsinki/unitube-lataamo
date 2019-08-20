import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const VideoDetailsForm = (props) => {
    const [inputs, setInputs] = useState(props.event);

    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/userVideos';

    async function updateVideoDetails() {
        const id = inputs.identifier;
        const title  = inputs.title;
        const description = inputs.description;
        const isPartOf = inputs.isPartOf;

        const video = {
            id, title, description, isPartOf
        };

        console.log('Update video', video);

        // call unitube-proxy api
        const response = await fetch(`${VIDEO_SERVER_API}${PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(video),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        console.log('PUT RESPONSE', response);
    }

    useEffect(() => {
        setInputs(props.event);
    }, [props.event, props.series]);

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
            updateVideoDetails(event);
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
            {props.event && props.event.identifier !== undefined
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
                    {!props.event.identifier  ?
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