import React from 'react';
import { connect } from 'react-redux';

const SelectedMoodleNumbers = (props) => {

    


    return (
        <div>
            <button disabled type="button" className="btn btn-primary">{ props.moodleId }<span className="close" aria-hidden="true">&times;</span></button>
        </div>
    );
};

const mapStateToProps = state => ({
    moodleNumbers: state.sr.moodleNumbers
});



export default connect(mapStateToProps, null)(SelectedMoodleNumbers);