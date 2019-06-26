import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideos, fetchVideo } from '../actions/videosAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Video from './Video';

const { SearchBar } = Search;

const VideoList = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    useEffect(() => {
        props.onFetchVideos();
        const interval = setInterval(() => {
            props.onFetchVideos();
        }, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [{
        dataField: 'identifier',
        text: translate('video_id'),
        hidden: true
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
    }];

    const defaultSorted = [{
        dataField: 'identifier',
        order: 'desc'
    }];


    const nonSelectableRows = () => {
        let nonSelectableArray = [];
        props.videos.forEach(video => {
            if (video.processing_state && video.processing_state === 'RUNNING') {
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
        if (row.processing_state === 'RUNNING') {
            style.backgroundColor = '#f4f5f9';
        }
        return style;
    };

    return (
        <div className="table-responsive">
            <ToolkitProvider
                bootstrap4
                keyField="identifier"
                data={ props.videos }
                columns={ columns }
                search
                defaultSorted={ defaultSorted }>
                {
                    props => (
                        <div>
                            <br />
                            <SearchBar { ...props.searchProps } placeholder={translate('search')} />
                            <hr />
                            <BootstrapTable { ...props.baseProps } selectRow={ selectRow } pagination={ paginationFactory() } noDataIndication="Table is Empty" bordered={ false } rowStyle={ rowStyle }  hover />
                        </div>
                    )
                }
            </ToolkitProvider>
            <Video />
        </div>
    );
};

const mapStateToProps = state => ({
    videos : state.vr.videos,
    selectedRowId : state.vr.selectedRowId,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos()),
    onSelectVideo: (row) => dispatch(fetchVideo(row))
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);