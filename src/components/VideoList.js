import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchVideoUrl, downloadVideo } from '../actions/videosAction';
import { fetchEvent, fetchEvents, deselectEvent, deselectRow, fetchDeletionDate } from '../actions/eventsAction';
import { fetchSeries, fetchSeriesDropDownList } from '../actions/seriesAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import VideoDetailsForm from './VideoDetailsForm';
import moment from 'moment';
import Loader from './Loader';
import { VIDEO_PROCESSING_INSTANTIATED, VIDEO_PROCESSING_RUNNING } from '../utils/constants';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { FiDownload } from 'react-icons/fi';
import { FaSpinner, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import constants from '../utils/constants';
import UploadButton from './UploadButton';

const { SearchBar } = Search;

const VideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    // eslint-disable-next-line no-unused-vars
    let [media, setMedia] = useState({ column: 'media', expanded: '' });
    const translations = props.i18n.translations[props.i18n.locale];
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);
    const VIDEO_LIST_POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

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
            let elements = document.getElementsByClassName('disable-enable-buttons');
            let array = [ ...elements ];
            array.map(element => element.setAttribute('disabled', 'disabled'));
            event.target.downloadIndicator.removeAttribute('hidden');
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


    // the only translated property is the visibility value
    const translatedVideos = () => {
        return props.videos.map(video => {
            return {
                ...video,
                visibility: video.visibility.map(visibilityKey => translate(visibilityKey))
            };
        });
    };

    const NoDataIndication = () => (
        props.loading  ? <Loader /> : props.videos && props.videos.length === 0 ? translate('empty_video_list') : ''
    );

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
    }, [props.selectedRowId, props.videos]);


    useEffect(() => {
        props.onFetchEvents(true);
        props.onRouteChange(props.route);
        if (props.apiError) {
            setErrorMessage(translate(props.apiError));
        }
        // eslint-disable-next-line
    }, [props.apiError, props.route]);

    useEffect(() => {
        const interval = setInterval( () => {
            setVideoDownloadErrorMessage(null);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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

    const dateFormatter = (cell) => {
        return moment(cell).local().format('DD.MM.YYYY HH:mm:ss');
    };

    const compareDates = (cellDate) => {
        let afterThreeMonths = addMonthsToNotifiedDate(3);
        let afterThreeMonthsPlusOneWeek = addDays(afterThreeMonths, 7);
        if (cellDate.getTime() <= afterThreeMonthsPlusOneWeek.getTime()) {
            return true;
        } else {
            return false;
        }
    };

    const dateFormatterAndWarning = (cell) => {
        let cellDate = new Date(cell);
        let showWarning = compareDates(cellDate);
        let cellDateFormat = moment(cellDate).format('DD.MM.YYYY');
        return <div> {cellDateFormat} {showWarning ? <FaExclamationTriangle size={25} className='fa_custom'/> : null}</div>;
    };

    const addMonthsToNotifiedDate = (amountOfMonths) => {
        let notifiedDate = new Date();
        notifiedDate.setFullYear(notifiedDate.getFullYear(), notifiedDate.getMonth() + amountOfMonths);
        return notifiedDate;
    };

    const addDays = (notifiedDate, numberOfDays) => {
        notifiedDate.setDate(notifiedDate.getDate() + numberOfDays);
        return notifiedDate;
    };

    const stateFormatter = (cell) => {
        if(cell === constants.VIDEO_PROCESSING_SUCCEEDED){
            return translate('event_succeeded_state');
        } else if (cell === VIDEO_PROCESSING_INSTANTIATED || cell === VIDEO_PROCESSING_RUNNING) {
            return translate('event_running_and_instantiated_state');
        }else {
            return translate('event_failed_state');
        }
    };

    const downloadColumnFormatter = (column, colIndex, components) => {
        return (
            <div>
                <span style={{ paddingRight: '10px', position: 'relative', top: '4px'  }}>{translate('download_video')}</span>
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('download_video_info')}</Tooltip>}>
                    <span className="d-inline-block">
                        <Button disabled style={{
                            pointerEvents: 'none',
                            paddingTop: '0px',
                            paddingBottom: '0px'
                        }}>{translate('info_box_text')}</Button>
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
        formatter: dateFormatter,
        headerStyle: (colum, colIndex) => {
            return { width: '180px' };
        }
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
        dataField: 'archived_date',
        text: translate('archived_date'),
        sort: true,
        formatter: dateFormatterAndWarning,
        title:  (cell, row, rowIndex, colIndex) => {
            return 'varoitus-warning';
        },
        headerStyle: (colum, colIndex) => {
            return { width: '180px' };
        }
    }, {
        dataField: 'media',
        headerFormatter: downloadColumnFormatter,
        formatter: mediaFormatter,
        text: '',
        //näin saadaan estettyä haitarin avautuminen, kun klikataan download tallenne
        events: {
            // eslint-disable-next-line no-unused-vars
            onClick: (e, column, columnIndex, row, rowIndex) => {
                setMedia( {
                    column: 'media',
                    expanded: false //tämä estää haitarin avautumisen
                });
            }
        }
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
            <VideoDetailsForm inbox="false"/>
        ),
        onlyOneExpanding: true,
        onExpand: (row, isExpand, rowIndex, e) => {
            if(isExpand) {
                props.onSelectEvent(row);
            }
        },
        nonExpandable: nonSelectableRows()
    };


    const rowStyle = (row) => {
        const style = {};
        if (eventNotSelectable(row.processing_state)) {
            style.backgroundColor = '#f4f5f9';
        }
        style.cursor = 'pointer';
        return style;
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

    return (
        <div>
            <UploadButton alreadyFetched={false} />
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
                                    <div className='info-text'>{ translate('search_events_info') } </div>
                                    <div className="form-group has-search">
                                        <span className="form-control-feedback"><FaSearch /></span>
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_events') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps } expandRow={ expandRow }
                                        pagination={ paginationFactory(options) } defaultSorted={ defaultSorted }
                                        noDataIndication={() => <NoDataIndication /> } bordered={ false }
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
        dispatch(fetchDeletionDate(row.identifier));
    },
    onRouteChange: (route) =>  dispatch(routeAction(route)),
    onDeselectRow : () => {
        dispatch(deselectRow());
        dispatch(deselectEvent());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);
