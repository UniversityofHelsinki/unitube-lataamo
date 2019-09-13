import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSerie, fetchSeries } from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import SerieDetailsForm from "./SerieDetailsForm";

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