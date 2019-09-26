import React from 'react';
import { connect } from 'react-redux';
import { removeMoodleNumber } from '../actions/seriesAction';

const SelectedMoodleNumbers = (props) => {

    console.log(props.moodleNumbers);

    const removeNumber = (moodleNumber) => {
        console.log(moodleNumber);
        props.onMoodleNumberDelete(moodleNumber);
    };

    const drawMoodleNumbers = () => {
        return props.moodleNumbers.map((moodleNumber, index) => {
            return (
                <div key={index} className="form-check-inline">
                    <button disabled type="button" className="btn btn-primary">{ moodleNumber }<span className="close" onClick={() => removeNumber(moodleNumber)} aria-hidden="true">&times;</span></button>
                </div>
            );
        });
    };


    return (
        <div>
            {props.moodleNumbers && props.moodleNumbers.length > 0
                ?
                drawMoodleNumbers()
                : (
                    <div></div>
                )
            }
        </div>
    );
};

const mapStateToProps = state => ({
    moodleNumbers: state.ser.moodleNumbers
});

const mapDispatchToProps = dispatch => ({
    onMoodleNumberDelete : (moodleNumber) => dispatch(removeMoodleNumber(moodleNumber))
});


export default connect(mapStateToProps, mapDispatchToProps)(SelectedMoodleNumbers);