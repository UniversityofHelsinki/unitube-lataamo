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
    }

    useEffect(() => {
        props.onFetchVideos();
    }, []);

    const columns = [{
        dataField: 'identifier',
        text: translate('video_id'),
        sort: true
    }, {
        dataField: 'title',
        text: translate('video_title'),
        sort: true
    }, {
        dataField: 'duration',
        text: translate('video_duration'),
        sort: true
    }];

    const defaultSorted = [{
        dataField: 'identifier',
        order: 'desc'
    }];

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        onSelect: (row) => {
            console.log(row.identifier);
            props.onSelectVideo(row);
        }
    };

    return (

        <div>
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
                            <BootstrapTable { ...props.baseProps } selectRow={ selectRow } pagination={ paginationFactory() } />
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
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos()),
    onSelectVideo: (row) => dispatch(fetchVideo(row))
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);