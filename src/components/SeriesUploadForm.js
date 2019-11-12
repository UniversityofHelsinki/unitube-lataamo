import React, { useEffect, useState } from 'react';
import { actionUploadSeries, addMoodleNumber, emptyMoodleNumberCall, clearPostSeriesFailureMessage, emptyIamGroupsCall, emptyPersons } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SelectedMoodleNumbers from './SelectedMoodleNumbers';
import IAMGroupAutoSuggest from './IAMGroupAutoSuggest';
import IAMGroupList from './IamGroupList';
import PersonListAutoSuggest from './PersonListAutoSuggest';
import PersonList from './PersonList';
import * as constants from "../utils/constants";
import routeAction from "../actions/routeAction";

const SeriesUploadForm = (props) => {

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        published: '',
        moodleNumber: '',
    });

    useEffect(() => {
        props.onRouteChange(props.route);
        if (props.seriesPostSuccessMessage !== null && props.history) {
            props.history.push('series'); // redirect to Router's series path
        }
        const interval = setInterval(() => {
            props.onClearPostSeriesFailureMessage();
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.seriesPostFailureMessage, props.seriesPostSuccessMessage]);


    const generateAclList = (newSeries, moodleNumbers) => {
        let aclList = [];
        newSeries.acl = [];
        if (newSeries.published) {
            aclList.push(newSeries.published);
            aclList.push(constants.ROLE_KATSOMO);
        }
        if (moodleNumbers && moodleNumbers.length > 0) {
            moodleNumbers.forEach(moodleNumber => {
                aclList.push(moodleNumber + '_Instructor');
                aclList.push(moodleNumber + '_Learner');
            });
        }
        newSeries.acl = aclList;
    };

    const addToContributorsList = (list, contributorsList) => {
        if (list && list.length > 0) {
            list.forEach(item => {
                contributorsList.push(item);
            });
        }
    };

    const generateContributorsList = (newSeries, iamGroupList, personList) => {
        let contributorsList = [];
        addToContributorsList(iamGroupList, contributorsList);
        addToContributorsList(personList, contributorsList);
        newSeries.contributors = contributorsList;
    };

    const uploadSeries = async () => {
        const newSeries = { ...inputs };
        generateAclList(newSeries, props.moodleNumbers);
        generateContributorsList(newSeries, props.iamGroups, props.persons);
        //call unitube proxy api
        props.actionUploadSeries(newSeries);
        props.onEmptyMoodleNumbers();
        props.onEmptyPersonList();
        props.onEmptyIamGroups();

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await uploadSeries();
    };

    const handleCheckBoxChange = (event) => {
        event.persist();
        if (event.target.checked) {
            setInputs(inputs => ({ ...inputs, [event.target.name]:event.target.value }));
        } else {
            setInputs(inputs => ({ ...inputs, [event.target.name]:'' }));
        }
    };

    const containsOnlyNumbers = (event) => {
        if (/^\d+$/.test(event.target.value)) {
            return true;
        }
        return false;
    };

    const handleMoodleInputChange = (event) => {
        if(event.target.value === '' || containsOnlyNumbers(event)) {
            event.persist();
            setInputs(inputs => ({ ...inputs, [event.target.name]:event.target.value }));
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]:event.target.value }));
    };

    const handleButtonClick = (event) => {
        props.onMoodleNumberAdd(inputs.moodleNumber);
        event.preventDefault();
        setInputs(inputs => ({ ...inputs, 'moodleNumber':'' }));
    };

    return(
        <div>
            {props.seriesPostFailureMessage !== null ?
                <Alert variant="danger">
                    <p>
                        {props.seriesPostFailureMessage}
                    </p>
                </Alert>
                : (<></>)
            }

            <h2>{translate('series_creation_form')}</h2>

            <form onSubmit={handleSubmit}>
                <div className="series-bg">
                    <div className="form-group row">
                        <label className="events-title col-sm-10 col-form-label">{translate('series_basic_info')}</label>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label"></label>
                        <label className="col-sm-2 col-form-label">{translate('series_title')}</label>
                        <div className="col-sm-7">
                            <input onChange={handleInputChange} type="text" name="title" className="form-control" maxLength="150" required/>
                        </div>
                        <div className="col-sm-1">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_title_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label"></label>
                        <label className="col-sm-2 col-form-label">{translate('series_description')}</label>
                        <div className="col-sm-7">
                            <textarea onChange={handleInputChange} type="text" name="description" className="form-control" maxLength="1500" required/>
                        </div>
                        <div className="col-sm-1">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_description_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="series-bg">
                        <div className="form-group row">
                            <label className="series-title col-sm-11 col-form-label">{translate('series_editing_rights')}</label>
                            <div className="col-sm-1 info-box-margin">
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_editing_rights_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                                </OverlayTrigger>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('add_person')}</label>
                            <div className="col-sm-7">
                                <PersonListAutoSuggest/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('added_persons')}</label>
                            <div className="col-sm-7">
                                <PersonList/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('add_iam_group')}</label>
                            <div className="col-sm-7">
                                <IAMGroupAutoSuggest/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('added_iam_groups')}</label>
                            <div className="col-sm-7">
                                <IAMGroupList/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="series-bg">
                    <div className="form-group row">
                        <label className="series-title col-sm-2 col-form-label">{translate('series_visibility_title')}</label>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                        <div className="col-sm-9">
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name="published" value="ROLE_ANONYMOUS" onChange={handleCheckBoxChange} />
                                    {translate('public_series')}
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-1">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_visibility_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label"></label>
                        <label className="col-sm-2 col-form-label">{translate('add_moodle_course')}</label>
                        <div className="col-sm-4">
                            <input size="50" type="text" value={inputs.moodleNumber} name="moodleNumber" onChange={handleMoodleInputChange} />
                        </div>
                        <div className="col-sm-3">
                            <button disabled={!inputs.moodleNumber} type="submit" className="btn btn-primary" onClick={handleButtonClick}>{translate('add')}</button>
                        </div>
                        <div className="col-sm-1">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_moodle_visibility_info')}</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label"></label>
                        <label className="col-sm-2 col-form-label">{translate('added_moodle_courses')}</label>
                        <div className="col-sm-7">
                            <SelectedMoodleNumbers/>
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-primary">{translate('save')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    moodleNumbers: state.ser.moodleNumbers,
    iamGroups : state.ser.iamGroups,
    persons: state.ser.persons,
    seriesPostFailureMessage: state.ser.seriesPostFailureMessage,
    seriesPostSuccessMessage: state.ser.seriesPostSuccessMessage
});

const mapDispatchToProps = dispatch => ({
    onMoodleNumberAdd : (moodleNumber) => dispatch(addMoodleNumber(moodleNumber)),
    onEmptyMoodleNumbers : () => dispatch(emptyMoodleNumberCall()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    actionUploadSeries: (data) => dispatch(actionUploadSeries(data)),
    onClearPostSeriesFailureMessage: () => dispatch(clearPostSeriesFailureMessage()),
    onEmptyPersonList: () => dispatch(emptyPersons()),
    onRouteChange: (route) =>  dispatch(routeAction(route))
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesUploadForm);