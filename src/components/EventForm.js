import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

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
    }
    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input type="text" name="title" onChange={handleInputChange} value={inputs.title} required />
                <label>Description</label>
                <textarea name="description" value={inputs.description}  onChange={handleInputChange} required />
                <button type="submit">Tallenna</button>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    event : state.er.event
});

export default connect(mapStateToProps, null)(EventForm);