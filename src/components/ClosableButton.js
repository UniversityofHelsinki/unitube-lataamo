import React from 'react';
import { connect } from 'react-redux';

const ClosableButton = (props) => {
    return (
        <div>
            <button disabled type="button" className="btn btn-primary">{ props.moodleId }<span className="close" aria-hidden="true">&times;</span></button>
        </div>
    );
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ClosableButton);