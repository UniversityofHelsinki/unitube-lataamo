import React from 'react';
import { connect } from 'react-redux';

const SeriesList = () => {
    return (
        <div>
            Series
        </div>
    );
};

const mapStateToProps = state => ({
    user : state.ur.user
});


export default connect(mapStateToProps, null)(SeriesList);