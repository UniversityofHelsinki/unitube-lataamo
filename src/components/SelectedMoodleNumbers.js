import React from 'react';
import { connect } from 'react-redux';

const SelectedMoodleNumbers = (props) => {

    const drawMoodleNumbers = () => {
        return props.moodleNumbers.map((moodleNumber, index) => {
            return (
                <div key={index} className="row">
                    <button disabled type="button" className="btn btn-primary">{ moodleNumber }<span className="close" aria-hidden="true">&times;</span></button>
                </div>
            );
        });
    };


    return (
        <div>
            {drawMoodleNumbers()}
        </div>
    );
};

const mapStateToProps = state => ({
    moodleNumbers: state.sr.moodleNumbers
});



export default connect(mapStateToProps, null)(SelectedMoodleNumbers);