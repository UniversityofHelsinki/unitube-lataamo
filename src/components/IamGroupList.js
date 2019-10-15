import React from 'react';
import { removeIamGroup } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';

const IAMGroupList = (props) => {

    const drawSelections = () => {
        if (props.iamGroups && props.iamGroups.length > 0) {
            return props.iamGroups.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <Badge variant='primary'>
                            { selection }
                            <span className='close' onClick={() =>  props.onIamGroupRemove(selection)} aria-hidden='true'>&times;</span>
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
    iamGroups: state.ser.iamGroups
});

const mapDispatchToProps = dispatch => ({
    onIamGroupRemove: (iamGroup) => dispatch(removeIamGroup(iamGroup))
});
export default connect(mapStateToProps, mapDispatchToProps) (IAMGroupList);