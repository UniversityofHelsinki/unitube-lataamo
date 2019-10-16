import React from 'react';
import { connect } from 'react-redux';
import { removeMoodleNumber } from '../actions/seriesAction';
import { Badge } from 'react-bootstrap';

const SelectedMoodleNumbers = (props) => {

    const removeNumber = (moodleNumber) => {
        props.onMoodleNumberDelete(moodleNumber);
    };

    const drawMoodleNumbers = () => {
        return props.moodleNumbers.map((moodleNumber, index) => {
            return (
                <div key={index} className="form-check-inline">
                    <Badge variant='primary'>
                        { moodleNumber }
                        <span className='close' onClick={() => removeNumber(moodleNumber)} aria-hidden='true'>&times;</span>
                    </Badge>
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