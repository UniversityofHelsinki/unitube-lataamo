import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchVideoUrl } from '../actions/videosAction';
import { fetchEvent, fetchInboxEvents } from '../actions/eventsAction';
import { fetchSeriesDropDownList } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoDetailsForm from './VideoDetailsForm';
import moment from 'moment';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { VIDEO_PROCESSING_FAILED, VIDEO_PROCESSING_RUNNING, VIDEO_PROCESSING_INSTANTIATED } from '../utils/constants';
import Alert from 'react-bootstrap/Alert';
import routeAction from "../actions/routeAction";

const { SearchBar } = Search;

const InboxVideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    // the only translated property is the visibility value
    const translatedVideos = () => {
        return props.videos.map(video => {
            return {
                ...video,
                visibility: video.visibility.map(visibilityKey => translate(visibilityKey))
            };
        });
    };

    const options = {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '30', value: 30
        }]
    };

    useEffect(() => {
        props.onRouteChange(props.route);
        props.onFetchEvents(true);
        if (props.apiError) {
            setErrorMessage(props.apiError);
        }
        const interval = setInterval(() => {
            props.onFetchEvents(false);
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.apiError, props.route]);

    const statusFormatter = (cell, row) => {
        return (
            <div>
                {
                    row.visibility.map((acl, index) =>
                        <p key={ index }> { acl } </p>
                    )
                }
            </div>
        );
    };

    const dateFormatter = (cell) => {
        return moment(cell).utc().format('DD.MM.YYYY HH:mm:ss');
    };

    const columns = [{
        dataField: 'identifier',
        text: translate('video_id'),
        hidden: true
    }, {
        dataField: 'created',
        text: translate('created'),
        type: 'date',
        sort: true,
        formatter: dateFormatter
    }, {
        dataField: 'title',
        text: translate('video_title'),
        sort: true
    }, {
        dataField: 'duration',
        text: translate('video_duration'),
        sort: true
    }, {
        dataField: 'processing_state',
        text: translate('processing_state'),
        sort: true
    }, {
        dataField: 'series',
        text: translate('series_title'),
        sort: true
    }, {
        dataField: 'visibility',
        text: translate('publication_status'),
        formatter: statusFormatter,
        sort: true
    }];

    const defaultSorted = [{
        dataField: 'created',
        order: 'desc'
    }];

    const eventNotSelectable = (processingState) => {
        return (processingState && (processingState === VIDEO_PROCESSING_RUNNING ||
            processingState === VIDEO_PROCESSING_FAILED ||
            processingState === VIDEO_PROCESSING_INSTANTIATED));
    };

    const nonSelectableRows = () => {
        let nonSelectableArray = [];
        props.videos.forEach(video => {
            if (eventNotSelectable(video.processing_state)) {
                nonSelectableArray.push(video.identifier);
            }
        });
        return nonSelectableArray;
    };

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        clickToEdit: true,
        hideSelectColumn: true,
        bgColor: '#8cbdff',
        nonSelectable: nonSelectableRows(),
        selected: [props.selectedRowId],
        onSelect: (row) => {
            props.onSelectEvent(row);
        }
    };


    const rowStyle = (row) => {
        const style = {};
        if (eventNotSelectable(row.processing_state)) {
            style.backgroundColor = '#f4f5f9';
        }
        return style;
    };

    return (
        <div>
            <div className="margintop">
                <Link to="/uploadVideo" className="btn btn-primary">
                    <Translate value="add_video"/>
                </Link>
            </div>
            { !props.loading && !errorMessage ?
                <div className="table-responsive">
                    <ToolkitProvider
                        bootstrap4
                        keyField="identifier"
                        data={ translatedVideos() }
                        columns={ columns }
                        search>
                        {
                            props => (
                                <div>
                                    <br/>
                                    <SearchBar { ...props.searchProps } placeholder={ translate('search') }/>
                                    <hr/>
                                    <BootstrapTable { ...props.baseProps } selectRow={ selectRow }
                                                    pagination={ paginationFactory(options) } defaultSorted={ defaultSorted }
                                                    noDataIndication="Table is Empty" bordered={ false }
                                                    rowStyle={ rowStyle }
                                                    hover/>
                                </div>
                            )
                        }
                    </ToolkitProvider>
                    <VideoDetailsForm/>
                </div>
                : errorMessage !== null ?
                    <Alert variant="danger" onClose={ () => setErrorMessage(null) } >
                        <p>
                            { errorMessage }
                        </p>
                    </Alert>
                    : <Loader loading={ translate('loading') }/>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videos: state.er.inboxVideos,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.er.loading,
    apiError: state.sr.apiError
});

const mapDispatchToProps = dispatch => ({
    onFetchEvents: (refresh, inbox) => dispatch(fetchInboxEvents(refresh, inbox)),
    onSelectEvent: (row) => {
        dispatch(fetchVideoUrl(row));
        dispatch(fetchEvent(row));
        dispatch(fetchSeriesDropDownList());
    },
    onRouteChange: (route) =>  dispatch(routeAction(route))
});


export default connect(mapStateToProps, mapDispatchToProps)(InboxVideoList);