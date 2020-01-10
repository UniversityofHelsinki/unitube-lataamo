import React from 'react';
import { removePerson } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { GoPerson } from 'react-icons/go';

const PersonList = (props) => {

    let lastAdministrator = false;
    const lastAdministratorLeft = () => {
        if ((props.iamGroups && props.iamGroups.length === 0) && (props.persons && props.persons.length === 1)) {
            return true;
        }
        return false;
    };

    const drawSelections = () => {

        addLoggedUserAsAdministrator(props);

        if (props.persons && props.persons.length > 0) {
            lastAdministrator = lastAdministratorLeft();
            return props.persons.map((selection, index) => {
                return (
                    <div key={ index } className="form-check-inline">
                        <span className="border">
                            <Badge variant='light'>
                                <GoPerson />
                                <span className="pl-2">
                                    { selection }
                                    { lastAdministrator !== true
                                        ?
                                        <span className='close' onClick={ (event) => {
                                            event.isDefaultPrevented();
                                            props.onPersonRemove(selection);
                                        } } aria-hidden='true'>&times;</span>
                                        : (
                                            <div></div>
                                        )
                                    }
                                </span>
                            </Badge>
                        </span>
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

const addLoggedUserAsAdministrator = (props) => {
    if (props.persons && props.persons.length === 0 && (props.iamGroups && props.iamGroups.length === 0)) {
        props.persons.push(props.user.eppn);
    }
}

const mapStateToProps = state => ({
    user : state.ur.user,
    persons: state.ser.persons,
    iamGroups: state.ser.iamGroups
});

const mapDispatchToProps = dispatch => ({
    onPersonRemove: (person) => dispatch(removePerson(person))
});
export default connect(mapStateToProps, mapDispatchToProps) (PersonList);
