import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideos } from '../actions/videosAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';

const { SearchBar } = Search;

const VideoList = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    useEffect(() => {
        props.onFetchVideos();
    }, []);

    const columns = [{
        dataField: 'identifier',
        text: translations ? translations['video_id'] : '',
        sort: true
    }, {
        dataField: 'title',
        text: translations ? translations['video_title'] : '',
        sort: true
    }, {
        dataField: 'duration',
        text: translations ? translations['video_duration'] : '',
        sort: true
    }];

    const defaultSorted = [{
        dataField: 'identifier',
        order: 'desc'
    }];

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
                            <SearchBar { ...props.searchProps } placeholder="" />
                            <hr />
                            <BootstrapTable { ...props.baseProps } pagination={ paginationFactory() } />
                        </div>
                    )
                }
            </ToolkitProvider>
        </div>
    );
};

const mapStateToProps = state => ({
    videos : state.vr.videos,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos())
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);