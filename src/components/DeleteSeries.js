import React from 'react';
import { actionDeleteSeries } from '../actions/seriesAction';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const DeleteSeries = (props) => {
    const [disabled, setDisabled] = useState(true);
    useEffect(() => {
        if (props.serie && props.serie.eventColumns) {
            setDisabled(props.serie.eventColumns.length !== 0);
        }
    }, [props.serie]);

    const handleOnClick = (event) => {
        event.preventDefault();
        props.deleteSeries(props.serie);
    };

    return (
        <button disabled={disabled} className={`btn btn-${disabled ? 'secondary' : 'danger'}`} onClick={handleOnClick}>{props.label}</button>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    deleteSeries: (serie) => dispatch(actionDeleteSeries(serie))
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSeries);


