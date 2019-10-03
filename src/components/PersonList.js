import React from 'react';
import { removePerson } from '../actions/seriesAction';
import { connect } from 'react-redux';

const PersonList = (props) => {

    const drawSelections = () => {
        if (props.persons && props.persons.length > 0) {
            return props.persons.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <button disabled type="button" className="btn btn-outline-dark">{selection}<span
                            onClick={() => props.onPersonRemove(selection)} className="close"
                            aria-hidden="true">&times;</span></button>
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
