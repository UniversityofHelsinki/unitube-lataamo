import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import {
    actionUpdateSerieDetails,
    addMoodleNumber,
    emptyIamGroupsCall,
    emptyMoodleNumberCall,
    updateSeriesList
} from '../actions/seriesAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SelectedMoodleNumbers from './SelectedMoodleNumbers';
import IAMGroupAutoSuggest from './IAMGroupAutoSuggest';
import IAMGroupList from './IamGroupList';
import PersonListAutoSuggest from './PersonListAutoSuggest';
import PersonList from './PersonList';
import VideosInSeries from './VideosInSeries';
import * as constants from '../utils/constants';


const SerieDetailsForm = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.serie);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [hovered, setHovered] = useState(false);

    const toggleHover = () => {
        setHovered(!hovered);
    };

    const addToContributorsList = (list, contributorsList) => {
        if (list && list.length > 0) {
            list.forEach(item => {
                contributorsList.push(item);
            });
        }
    };

    const generateContributorsList = (updatedSeries, iamGroupList, personList) => {
        let contributorsList = [];
        addToContributorsList(iamGroupList, contributorsList);
        addToContributorsList(personList, contributorsList);
        updatedSeries.contributors = contributorsList;
    };


    const setVisibilityForSeries = (series) => {
        const visibility = [];

        const roleAnonymous = series.acl.filter(acl => acl.includes(constants.ROLE_ANONYMOUS));
        const roleKatsomoTuotanto = series.acl.filter(acl => acl.includes(constants.ROLE_KATSOMO_TUOTANTO));
        const roleKatsomo = series.acl.filter(acl => acl.includes(constants.ROLE_KATSOMO));

        if ((roleAnonymous && roleAnonymous.length > 0) || (roleKatsomoTuotanto && roleKatsomoTuotanto.length > 0) || (roleKatsomo && roleKatsomo.length > 0)) {
            //video has either (constants.ROLE_ANONYMOUS, constants.ROLE_KATSOMO constants.ROLE_KATSOMO_TUOTANTO) roles
            //constants.ROLE_KATSOMO is to be deleted in the future
            visibility.push(constants.STATUS_PUBLISHED);
        } else {
            visibility.push(constants.STATUS_PRIVATE);
        }

        const moodleAclInstructor = series.acl.filter(role => role.includes(constants.MOODLE_ACL_INSTRUCTOR));
        const moodleAclLearner = series.acl.filter(role => role.includes(constants.MOODLE_ACL_LEARNER));

        if (moodleAclInstructor && moodleAclLearner && moodleAclInstructor.length > 0 && moodleAclLearner.length > 0) {
            visibility.push(constants.STATUS_MOODLE);
        }
        series.visibility =  [...new Set(visibility)];
    };

    const updateSeriesDetails = async () => {
        const seriesId = inputs.identifier;
        const updatedSeries = { ...inputs }; // values from the form
        generateAclList(updatedSeries, props.moodleNumbers);
        generateContributorsList(updatedSeries, props.iamGroups, props.persons);
        setVisibilityForSeries(updatedSeries);
        // call unitube-proxy api
        try {
            await actionUpdateSerieDetails(seriesId, updatedSeries);
            setSuccessMessage(translate('updated_series_details'));
            // update the series list to redux state
            props.onSeriesDetailsEdit(props.series.map(
                series => series.identifier !== seriesId ? series : updatedSeries));
        } catch (err) {
            setErrorMessage(translate('failed_to_update_series_details'));
        }
    };

    useEffect(() => {
        setInputs(props.serie);
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [props.serie, props.user.eppn]);

    const generateAclList = (updateSeries, moodleNumbers) => {
        let aclList = [];
        updateSeries.acl = [];
        if (updateSeries.published) {
            aclList.push(updateSeries.published);
            aclList.push(constants.ROLE_KATSOMO_TUOTANTO);
        }
        if (moodleNumbers && moodleNumbers.length > 0) {
            moodleNumbers.forEach(moodleNumber => {
                aclList.push(moodleNumber + '_Instructor');
                aclList.push(moodleNumber + '_Learner');
            });
        }
        updateSeries.acl = aclList;
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            await updateSeriesDetails();
        }
    };

    const handleCheckBoxChange = (event) => {
        event.persist();
        if (event.target.checked) {
            setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
        } else {
            setInputs(inputs => ({ ...inputs, [event.target.name]: '' }));
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
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

    const handleButtonClick = (event) => {
        props.onMoodleNumberAdd(inputs.moodleNumber);
        event.preventDefault();
        setInputs(inputs => ({ ...inputs, 'moodleNumber':'' }));
    };

    const copyTextToClipboard = (event) => {
        event.preventDefault();
        event.persist();
        let copySeriesId = document.getElementById('seriesId').innerText;
        let seriesId = document.createElement('input');
        document.body.appendChild(seriesId);
        seriesId.value = copySeriesId;
        seriesId.select();
        //for mobile devices
        seriesId.setSelectionRange(0,99999);
        document.execCommand('copy');
        seriesId.remove();
        setSuccessMessage(translate('copied_to_clipboard'));
    };

    return (
        <div>
            { props.serie && props.serie.identifier !== undefined
                ?
                <form onSubmit={ handleSubmit } className="was-validated" >
                    <div className="series-bg">
                        <div className="form-group row">
                            <label className="series-title col-sm-10 col-form-label">{translate('series_basic_info')}</label>
                            <input id="eventsCount" type="hidden" value={inputs.eventsCount || ''} />
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label htmlFor="seriesId" className="col-sm-2 col-form-label">{translate('series_id')}</label>
                            <label id="seriesId" className="col-sm-3 col-form-label">{props.serie.identifier}</label>
                            <div className="col-sm-3">
                                <IconContext.Provider value={{ size: '1.5em' }}>
                                    <div>
                                        <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyTextToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                    </div>
                                </IconContext.Provider>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label htmlFor="title" className="col-sm-2 col-form-label">{translate('series_title')}</label>
                            <div className="col-sm-7">
                                <input type="text" name="title" className="form-control test-series-title" value={ inputs.title }
                                    onChange={ handleInputChange } placeholder="Title" maxLength="150" required/>
                            </div>
                            <div className="col-sm-1">
                                <OverlayTrigger
                                    overlay={ <Tooltip id="tooltip-disabled">{ translate('serie_title_info') }</Tooltip> }>
                                    <span className="d-inline-block">
                                        <Button disabled style={ { pointerEvents: 'none' } }>{translate('info_box_text')}</Button>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label htmlFor="title" className="col-sm-2 col-form-label">{translate('series_description')}</label>
                            <div className="col-sm-7">
                                <textarea name="description" className="form-control test-series-description" value={ inputs.description }
                                    onChange={ handleInputChange } placeholder="Description" maxLength="1500" required/>
                            </div>
                            <div className="col-sm-1">
                                <OverlayTrigger overlay={ <Tooltip
                                    id="tooltip-disabled">{ translate('serie_description_info') }</Tooltip> }>
                                    <span className="d-inline-block">
                                        <Button disabled style={ { pointerEvents: 'none' } }>{translate('info_box_text')}</Button>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>

                        <div className="series-bg">
                            <div className="form-group row">
                                <label className="series-title col-sm-11 col-form-label">{translate('series_editing_rights')}</label>
                                <div className="col-sm-1 info-box-margin">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_editing_rights_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-4 col-form-label">{translate('add_person')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-9">
                                    <PersonListAutoSuggest/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-2 col-form-label">{translate('added_persons')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-7">
                                    <PersonList/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-2 col-form-label">{translate('add_iam_group')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-9">
                                    <IAMGroupAutoSuggest/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-2 col-form-label">{translate('added_iam_groups')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-7">
                                    <IAMGroupList/>
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
                                            <input className="form-check-input test-series-published-checkbox" type="checkbox" name="published" value="ROLE_ANONYMOUS" checked={inputs.published} onChange={handleCheckBoxChange} />
                                            {translate('public_series')}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-1">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_visibility_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-2 col-form-label">{translate('add_moodle_course')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-9">
                                    <input size="50" type="text" data-cy="test-moodle-id" value={inputs.moodleNumber} name="moodleNumber" onChange={handleMoodleInputChange}/>
                                    <button type="submit" data-cy="test-submit-moodle-id" className="btn btn-primary  ml-1" onClick={handleButtonClick} disabled={!inputs.moodleNumber}>{translate('add')}</button>
                                </div>
                                <div className="col-sm-1">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_moodle_visibility_info')}</Tooltip>}>
                                        <span className="d-inline-block">
                                            <Button disabled style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label className="col-sm-2 col-form-label">{translate('added_moodle_courses')}</label>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <div className="col-sm-7">
                                    <SelectedMoodleNumbers/>
                                </div>
                            </div>
                        </div>
                        <div className="series-bg">
                            <div className="form-group row">
                                <label className="series-title col-sm-11 col-form-label">{translate('series_included_videos')}</label>
                            </div>
                            <div className="series-bg">

                                <div className="form-group row">
                                    <div className="col-sm-12 video-list">
                                        <VideosInSeries />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                {/* https://getbootstrap.com/docs/4.0/components/alerts/ */ }
                                { successMessage !== null ?
                                    <Alert variant="success" onClose={ () => setSuccessMessage(null) } dismissible>
                                        <p>
                                            { successMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                { errorMessage !== null ?
                                    <Alert variant="danger" onClose={ () => setErrorMessage(null) } dismissible>
                                        <p>
                                            { errorMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                <button type="submit" className="btn btn-primary button-position test-series-submit-button">{translate('save')}</button>
                            </div>
                        </div>
                </form>
                : (
                    <div></div>
                )
            }
        </div>
    );
};


const mapStateToProps = state => ({
    serie: state.ser.serie,
    moodleNumbers: state.ser.moodleNumbers,
    series: state.ser.series,
    i18n: state.i18n,
    user : state.ur.user,
    iamGroups : state.ser.iamGroups,
    persons: state.ser.persons,
});

const mapDispatchToProps = dispatch => ({
    onMoodleNumberAdd : (moodleNumber) => dispatch(addMoodleNumber(moodleNumber)),
    onEmptyMoodleNumbers : () => dispatch(emptyMoodleNumberCall()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onSeriesDetailsEdit: (freshSeriesList) => dispatch(updateSeriesList(freshSeriesList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SerieDetailsForm);
