import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { downloadVideo} from '../actions/videosAction';
import { fetchTrashEvents } from '../actions/eventsAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import moment from 'moment';
import Loader from './Loader';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { Button } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const { SearchBar } = Search;

const TrashVideoList = (props) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoDownloadErrorMessage, setVideoDownloadErrorMessage] = useState(null);
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
            let elements = document.getElementsByClassName("disable-enable-buttons");
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
            elements = document.getElementsByClassName("disable-enable-buttons");
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

    const dateFormatter = (cell) => {
        return moment(cell).utc().format('DD.MM.YYYY HH:mm:ss');
    };

    const columns = [{dataField: 'title',
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
    }];

    const defaultSorted = [{
        dataField: 'title',
        order: 'desc'
    }];

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        clickToEdit: true,
        hideSelectColumn: true,
        bgColor: '#8cbdff',
        selected: [props.selectedRowId]
    };


    const rowStyle = (row) => {
        const style = {};
        return style;
    };

    return (
        <div>
            <div className="margintop">
                <h2>{translate('trash_info')}</h2>
            </div>
            { !props.loading && !errorMessage ?
                <div className="table-responsive">

                    {videoDownloadErrorMessage ?
                        <Alert variant="danger" onClose={() => setVideoDownloadErrorMessage(null)}>
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
                                    <SearchBar { ...props.searchProps } placeholder={ translate('search') }/>
                                    <BootstrapTable { ...props.baseProps } selectRow={ selectRow }
                                                    pagination={ paginationFactory(options) } defaultSorted={ defaultSorted }
                                                    noDataIndication={ translate('empty_video_list') } bordered={ false }
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
                    : <Loader loading={ translate('loading') }/>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videos: state.er.trashVideos,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.er.loading,
    apiError: state.sr.apiError
});

const mapDispatchToProps = dispatch => ({
    onFetchEvents: (refresh, inbox) => dispatch(fetchTrashEvents(refresh, inbox)),
    onRouteChange: (route) =>  dispatch(routeAction(route))
});


export default connect(mapStateToProps, mapDispatchToProps)(TrashVideoList);
