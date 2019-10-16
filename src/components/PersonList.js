import React from 'react';
import { removePerson } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';

const PersonList = (props) => {

    let lastAdministrator = false;
    const lastAdminstratorLeft = () => {
        if ((props.iamGroups && props.iamGroups.length === 0) && (props.persons && props.persons.length === 1)) {
            return true;
        }
        return false;
    };

    const drawSelections = () => {
        if (props.persons && props.persons.length > 0) {
            lastAdministrator = lastAdminstratorLeft();
            return props.persons.map((selection, index) => {
                return (
                    <div key={ index } className="form-check-inline">
                        <Badge variant='primary'>
                            { selection }
                            { lastAdministrator !== true
                                ?
                                <span className='close' onClick={ (event) => {
                                    event.isDefaultPrevented();
                                    props.onPersonRemove(selection)
                                } } aria-hidden='true'>&times;</span>
                                : (
                                    <div></div>
                                )
                            }

                        </Badge>
                    </div>
                );
            });
        }
    };

    return (
        <div>
            { drawSelections() }
        </div>
    );
};


const mapStateToProps = state => ({
    persons: state.ser.persons,
    iamGroups: state.ser.iamGroups
});

const mapDispatchToProps = dispatch => ({
    onPersonRemove: (person) => dispatch(removePerson(person))
});
export default connect(mapStateToProps, mapDispatchToProps) (PersonList);
