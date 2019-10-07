import React from 'react';
import { removePerson } from '../actions/seriesAction';
import { connect } from 'react-redux';
import {Badge} from "react-bootstrap";

const PersonList = (props) => {

    const drawSelections = () => {
        if (props.persons && props.persons.length > 0) {
            return props.persons.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <Badge variant='primary'>
                            { selection }
                            <span className='close' onClick={() =>  props.onPersonRemove(selection)} aria-hidden='true'>&times;</span>
                        </Badge>
                    </div>
                );
            });
        }
    };

    return (
        <div>
            {drawSelections()}
        </div>
    );
};



const mapStateToProps = state => ({
    persons: state.ser.persons
});

const mapDispatchToProps = dispatch => ({
    onPersonRemove: (person) => dispatch(removePerson(person))
});
export default connect(mapStateToProps, mapDispatchToProps) (PersonList);
