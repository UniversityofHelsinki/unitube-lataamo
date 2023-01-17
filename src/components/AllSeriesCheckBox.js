import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { apiGetEventsBySeriesSuccessCall, changeAllVideosChecked, fetchEvents } from '../actions/eventsAction';

const AllSeriesCheckBox = (props) => {
    const [checkedValue, setChecked] = useState(props.allVideosChecked ? props.allVideosChecked : false);
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
        if (props.loading) {
            setDisabledCheckBox(true);
        } else {
            setDisabledCheckBox(false);
        }
    }, [props.loading]);

    return (
        <div className="form-group row">
            <label htmlFor="allSeriesCheckbox" className="col-sm-2 col-form-label">{translate('fetch_all_videos')}</label>
            <label>
                <input id="allSeriesCheckbox" disabled={disabledCheckBox} className="form-check-input"  type="checkbox" checked={checkedValue} onChange={handleChange} />
            </label>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    allVideosChecked: state.er.allVideosChecked,
    loading: state.er.loading
});

const mapDispatchToProps = dispatch => ({
    fetchAllVideos : () => dispatch(fetchEvents(true)),
    emptyVideosInSeriesList : () => dispatch(apiGetEventsBySeriesSuccessCall([])),
    changeAllVideosChecked : (checkedValue) => dispatch(changeAllVideosChecked(checkedValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(AllSeriesCheckBox);
