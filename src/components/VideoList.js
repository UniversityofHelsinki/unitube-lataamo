import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideos } from '../actions/videosAction';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';


const { SearchBar } = Search;

const VideoList = (props) => {

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

    const pageButtonRenderer = ({
        page,
        active,
        onPageChange
    }) => {
        const handleClick = (e) => {
            e.preventDefault();
            onPageChange(page);
        };
        const activeStyle = {};
        if (active) {
            activeStyle.backgroundColor = 'black';
            activeStyle.color = 'white';
        } else {
            activeStyle.backgroundColor = 'gray';
            activeStyle.color = 'black';
        }
        if (typeof page === 'string') {
            activeStyle.backgroundColor = 'white';
            activeStyle.color = 'black';
        }
        return (
            <li className="page-item">
                <a className="page-link" href="#" onClick={ handleClick } style={ activeStyle }>{ page }</a>
            </li>
        );
    };

    const options = {
        pageButtonRenderer
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
                            <SearchBar { ...props.searchProps } placeholder="" />
                            <hr />
                            <BootstrapTable { ...props.baseProps } pagination={ paginationFactory(options) } />
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