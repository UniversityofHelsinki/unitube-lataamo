import React, { useEffect } from 'react';
import { connect } from "react-redux";
import {fetchVideos} from "../actions/videosAction";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;

const VideoList = (props) => {

    // https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        props.onFetchVideos();
    }, []);

    const columns = [{
        dataField: 'identifier',
        text: 'Identifier',
        sort: true
    }, {
        dataField: 'title',
        text: 'Product Name',
        sort: true
    }, {
        dataField: 'duration',
        text: 'Video duration',
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
                            <h3>Input something at below input field:</h3>
                            <SearchBar { ...props.searchProps } />
                            <hr />
                            <BootstrapTable
                                { ...props.baseProps }
                            />
                        </div>
                    )
                }
            </ToolkitProvider>
        </div>
    );
};

const mapStateToProps = state => ({
    videos : state.vr.videos
});

const mapDispatchToProps = dispatch => ({
    onFetchVideos: () => dispatch(fetchVideos())
});


export default connect(mapStateToProps, mapDispatchToProps)(VideoList);