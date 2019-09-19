import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSerie, fetchSeries } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import SerieDetailsForm from './SerieDetailsForm';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';


const { SearchBar } = Search;

const SeriesList = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const contributorsFormatter = (cell, row) => {
        return (
            <div>
                {
                    row.contributors.map((contributor, index) =>
                        <p key={index}> {contributor} </p>
                    )
                }
            </div>
        );
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
        sort:true,
        formatter: contributorsFormatter
    }];

    const defaultSorted = [{
        dataField: 'identifier',
        order: 'desc'
    }];

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        clickToEdit: true,
        hideSelectColumn: true,
        bgColor: '#8cbdff',
        selected: [props.selectedRowId],
        onSelect: (row) => {
            props.onSelectSerie(row);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const rowStyle = (row) => {
        const style = {};
        return style;
    };

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
                            <BootstrapTable { ...props.baseProps } selectRow={selectRow} pagination={ paginationFactory() }  rowStyle={rowStyle} hover/>
                        </div>
                    )
                }
            </ToolkitProvider>
            <SerieDetailsForm/>
        </div>
    );
};

const mapStateToProps = state => ({
    series : state.ser.series,
    selectedRowId: state.ser.selectedRowId,
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries()),
    onSelectSerie: (row) => {
        dispatch(fetchSerie(row));
        dispatch(fetchSeries());
    }
});



export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);