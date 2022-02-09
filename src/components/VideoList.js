import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchVideoUrl } from '../actions/videosAction';
import { fetchEvent, fetchEvents, deselectEvent, deselectRow } from '../actions/eventsAction';
import { fetchSeries, fetchSeriesDropDownList } from '../actions/seriesAction';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import {
    VIDEO_PROCESSING_INSTANTIATED,
    VIDEO_PROCESSING_RUNNING,
    VIDEO_PROCESSING_SUCCEEDED
} from '../utils/constants';
import {
    dateFormatter,
    downloadHandler,
    getExpandRowProps,
    hideErrorMessageAfter,
    noDataIndication,
    paginationOptions,
    rowStyle,
    updateProcessedEventInfo,
    viewErrorMessage
} from '../utils/videoListUtils';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { FiDownload } from 'react-icons/fi';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const { SearchBar } = Search;

const VideoList = (props) => {
    const translations = props.i18n.translations[props.i18n.locale];
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);

    let [media, setMedia] = useState({ column: 'media', expanded: '' });

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const mediaFormatter = (cell, row) => {
        return (
            <div className="form-container">
                {
                    row.media.map((media, index) =>
                        <form key={index}
                            onSubmit={(event) => downloadHandler(event, setVideoDownloadErrorMessage, translate('error_on_video_download'))}>
                            <input type="hidden" name="mediaUrl" value={media} />
                            <Button name="downloadButton" className="disable-enable-buttons" variant="link" type="submit"><FiDownload></FiDownload></Button>
                            <Button name="downloadIndicator" hidden disabled variant="link"><FaSpinner className="icon-spin"></FaSpinner></Button>
                        </form>
                    )
                }
            </div>
        );
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

    useEffect(updateProcessedEventInfo(props),
        [props.selectedRowId, props.videos]);

    useEffect(viewErrorMessage(props, setErrorMessage, translate(props.apiError)),
        [props.apiError, props.route]);

    useEffect(hideErrorMessageAfter(setVideoDownloadErrorMessage, 60000), []);

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

    const stateFormatter = (cell) => {
        if (cell === VIDEO_PROCESSING_SUCCEEDED){
            return translate('event_succeeded_state');
        } else if (cell === VIDEO_PROCESSING_INSTANTIATED || cell === VIDEO_PROCESSING_RUNNING) {
            return translate('event_running_and_instantiated_state');
        } else {
            return translate('event_failed_state');
        }
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
        sort: true,
        formatter: stateFormatter
    }, {
        dataField: 'series',
        text: translate('series_title'),
        sort: true
    }, {
        dataField: 'visibility',
        text: translate('publication_status'),
        formatter: statusFormatter,
        sort: true
    }, {
        dataField: 'media',
        text: translate('download_video'),
        formatter: mediaFormatter,
        // Prevent row from expanding when clicking "download video".
        // As a side-effect the whole cell is disabled.
        events: {
            onClick: () => {
                setMedia( {
                    column: 'media',
                    expanded: false
                });
            }
        }
    }];

    const defaultSorted = [{
        dataField: 'created',
        order: 'desc'
    }];

    const expandRow = getExpandRowProps(props.videos, props.onSelectEvent, false);

    return (
        <div className="margintop marginbottom">
            <Link to="/uploadVideo" className="btn btn-primary">
                <Translate value="add_video"/>
            </Link>
            { !errorMessage ?
                <div className="table-responsive">
                    {videoDownloadErrorMessage ?
                        <Alert className="position-fixed" variant="danger" onClose={() => setVideoDownloadErrorMessage(null)} dismissible>
                            <p>
                                {videoDownloadErrorMessage}
                            </p>
                        </Alert> : ''
                    }
                    <ToolkitProvider
                        bootstrap4
                        keyField="identifier"
                        data={ translatedVideos() }
                        columns={ columns }
                        search>
                        {
                            props => (
                                <div className="margintop">
                                    <label className='info-text'>{ translate('search_events_info') }</label>
                                    <div className="form-group has-search">
                                        <span className="form-control-feedback"><FaSearch/></span>
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_events') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps }
                                        expandRow={ expandRow }
                                        pagination={ paginationFactory(paginationOptions) }
                                        defaultSorted={ defaultSorted }
                                        noDataIndication={ noDataIndication(props.loading, translate('empty_video_list')) }
                                        bordered={ false }
                                        rowStyle={ rowStyle }
                                        hover />
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </div>
                : errorMessage !== null ?
                    <Alert variant="danger" onClose={ () => setErrorMessage(null) } >
                        <p>
                            { errorMessage }
                        </p>
                    </Alert>
                    : ''
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videos: state.er.videos,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.er.loading,
    apiError: state.sr.apiError
});

const mapDispatchToProps = dispatch => ({
    onFetchEvents: (refresh) => dispatch(fetchEvents(refresh)),
    onSelectEvent: (row) => {
        dispatch(fetchVideoUrl(row));
        dispatch(fetchEvent(row));
        dispatch(fetchSeries());
        dispatch(fetchSeriesDropDownList());
    },
    onRouteChange: (route) =>  dispatch(routeAction(route)),
    onDeselectRow : () => {
        dispatch(deselectRow());
        dispatch(deselectEvent());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);
