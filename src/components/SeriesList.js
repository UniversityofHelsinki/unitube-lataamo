import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSeries } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {Link} from "react-router-dom";
import {Translate} from "react-redux-i18n";


const { SearchBar } = Search;

const SeriesList = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const columns = [{
        dataField: 'identifier',
        text: translate('serie_id'),
        sort: true
    }, {
        dataField: 'title',
        text: translate('serie_title'),
        sort: true
    }, {
        dataField: 'contributors',
        text: translate('serie_contributors'),
        sort:true
    }];

    const defaultSorted = [{
        dataField: 'identifier',
        order: 'desc'
    }];

    useEffect(() => {
        props.onFetchSeries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <div className="margintop">
                <Link to="/uploadSeries" className="btn btn-primary">
                    <Translate value="add_series"/>
                </Link>
            </div>
            <ToolkitProvider
                bootstrap4
                keyField="identifier"
                data={ props.series }
                columns={ columns }
                search
                defaultSorted={ defaultSorted }>
                {
                    props => (
                        <div>
                            <br />
                            <SearchBar { ...props.searchProps } placeholder={translate('search')} />
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
    i18n: state.i18n,
    series : state.ser.series
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries())
});



export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);