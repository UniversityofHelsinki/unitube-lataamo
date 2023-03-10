import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { downloadVideo } from '../actions/videosAction';
import { actionUpdateEventDetails, fetchTrashEvents } from '../actions/eventsAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import moment from 'moment';
import Loader from './Loader';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { fetchSeriesDropDownList } from '../actions/seriesAction';
import { VIDEO_PROCESSING_SUCCEEDED } from '../utils/constants';

const VIDEO_LIST_POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

const { SearchBar } = Search;

const TrashVideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);
    const translations = props.i18n.translations[props.i18n.locale];

    let [inputs, setInputs] = useState('');

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

    const updateEventDetails = async() => {
        const eventId = inputs.identifier;
        const updatedEvent = { ...inputs }; // values from the form
        // call unitube-proxy api
        try {
            await actionUpdateEventDetails(eventId, updatedEvent);
            props.onFetchEvents(false);
            setSuccessMessage(translate('event_returned'));
        } catch (err) {
            setErrorMessage(translate('failed_to_update_event_details'));
        }
    };

    const selectVideo = (identifier) => {
        let i;
        for (i = 0; i <  props.videos.length; i++) {
            if (props.videos[i].identifier === identifier) {
                return props.videos[i];
            }
        }
    };

    const returnVideoSubmit = async (event) => {
        if (event) {
            inputs = selectVideo(event.target.identifier.value);
            inputs.isPartOf = event.target.isPartOf.value;
            event.preventDefault();
            await updateEventDetails();
            setInputs('');
        }
    };

    const returnVideo = (cell, row) => {
        return (
            <div>
                {
                    <form onSubmit={returnVideoSubmit}>
                        <input type="hidden" name="identifier" value={row.identifier} />
                        <select required className="return return-event-series-list" disabled={row.processing_state !== VIDEO_PROCESSING_SUCCEEDED} name="isPartOf" value={inputs.isPartOf}  onChange={handleInputChange} data-cy="test-return-event-series-list">
                            <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                            { drawSelectionValues() }
                        </select>
                        <Button name="returnButton"  disabled={row.processing_state !== VIDEO_PROCESSING_SUCCEEDED} className="btn btn-primary return return-button" data-cy="test-return-event-button" type="submit">{translate('return_video')}</Button>
                    </form>
                }
            </div>
        );
    };

    const drawSelectionValues = () => {
        let series = [...props.series];
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
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
            setErrorMessage(translate(props.apiError));
        }
        const interval = setInterval(() => {
            props.onFetchEvents(false);
        }, VIDEO_LIST_POLL_INTERVAL);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [props.apiError, props.route]);

    useEffect(() => {
        const interval = setInterval( () => {
            setVideoDownloadErrorMessage(null);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const dateFormatter = (cell) => {
        return (<div>
            <a href='#' className="inactiveLink"> { moment(cell).utc().format('DD.MM.YYYY HH:mm:ss') } </a>
        </div>);
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

    const columns = [{ dataField: 'title',
        text: translate('video_title'),
        sort: true,
        formatter:(cell, row) => (
            <div>
                <a href='#' className="inactiveLink"> {row.title} </a>
            </div>
        )
    }, {
        dataField: 'created',
        text: translate('created'),
        type: 'date',
        sort: true,
        formatter: dateFormatter
    }, {
        dataField: 'identifier',
        text: translate('return_video'),
        formatter: returnVideo
    },
    {
        dataField: 'media',
        headerFormatter: downloadColumnFormatter,
        formatter: mediaFormatter,
        text: '',
    }
    ];

    const defaultSorted = [{
        dataField: 'title',
        order: 'desc'
    }];

    const NoDataIndication = () => (
        props.loading  ? <Loader /> : props.videos && props.videos.length === 0 ? translate('empty_trash_video_list') : ''
    );

    return (
        <div>
            <div className="margintop">
                <h2>{translate('trash_info')}</h2>
            </div>
            { successMessage ?
                <Alert variant="success" onClose={ () => setSuccessMessage(null) } dismissible>
                    <p>
                        { successMessage }
                    </p>
                </Alert>
                : <></>
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
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_deleted_videos') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps }
                                        pagination={ paginationFactory(options) } defaultSorted={ defaultSorted }
                                        noDataIndication={() => <NoDataIndication/>} bordered={ false } hover />
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
                    : <Loader loading={ translate('loading') }/>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videos: state.er.trashVideos,
    series : state.ser.seriesDropDown,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.er.loading,
    apiError: state.sr.apiError
});

const mapDispatchToProps = dispatch => ({
    onFetchEvents: (refresh) => {
        dispatch(fetchTrashEvents(refresh));
        dispatch(fetchSeriesDropDownList());
    },
    onRouteChange: (route) =>  dispatch(routeAction(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(TrashVideoList);
