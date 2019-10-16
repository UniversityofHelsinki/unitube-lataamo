import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    fetchSerie,
    fetchSeries,
    clearPostSeriesSuccessMessage,
    emptyMoodleNumber,
    emptyIamGroupsCall
} from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Loader from './Loader';
import SerieDetailsForm from './SerieDetailsForm';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import Alert from 'react-bootstrap/Alert';


const { SearchBar } = Search;

const SeriesList = (props) => {

    const [errorMessage, setErrorMessage] = useState(null);

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    useEffect(() => {
        const interval = setInterval(() => {
            props.onClearPostSeriesSuccessMessage();
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const contributorsFormatter = (cell, row) => {
        return (
            <div>
                {
                    row.contributors.map((contributor, index) =>
                        <p key={ index }> { contributor } </p>
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
        sort: true,
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
        if (props.apiError) {
            setErrorMessage(props.apiError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.apiError]);
    return (
        <div>
            {props.seriesPostSuccessMessage !== null ?
                <Alert variant="success">
                    <p>
                        {props.seriesPostSuccessMessage}
                    </p>
                </Alert>
                : (<></>)
            }
            <div className="margintop">
                <Link to="/uploadSeries" onClick={() => {props.emptyMoodleNumber(); props.onEmptyIamGroups(); props.onClearPostSeriesSuccessMessage();}} className="btn btn-primary">
                    <Translate value="add_series"/>
                </Link>
            </div>
            { !props.loading && !errorMessage ?
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
                                <br/>
                                <SearchBar { ...props.searchProps } placeholder={ translate('search') }/>
                                <hr/>
                                <BootstrapTable { ...props.baseProps } selectRow={ selectRow }
                                    pagination={ paginationFactory() } rowStyle={ rowStyle } hover/>
                            </div>
                        )
                    }
                </ToolkitProvider>
                : errorMessage !== null ?
                    <Alert variant="danger" onClose={ () => setErrorMessage(null) } >
                        <p>
                            { errorMessage }
                        </p>
                    </Alert>
                    : <Loader loading={ translate('loading') }/>
            }
            <SerieDetailsForm/>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    series: state.ser.series,
    loading: state.ser.loading,
    selectedRowId: state.ser.selectedRowId,
    apiError: state.sr.apiError,
    seriesPostSuccessMessage : state.ser.seriesPostSuccessMessage
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries()),
    onSelectSerie: (row) => {
        dispatch(fetchSerie(row));
    },
    emptyMoodleNumber: () => dispatch(emptyMoodleNumber()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onClearPostSeriesSuccessMessage: () => dispatch(clearPostSeriesSuccessMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);