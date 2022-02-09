import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { downloadVideo } from '../actions/videosAction';
import { actionUpdateEventDetails, fetchTrashEvents } from '../actions/eventsAction';
import { fetchSeriesDropDownList } from '../actions/seriesAction';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { FiDownload } from 'react-icons/fi';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import {
    VIDEO_PROCESSING_SUCCEEDED
} from '../utils/constants';
import {
    dateFormatter,
    getFileName,
    hideErrorMessageAfter,
    noDataIndication,
    paginationOptions,
    viewErrorMessage
} from '../utils/videoListUtils';

const { SearchBar } = Search;

const TrashVideoList = (props) => {
    const translations = props.i18n.translations[props.i18n.locale];
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);

    let [inputs, setInputs] = useState('');

    const translate = (key) => {
        return translations ? translations[key] : '';
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

    useEffect(viewErrorMessage(props, setErrorMessage, translate(props.apiError)),
        [props.apiError, props.route]);

    useEffect(hideErrorMessageAfter(setVideoDownloadErrorMessage, 60000), []);

    const columns = [{
        dataField: 'title',
        text: translate('video_title'),
        sort: true
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
        text: translate('download_video'),
        formatter: mediaFormatter,
    }];

    const defaultSorted = [{
        dataField: 'title',
        order: 'desc'
    }];

    return (
        <div className="margintop marginbottom">
            <h2>{translate('trash_info')}</h2>
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
                                <div className="margintop">
                                    <label className='info-text'>{ translate('search_events_info') }</label>
                                    <div className="form-group has-search">
                                        <span className="form-control-feedback"><FaSearch/></span>
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_deleted_videos') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps }
                                        pagination={ paginationFactory(paginationOptions) }
                                        defaultSorted={ defaultSorted }
                                        noDataIndication={ noDataIndication(props.loading, translate('empty_trash_video_list')) }
                                        bordered={ false }
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
