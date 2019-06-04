import React from 'react';
import { connect } from 'react-redux';

const SeriesList = (props) => {
    const id = props.id;
    return (
        <div>
            Series
            <p>{id}</p>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    id: ownProps.match.params.id
});


export default connect(mapStateToProps, null)(SeriesList);