import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchVideoUrl } from '../actions/videosAction';
import {
    actionMoveEventToTrashSeries,
    deselectEvent,
    deselectRow,
    fetchEvent,
    fetchInboxEvents,
    updateEventList
} from '../actions/eventsAction';
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
    hideErrorMessageAfter,
    noDataIndication,
    paginationOptions,
    rowStyle,
    getExpandRowProps,
    viewErrorMessage,
    updateProcessedEventInfo,
    stateFormatter
} from '../utils/videoListUtils';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { FiDownload } from 'react-icons/fi';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const { SearchBar } = Search;

const InboxVideoList = (props) => {
    const translations = props.i18n.translations[props.i18n.locale];
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [progressMessage, setProgressMessage] = useState(null);
    const [videoDeleteErrorMessage, setVideoDeleteErrorMessage] = useState(null);
    const [disabledInputs, setDisabledInputs] = useState(false);

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

    useEffect(() => {},
        [disabledInputs, progressMessage]);

    useEffect(updateProcessedEventInfo(props),
        [props.selectedRowId, props.videos, disabledInputs]);

    useEffect(viewErrorMessage(props, setErrorMessage, translate(props.apiError)),
        [props.apiError, props.route, disabledInputs]);

    useEffect(hideErrorMessageAfter(setVideoDownloadErrorMessage, 60000), []);

    const moveEventToTrashSeries = async(deletedEvent) => {
        const eventId = deletedEvent.identifier;
        try {
            await actionMoveEventToTrashSeries(eventId, deletedEvent);
            await props.onFetchEvents(true);
            setSuccessMessage(translate('succeeded_to_delete_event'));
        } catch (err) {
            setVideoDeleteErrorMessage(translate('failed_to_delete_event'));
        }
        setDisabledInputs(false);
    };

    const deleteEvent = async (e, deletedEvent) => {
        e.preventDefault();
        e.persist();
        if (e.target.classList.contains('disabled')){
            return false;
        }
        setProgressMessage(translate('progress_message_delete_event'));
        setDisabledInputs(true);

        let element = document.getElementById(deletedEvent.identifier);
        element.setAttribute('disabled', 'disabled');

        let elements = document.getElementsByClassName('delete-button-list');
        let array = [...elements];
        array.map(element => element.setAttribute('disabled', 'disabled'));

        await moveEventToTrashSeries(deletedEvent);

        elements = document.getElementsByClassName('delete-button-list');
        array = [ ...elements ];
        array.map(element => element.removeAttribute('disabled'));
        setProgressMessage(null);
    };

    const stateFormatterInbox = (cell, row) => stateFormatter(cell, row, true);

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
        formatter: stateFormatterInbox
    }, {
        dataField: 'media',
        text: translate('download_video'),
        formatter: mediaFormatter,
    }];

    const defaultSorted = [{
        dataField: 'created',
        order: 'desc'
    }];

    const expandRow = getExpandRowProps(props.videos, props.onSelectEvent, true);

    return (
        <div className="margintop marginbottom">
            <Link to="/uploadVideo" className="btn btn-primary">
                <Translate value="add_video"/>
            </Link>
            {progressMessage !== null ?
                <Alert variant="warning" onClose={() => setProgressMessage(null)} dismissible>
                    <p>
                        {progressMessage}
                    </p>
                </Alert>
                : (<></>)
            }
            {successMessage !== null ?
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    <p>
                        {successMessage}
                    </p>
                </Alert>
                : (<></>)
            }
            {videoDeleteErrorMessage ?
                <Alert className="position-fixed" variant="danger" onClose={() => setVideoDeleteErrorMessage(null)} dismissible>
                    <p>
                        {videoDeleteErrorMessage}
                    </p>
                </Alert> : ''
            }
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
                                        noDataIndication={ noDataIndication(props.loading, translate('empty_inbox_video_list')) }
                                        bordered={ false }
                                        rowStyle={ rowStyle }
                                        hover/>
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
        dispatch(fetchSeries());
        dispatch(fetchSeriesDropDownList());
    },
    onRouteChange: (route) =>  dispatch(routeAction(route)),
    onDeselectRow : () => {
        dispatch(deselectRow());
        dispatch(deselectEvent());
    },
    onEventDetailsEdit: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});


export default connect(mapStateToProps, mapDispatchToProps)(InboxVideoList);
