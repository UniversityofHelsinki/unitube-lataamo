import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideo, fetchVideos } from '../actions/videosAction';
import { fetchEvent } from '../actions/eventsAction';
import { fetchSeries } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Video from './Video';
import VideoDetailsForm from './VideoDetailsForm';
import moment from 'moment';
import { Translate } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { VIDEO_PROCESSING_FAILED, VIDEO_PROCESSING_RUNNING } from '../utils/constants';

const { SearchBar } = Search;

const VideoList = (props) => {

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


    useEffect(() => {
        props.onFetchVideos();
        const interval = setInterval(() => {
            props.onFetchVideos();
        }, 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statusFormatter = (cell, row) => {
        return (
            <div>
                {
                    row.visibility.map((acl, index) =>
                        <p key={index}> {acl} </p>
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
        dataField: 'visibility',
        text: translate('publication_status'),
        formatter: statusFormatter
    }];

    const defaultSorted = [{
        dataField: 'created',
        order: 'desc'
    }];

    const videoNotSelectable = (processingState) => {
        return (processingState && (processingState === VIDEO_PROCESSING_RUNNING ||
            processingState === VIDEO_PROCESSING_FAILED ));
    };

    const nonSelectableRows = () => {
        let nonSelectableArray = [];
        props.videos.forEach(video => {
            if (videoNotSelectable(video.processing_state)) {
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
            props.onSelectVideo(row);
        }
    };


    const rowStyle = (row) => {
        const style = {};
        if (videoNotSelectable(row.processing_state)) {
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
            {!props.loading ?
                <div className="table-responsive">
                    <ToolkitProvider
                        bootstrap4
                        keyField="identifier"
                        data={translatedVideos()}
                        columns={columns}
                        search>
                        {
                            props => (
                                <div>
                                    <br/>
                                    <SearchBar {...props.searchProps} placeholder={translate('search')}/>
                                    <hr/>
                                    <BootstrapTable {...props.baseProps} selectRow={selectRow}
                                                    pagination={paginationFactory()} defaultSorted={defaultSorted}
                                                    noDataIndication="Table is Empty" bordered={false}
                                                    rowStyle={rowStyle}
                                                    hover/>
                                </div>
                            )
                        }
                    </ToolkitProvider>
                    <Video/>
                    <VideoDetailsForm/>
                </div>
                : (<Loader loading={translate('loading')} />)
            }
        </div>
    );
};

const mapStateToProps = state => ({
    videos: state.vr.videos,
    selectedRowId: state.vr.selectedRowId,
    i18n: state.i18n,
    loading: state.vr.loading
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos()),
    onSelectVideo: (row) => {
        dispatch(fetchVideo(row));
        dispatch(fetchEvent(row));
        dispatch(fetchSeries());
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);