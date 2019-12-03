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
import routeAction from '../actions/routeAction';


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
        sort: true
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
        dataField: 'identifier',
        order: 'desc'
    }];

    const expandRow = {
        parentClassName: 'parent-expand-foo',
        renderer: row => (
            <SerieDetailsForm/>
        ),
        onlyOneExpanding: true,
        onExpand: (row, isExpand, rowIndex) => {
            let trElements = document.getElementsByTagName("tr");
            for (let row = 1; row < trElements.length; row++) {
                if (row === rowIndex + 1 && isExpand) {
                    trElements[row].style.backgroundColor = "#8cbdff";
                } else {
                    trElements[row].style.backgroundColor = "";
                }
            }
            props.onSelectSerie(row);
        },
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
                    data={ translatedSeries() }
                    columns={ columns }
                    search
                    defaultSorted={ defaultSorted }>
                    {
                        props => (
                            <div>
                                <br/>
                                <SearchBar { ...props.searchProps } placeholder={ translate('search') }/>
                                <BootstrapTable { ...props.baseProps }  expandRow={ expandRow }
                                    pagination={ paginationFactory(options) } />
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
    onFetchSeries: () => dispatch(fetchSeries(true)),
    onSelectSerie: (row) => {
        dispatch(fetchSerie(row));
    },
    emptyMoodleNumber: () => dispatch(emptyMoodleNumber()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onClearPostSeriesSuccessMessage: () => dispatch(clearPostSeriesSuccessMessage()),
    onRouteChange: (route) =>  dispatch(routeAction(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesList);