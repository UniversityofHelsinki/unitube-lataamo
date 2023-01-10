import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { apiGetEventsBySeriesSuccessCall, fetchEventsBySeries } from '../actions/eventsAction';
import { updateSelectedSeries } from '../actions/seriesAction';

const SeriesDropDownList = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];
    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const drawSelectionValues = () => {
        let series = [...props.series];
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const handleSelectionChange = async (event) => {
        const seriesId = event.target.value;
        props.updateSelectedSeries(seriesId);
        if (seriesId) {
            await props.fetchSeriesVideos(seriesId);
        } else {
            props.emptyVideosInSeriesList();
        }
    };

    return (
        <div className="form-group row">
            <label htmlFor="series" className="col-sm-2 col-form-label">{translate('series')}</label>
            <div className="col-sm-8">
                <select required className="form-control" name="isPartOf"
                    data-cy="test-event-is-part-of" value={props.selectedSeries} onChange={handleSelectionChange}>
                    <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                    {drawSelectionValues()}
                </select>
            </div>
            <div className="col-sm-2">
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_filter_info')}</Tooltip>}>
                    <span className="d-inline-block">
                        <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                    </span>
                </OverlayTrigger>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    series : state.ser.seriesDropDown,
    i18n: state.i18n,
    selectedSeries : state.ser.selectedSeries
});

const mapDispatchToProps = dispatch => ({
    fetchSeriesVideos : (seriesId) => dispatch(fetchEventsBySeries(false, seriesId)),
    updateSelectedSeries : (seriesId) => dispatch(updateSelectedSeries(seriesId)),
    emptyVideosInSeriesList : () => dispatch(apiGetEventsBySeriesSuccessCall([]))
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesDropDownList);
