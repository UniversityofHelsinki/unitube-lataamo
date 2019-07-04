import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import LoginRedirect from '../App';

const EventForm = (props) => {
    const [inputs, setInputs] = useState(props.event);

    useEffect(() => {
        setInputs(props.event);
    }, [props.event]);

    console.log('INPUTS', inputs);
    const handleSubmit = (event) => {
        console.log(inputs);
        if (event) {
            event.preventDefault();
        }
    };
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };


    return (
        <div>
            {props.event && props.event.identifier
                ?
                <form onSubmit={handleSubmit} className="was-validated">
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-10">
                            <input type="text" name="title" className="form-control" onChange={handleInputChange}
                                placeholder="Title" value={inputs.title} required/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <textarea name="description" className="form-control" value={inputs.description}
                                onChange={handleInputChange} placeholder="Description" required/>
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
    event : state.er.event
});

export default connect(mapStateToProps, null)(EventForm);