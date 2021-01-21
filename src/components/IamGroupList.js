import React from 'react';
import { removeIamGroup } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { GoOrganization } from 'react-icons/go';

const IAMGroupList = (props) => {

    let lastAdministrator = false;
    const lastAdministratorLeft = () => {
        if ((props.persons && props.persons.length === 0) && (props.iamGroups && props.iamGroups.length === 1)) {
            return true;
        }
        return false;
    };

    const drawSelections = () => {
        if (props.iamGroups && props.iamGroups.length > 0) {
            lastAdministrator = lastAdministratorLeft();
            return props.iamGroups.map((selection, index) => {
                return (
                    <div key={ index } className="form-check-inline">
                        <span className="border">
                            <Badge variant='light'>
                                <GoOrganization/>
                                <span className="pl-2 test-iam-group-right">
                                    { selection }
                                    { lastAdministrator !== true
                                        ?
                                        <span className='close' onClick={ () => props.onIamGroupRemove(selection) }
                                            aria-hidden='true'>&times;</span>
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

const mapStateToProps = state => ({
    iamGroups: state.ser.iamGroups,
    persons: state.ser.persons,
});

const mapDispatchToProps = dispatch => ({
    onIamGroupRemove: (iamGroup) => dispatch(removeIamGroup(iamGroup))
});
export default connect(mapStateToProps, mapDispatchToProps) (IAMGroupList);
