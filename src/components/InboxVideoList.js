import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { downloadVideo, fetchVideoUrl } from '../actions/videosAction';
import {
    actionMoveEventToTrashSeries,
    deselectEvent,
    deselectRow, fetchDeletionDate,
    fetchEvent,
    fetchInboxEvents, updateEventList
} from '../actions/eventsAction';
import { fetchSeries, fetchSeriesDropDownList } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoDetailsForm from './VideoDetailsForm';
import moment from 'moment';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import constants, {
    VIDEO_PROCESSING_INSTANTIATED,
    VIDEO_PROCESSING_RUNNING
} from '../utils/constants';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import UploadButton from './UploadButton';

const VIDEO_LIST_POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

const { SearchBar } = Search;

const InboxVideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [progressMessage, setProgressMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);
    const [videoDeleteErrorMessage, setVideoDeleteErrorMessage] = useState(null);
    const translations = props.i18n.translations[props.i18n.locale];
    const [disabledInputs, setDisabledInputs] = useState(false);

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const getFileName = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.persist();
            event.preventDefault();
            event.target.downloadIndicator.removeAttribute('hidden');
            let elements = document.getElementsByClassName('disable-enable-buttons');
            let array = [ ...elements ];
            array.map(element => element.setAttribute('disabled', 'disabled'));
            const data = { 'mediaUrl':  event.target.mediaUrl.value };
            const fileName = getFileName(event.target.mediaUrl.value);
            try {
                await downloadVideo(data, fileName);
            } catch (error) {
                setVideoDownloadErrorMessage(translate('error_on_video_download'));
            }
            elements = document.getElementsByClassName('disable-enable-buttons');
            array = [ ...elements ];
            array.map(element => element.removeAttribute('disabled'));
            event.target.downloadIndicator.setAttribute('hidden', true);
        }
    };

    const mediaFormatter = (cell, row) => {
        const labels = {
            resolution: (x,y) => `${x}x${y}`,
            bitrate: (bitrate) => `${Math.round(bitrate/1000)} kbps`,
            size: (duration, bitrate) => `${Math.max(1, Math.round((duration/1000) * (bitrate/8) / 10**6))} MB`
        };
        return (
            <div className="form-container">
                {
                    row.media.map((media, index) =>
                        <form key={index} onSubmit={handleSubmit}>
                            <input type="hidden" name="mediaUrl" value={media} />
                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">{`${labels.resolution(row.publications[media].width, row.publications[media].height)} - ${labels.bitrate(row.publications[media].bitrate)} - ${labels.size(row.publications[media].duration, row.publications[media].bitrate)}`}</Tooltip>}>
                                <Button name="downloadButton" className="disable-enable-buttons" variant="link" type="submit"><FiDownload></FiDownload></Button>
                            </OverlayTrigger>
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

    const options = {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '30', value: 30
        }]
    };

    useEffect( () => {
    }, [disabledInputs, progressMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            props.onFetchEvents(false);
            if (props.selectedRowId && props.videos) {
                let selectedEvent = props.videos.find(event => event.identifier === props.selectedRowId);
                if (selectedEvent && selectedEvent.processing_state && selectedEvent.processing_state === constants.VIDEO_PROCESSING_SUCCEEDED) {
                    props.onSelectEvent({ identifier: props.selectedRowId });
                }
            }
        }, VIDEO_LIST_POLL_INTERVAL);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [props.selectedRowId, props.videos, disabledInputs]);

    useEffect(() => {
        props.onFetchEvents(true);
        props.onRouteChange(props.route);
        if (props.apiError) {
            setErrorMessage(translate(props.apiError));
        }
        // eslint-disable-next-line
    }, [props.apiError, props.route, disabledInputs]);

    useEffect(() => {
        const interval = setInterval( () => {
            setVideoDownloadErrorMessage(null);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const dateFormatter = (cell) => {
        return (<div>
            <a href='#' className="inactiveLink"> {moment(cell).local().format('DD.MM.YYYY HH:mm:ss')} </a>
        </div>);
    };

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
        if(e.target.classList.contains('disabled')){
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

    const stateFormatter = (cell, row) => {
        if(cell === constants.VIDEO_PROCESSING_SUCCEEDED){
            return (<div>
                <a href='#' className="inactiveLink"> {translate('event_succeeded_state')} </a>
            </div>);
        } else if (cell === VIDEO_PROCESSING_INSTANTIATED || cell === VIDEO_PROCESSING_RUNNING) {
            return (<div>
                <a href='#' className="inactiveLink"> {translate('event_running_and_instantiated_state')} </a>
            </div>);
        } else {
            return (
                <div>
                    <a href='#' className="inactiveLink"> {translate('event_failed_state')} </a>
                    <button id={row.identifier} className="btn delete-button delete-button-list" onClick={(e) => deleteEvent(e,row)}>{translate('delete_event')}</button>
                </div>
            );
        }
    };

    const downloadColumnFormatter = (column, colIndex, components) => {
        return (
            <div>
                <span style={{ paddingRight: '10px', position: 'relative', top: '4px' }}>{translate('download_video')}</span>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('download_video_info')}</Tooltip>}>
                    <span className="d-inline-block">
                        <Button disabled style={{ pointerEvents: 'none', paddingTop: '0px', paddingBottom: '0px' }}>{translate('info_box_text')}</Button>
                    </span>
                </OverlayTrigger>
            </div>
        );
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
        sort: true,
        formatter: (cell, row) => (
            <div>
                <a href='#' className="inactiveLink"> {row.title} </a>
            </div>
        )
    }, {
        dataField: 'duration',
        text: translate('video_duration'),
        sort: true,
        formatter: (cell, row) => (
            <div>
                <a href='#' className="inactiveLink"> {row.duration} </a>
            </div>
        )
    }, {
        dataField: 'processing_state',
        text: translate('processing_state'),
        sort: true,
        formatter: stateFormatter
    }, {
        dataField: 'media',
        formatter: mediaFormatter,
        headerFormatter: downloadColumnFormatter,
        text: '',
    }];

    const defaultSorted = [{
        dataField: 'created',
        order: 'desc'
    }];

    const eventNotSelectable = (processingState) => {
        return (processingState && (processingState !== constants.VIDEO_PROCESSING_SUCCEEDED));
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

    const expandRow = {
        parentClassName: 'parent-expand',
        renderer: row => (
            <VideoDetailsForm inbox="true"/>
        ),
        onlyOneExpanding: true,
        onExpand: (row, isExpand, rowIndex, e) => {
            if(isExpand) {
                props.onSelectEvent(row);
            }
        },
        nonExpandable: nonSelectableRows()
    };

    const NoDataIndication = () => (
        props.loading  ? <Loader /> : props.videos && props.videos.length === 0 ? translate('empty_inbox_video_list') : ''
    );


    const rowStyle = (row) => {
        const style = {};
        if (eventNotSelectable(row.processing_state)) {
            style.backgroundColor = '#f4f5f9';
        }
        style.cursor = 'pointer';
        return style;
    };

    return (
        <div>
            <UploadButton alreadyFetched={true} />
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
                                <div>
                                    <br/>
                                    <div className='info-text marginbottom-small'>{ translate('search_events_info') } </div>
                                    <div className="form-group has-search">
                                        <span className="form-control-feedback"><FaSearch /></span>
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_events') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps } expandRow={ expandRow }
                                        pagination={ paginationFactory(options) } defaultSorted={ defaultSorted }
                                        noDataIndication={ () => <NoDataIndication /> } bordered={ false }
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
        dispatch(fetchDeletionDate(row.identifier));
    },
    onRouteChange: (route) =>  dispatch(routeAction(route)),
    onDeselectRow : () => {
        dispatch(deselectRow());
        dispatch(deselectEvent());
    },
    onEventDetailsEdit: (inbox, updatedVideos) => dispatch(updateEventList(inbox, updatedVideos))
});


export default connect(mapStateToProps, mapDispatchToProps)(InboxVideoList);
