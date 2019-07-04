import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const EventForm = (props) => {
    const [inputs, setInputs] = useState(props.event);

    useEffect(() => {
        setInputs(props.event);
    }, [props.event]);

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

    const drawSelectionValues = () => {
        return props.series.map((serie) => {
            return <option key={serie.identifier} value={serie.title}>{serie.title}</option>;
        });
    };

    return (
        <div>
            {props.event && props.event.identifier
                ?
                <form onSubmit={handleSubmit} className="was-validated">
                    <div className="form-group row">
                        <label htmlFor="series" className="col-sm-2 col-form-label">Series</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="series" onChange={handleInputChange}>
                                {drawSelectionValues()}
                            </select>
                        </div>
                    </div>
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
    event : state.er.event,
    series : state.ser.series
});

export default connect(mapStateToProps, null)(EventForm);