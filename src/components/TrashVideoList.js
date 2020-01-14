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
import { fetchSeries } from '../actions/seriesAction';
import constants from '../utils/constants';

const { SearchBar } = Search;

const TrashVideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);

    const [inputs, setInputs] = useState(null);
    const [isBeingEdited, setIsBeingEdited] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState('voi');

    const translations = props.i18n.translations[props.i18n.locale];

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
        return (
            <div className="form-container">
                {
                    row.media.map((media, index) =>
                        <form key={index} onSubmit={handleSubmit}>
                            <input type="hidden" name="mediaUrl" value={media} />
                            <Button name="downloadButton" className="disable-enable-buttons" variant="link" type="submit"><FiDownload></FiDownload></Button>
                            <Button name="downloadIndicator" hidden disabled variant="link"><FaSpinner className="icon-spin"></FaSpinner></Button>
                        </form>
                    )
                }
            </div>
        );
    };

    const updateEventDetails = async() => {
        //props.video.processing_state = constants.VIDEO_PROCESSING_INSTANTIATED;
        console.log('s:', selectedSeries);
        console.log('is:' + isBeingEdited);
        const eventId = inputs.identifier;
        const updatedEvent = { ...inputs }; // values from the form
        // call unitube-proxy api
        try {
            // await actionUpdateEventDetails(eventId, updatedEvent);
            // setSuccessMessage(translate('updated_event_details'));
            // update the eventlist to redux state
            //const updatedVideos = props.inbox === 'true' ? getUpdatedInboxVideos(eventId, updatedEvent) : getUpdatedVideos(eventId, updatedEvent);
            //props.onEventDetailsEdit(props.inbox, updatedVideos);
        } catch (err) {
            setErrorMessage(translate('failed_to_update_event_details'));
        }
    };

    const returnVideoSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            // setDisabledInputs(true);
            await updateEventDetails();
        }
    };

    const returnVideo = (cell, row) => {
        return (
            <div className="form-container">
                {
                    row.media.map((media, index) =>
                        <form key={index} onSubmit={returnVideoSubmit}>
                            <Button name="returnButton" className="btn btn-primary" type="submit">{translate('return_video')}</Button>
                        </form>
                    )
                }
            </div>
        );
    };

    const drawSelectionValues = () => {
        let series = [...props.series];
        //console.log('series:', series);
        series.sort((a,b) => a.title.localeCompare(b.title, 'fi'));
        return series.map((series) => {
            return <option key={series.identifier} id={series.identifier} value={series.identifier}>{series.title}</option>;
        });
    };

    const handleInputChange = (event) => {
        event.persist();
        setIsBeingEdited(true);
        setSelectedSeries('moi');
        console.log('sel:' + selectedSeries);
        console.log('is:' + isBeingEdited);
        //setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const series = () => {
        return (
            <div className="form-group row">
                <div className="col-sm-8">
                    <select onChange={handleInputChange}>
                        { drawSelectionValues() }
                    </select>

                </div>
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

    useEffect(() => {
        console.log('sel:' + selectedSeries);
        console.log('is:' + isBeingEdited);
        props.onRouteChange(props.route);
        props.onFetchEvents(true);
        if (props.apiError) {
            setErrorMessage(props.apiError);
        }
        const interval = setInterval(() => {
            props.onFetchEvents(false);
        }, 60000);
        // if (!isBeingEdited) {
        //     setInputs(props.videos[0]);
        // }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.apiError, props.route, selectedSeries]);

    useEffect(() => {
        const interval = setInterval( () => {
            setVideoDownloadErrorMessage(null);
        }, 60000);
        return () => clearInterval(interval);
    }, [selectedSeries]);

    const dateFormatter = (cell) => {
        return moment(cell).utc().format('DD.MM.YYYY HH:mm:ss');
    };

    const columns = [{ dataField: 'title',
        text: translate('video_title'),
        sort: true
    }, {
        dataField: 'created',
        text: translate('created'),
        type: 'date',
        sort: true,
        formatter: dateFormatter
    }, {
        dataField: 'media',
        text: translate('download_video'),
        formatter: mediaFormatter,
    }, {
        dataField: 'returnvideoField',
        text: translate('return_video'),
        formatter: returnVideo,
    }, {
        dataField: 'seriesField',
        text: translate('series'),
        formatter: series,
    }];

    const defaultSorted = [{
        dataField: 'title',
        order: 'desc'
    }];

    const NoDataIndication = () => (
        props.loading  ? <Loader /> : props.videos && props.videos.length === 0 ? translate('empty_video_list') : ''
    );

    return (
        <div>
            <div className="margintop">
                <h2>{translate('trash_info')}</h2>
            </div>
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
                                    <label className='info-text'>{ translate('search_events_info') } </label>
                                    <div className="form-group has-search">
                                        <span className="fa fa-search form-control-feedback"><FaSearch /></span>
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
    series: state.ser.series,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.er.loading,
    apiError: state.sr.apiError
});

const mapDispatchToProps = dispatch => ({
    onFetchEvents: (refresh, inbox) => {
        dispatch(fetchTrashEvents(refresh, inbox));
        dispatch(fetchSeries(true));
    },
    onRouteChange: (route) =>  dispatch(routeAction(route))
});


export default connect(mapStateToProps, mapDispatchToProps)(TrashVideoList);
