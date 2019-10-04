import React from 'react';
import { removeIamGroup } from '../actions/seriesAction';
import { connect } from 'react-redux';

const IAMGroupList = (props) => {

    const drawSelections = () => {
        if (props.iamGroups && props.iamGroups.length > 0) {
            return props.iamGroups.map((selection, index) => {
                return (
                    <div key={index} className="form-check-inline">
                        <button disabled type="button" className="btn btn-outline-dark">{selection}<span
                            onClick={() => props.onIamGroupRemove(selection)} className="close"
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
    iamGroups: state.ser.iamGroups
});

const mapDispatchToProps = dispatch => ({
    onIamGroupRemove: (iamGroup) => dispatch(removeIamGroup(iamGroup))
});
export default connect(mapStateToProps, mapDispatchToProps) (IAMGroupList);