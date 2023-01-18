import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { apiGetEventsBySeriesSuccessCall, changeAllVideosChecked, fetchEvents } from '../actions/eventsAction';
import { Form } from 'react-bootstrap';

const AllSeriesCheckBox = (props) => {
    const [checkedValue, setChecked] = useState(false);
    const [disabledCheckBox, setDisabledCheckBox] = useState(false);
    const translations =  props.i18n.translations[props.i18n.locale];
    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const handleChange = () => {
        setChecked(!checkedValue);
    };

    useEffect(async () => {
        setDisabledCheckBox(true);
        props.emptyVideosInSeriesList();
        props.changeAllVideosChecked(checkedValue);
        if (checkedValue) {
            await props.fetchAllVideos();
        }
        setDisabledCheckBox(false);
    }, [checkedValue]);

    useEffect(() => {
        if (props.selectedSeries) {
            setChecked(false);
        }
    }, [props.selectedSeries]);

    useEffect(() => {
        if (props.loading) {
            setDisabledCheckBox(true);
        } else {
            setDisabledCheckBox(false);
        }
    }, [props.loading]);

    return (
        <div className="form-group row">
            <label htmlFor="allSeriesCheckbox" className="col-sm-2 col-form-label">{translate('fetch_all_videos_checkbox_label')}</label>
            <Form.Check
                type="switch"
                id="allSeriesCheckbox"
                disabled={disabledCheckBox}
                label={translate('fetch_all_videos')}
                checked={checkedValue}
                onChange={handleChange}
            />
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    allVideosChecked: state.er.allVideosChecked,
    loading: state.er.loading,
    selectedSeries : state.ser.selectedSeries
});

const mapDispatchToProps = dispatch => ({
    fetchAllVideos : () => dispatch(fetchEvents(true)),
    emptyVideosInSeriesList : () => dispatch(apiGetEventsBySeriesSuccessCall([])),
    changeAllVideosChecked : (checkedValue) => dispatch(changeAllVideosChecked(checkedValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(AllSeriesCheckBox);
