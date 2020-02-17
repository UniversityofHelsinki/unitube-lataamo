import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    clearPostSeriesSuccessMessage,
    emptyIamGroupsCall,
    emptyMoodleNumber,
    emptyPersons,
    fetchSerie,
    fetchSeries
} from '../actions/seriesAction';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Loader from './Loader';
import SerieDetailsForm from './SerieDetailsForm';
import { Link } from 'react-router-dom';
import { Translate } from 'react-redux-i18n';
import Alert from 'react-bootstrap/Alert';
import routeAction from '../actions/routeAction';
import { FaSearch } from 'react-icons/fa';


const { SearchBar } = Search;

const SeriesList = (props) => {

    const [errorMessage, setErrorMessage] = useState(null);

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    useEffect(() => {
        props.onRouteChange(props.route);
        const interval = setInterval(() => {
            props.onClearPostSeriesSuccessMessage();
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const translatedSeries = () => {
        return props.series.map(series => {
            return {
                ...series,
                visibility: series.visibility.map(visibilityKey => translate(visibilityKey))
            };
        });
    };

    const NoDataIndication = () => (
        props.loading  ? <Loader /> : props.series && props.series.length === 0 ? translate('empty_series_list') : ''
    );


    const statusFormatter = (cell, row) => {
        return (
            <div>
                {
                    row.visibility.map((acl, index) =>
                        <p key={ index }> { acl } </p>
                    )
                }
            </div>
        );
    };

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
        text: translate('series_id'),
        sort: true,
        hidden: true
    }, {
        dataField: 'title',
        text: translate('serie_title'),
        sort: true,
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
            if (order === 'desc') {
                return rowA.title.localeCompare(rowB.title, 'fi');
            } else {
                return rowB.title.localeCompare(rowA.title, 'fi');
            }
        }
    }, {
        dataField: 'contributors',
        text: translate('serie_contributors'),
        sort: true,
        formatter: contributorsFormatter
    }, {
        dataField: 'eventsCount',
        text: translate('events_count'),
        sort: true
    },{
        dataField: 'visibility',
        text: translate('series_publication_status'),
        formatter: statusFormatter
    }];

    const defaultSorted = [{
        dataField: 'title',
        order: 'desc'
    }];

    const expandRow = {
        parentClassName: 'parent-expand',
        renderer: row => (
            <SerieDetailsForm/>
        ),
        onlyOneExpanding: true,
        onExpand: (row, isExpand, rowIndex, e) => {
            if(isExpand) {
                props.onSelectSeries(row);
            }
        }
    };

    const options = {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '30', value: 30
        }]
    };

    useEffect(() => {
        props.onFetchSeries();
        if (props.apiError) {
            setErrorMessage(translate(props.apiError));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.apiError]);
    return (
        <div>
            {props.seriesPostSuccessMessage !== null ?
                <Alert variant="success">
                    <p>
                        {translate(props.seriesPostSuccessMessage)}
                    </p>
                </Alert>
                : (<></>)
            }
            <div className="margintop">
                <Link to="/uploadSeries" onClick={() => {props.emptyPersons(); props.emptyMoodleNumber(); props.onEmptyIamGroups(); props.onClearPostSeriesSuccessMessage();}} className="btn btn-primary">
                    <Translate value="add_series"/>
                </Link>
            </div>
            { !errorMessage ?
                <div className="table-responsive">
                    <ToolkitProvider
                        bootstrap4
                        keyField="identifier"
                        data={ translatedSeries() }
                        columns={ columns }
                        search>
                        {
                            props => (
                                <div>
                                    <br/>
                                    <label className='info-text'>{ translate('search_series_info') } </label>
                                    <div className="form-group has-search">
                                        <span className="form-control-feedback"><FaSearch /></span>
                                        <SearchBar { ...props.searchProps } placeholder={ translate('search_series') }/>
                                    </div>
                                    <BootstrapTable { ...props.baseProps }  expandRow={ expandRow } noDataIndication={() => <NoDataIndication /> }
                                        pagination={ paginationFactory(options) } hover defaultSorted={ defaultSorted }/>
                                </div>
                            )
                        }
                    </ToolkitProvider>
                </div>
                : errorMessage !== null ?
                    <Alert variant="danger" onClose={ () => setErrorMessage(null) } >
                        <p>
                            { errorMessage }
                        </p>
                    </Alert>
                    : ''
            }
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
    onSelectSeries: (row) => {
        dispatch(fetchSerie(row));
    },
    emptyPersons: () => dispatch(emptyPersons()),
    emptyMoodleNumber: () => dispatch(emptyMoodleNumber()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onClearPostSeriesSuccessMessage: () => dispatch(clearPostSeriesSuccessMessage()),
    onRouteChange: (route) =>  dispatch(routeAction(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);
