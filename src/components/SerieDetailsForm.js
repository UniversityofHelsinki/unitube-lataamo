import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { IconContext } from 'react-icons';
import { FiCopy } from 'react-icons/fi';
import { connect } from 'react-redux';
import {
    actionUpdateSerieDetails,
    addMoodleNumber,
    emptyIamGroupsCall,
    emptyMoodleNumberCall,
    updateSeriesList
} from '../actions/seriesAction';
import * as constants from '../utils/constants';
import IAMGroupAutoSuggest from './IAMGroupAutoSuggest';
import IAMGroupList from './IamGroupList';
import PersonList from './PersonList';
import PersonListAutoSuggest from './PersonListAutoSuggest';
import SelectedMoodleNumbers from './SelectedMoodleNumbers';
import VideosInSeries from './VideosInSeries';
import RadioButtonGroup from './RadioButtonGroup';


const SerieDetailsForm = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.serie);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [copiedMessage, setCopiedMessage] = useState(null);
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
        const roleUnlisted = series.acl.filter(acl => acl.includes(constants.ROLE_USER_UNLISTED));

        if ((roleAnonymous && roleAnonymous.length > 0) || (roleKatsomoTuotanto && roleKatsomoTuotanto.length > 0) || (roleKatsomo && roleKatsomo.length > 0)) {
            //video has either (constants.ROLE_ANONYMOUS, constants.ROLE_KATSOMO constants.ROLE_KATSOMO_TUOTANTO) roles
            //constants.ROLE_KATSOMO is to be deleted in the future
            visibility.push(constants.STATUS_PUBLISHED);
        } else if (roleUnlisted && roleUnlisted.length > 0) {
            visibility.push(constants.STATUS_UNLISTED);
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
        setCopiedMessage(null);
    }, [props.serie, props.user.eppn]);

    const generateAclList = (updateSeries, moodleNumbers) => {
        let aclList = [];
        updateSeries.acl = [];
        if ([constants.ROLE_ANONYMOUS].includes(updateSeries.published)) {
            aclList.push(updateSeries.published);
            aclList.push(constants.ROLE_KATSOMO_TUOTANTO);
        } else if ([constants.ROLE_USER_UNLISTED].includes(updateSeries.published)) {
            aclList.push(updateSeries.published);
        }
        if (moodleNumbers && moodleNumbers.length > 0) {
            moodleNumbers.forEach(moodleNumber => {
                aclList.push(moodleNumber + '_Instructor');
                aclList.push(moodleNumber + '_Learner');
            });
        }
        updateSeries.acl = aclList;
    };

    const handleSubmitButtonClick = () => {
        let submitButton = document.getElementById('submitBtnId');
        submitButton.setAttribute('disabled', 'disabled');
        setTimeout(function() {
            submitButton.removeAttribute('disabled');
        },60000);
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            handleSubmitButtonClick(event);
            await updateSeriesDetails();
        }
    };

    const handleInputChange = (event) => {
        event.target.value = replaceIllegalCharacters(event.target.name, event.target.value);
        event.persist();
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    const containsOnlyNumbers = (event) => {
        if (/^\d+$/.test(event.target.value)) {
            return true;
        }
        return false;
    };

    const replaceIllegalCharacters = (target, value) => {
        if (target === 'title' || target === 'description') {
            let regExp = new RegExp(constants.ILLEGAL_CHARACTERS, 'g');
            return value.replace(regExp, '');
        } else {
            return value;
        }
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
        setCopiedMessage(translate('copied_to_clipboard'));
    };

    const handlePublicityChange = (event) => {
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };


    const publicityRadioButtons = [
        {
            name: 'published',
            id: 'publicity-unpublished',
            label: translate('unpublished_series'),
            value: '',
            onChange: handlePublicityChange,
            checked: () => inputs.published === ''
        },
        {
            name: 'published',
            id: 'publicity-unlisted',
            label: translate('unlisted_series'),
            value: 'ROLE_USER_UNLISTED',
            onChange: handlePublicityChange,
            checked: () => inputs.published === 'ROLE_USER_UNLISTED'
        },
        {
            name: 'published',
            id: 'publicity-published',
            label: translate('public_series'),
            value: 'ROLE_ANONYMOUS',
            onChange: handlePublicityChange,
            checked: () => inputs.published === 'ROLE_ANONYMOUS'
        },
    ];

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
                            <div className="col-sm-1">
                                <IconContext.Provider value={{ size: '1.5em' }}>
                                    <div>
                                        <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyTextToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                    </div>
                                </IconContext.Provider>
                            </div>
                            <div className="col-sm-4">
                                { copiedMessage !== null ?
                                    <Alert variant="success" onClose={ () => setCopiedMessage(null) } dismissible>
                                        <p>
                                            { copiedMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label htmlFor="title" className="col-sm-2 col-form-label">{translate('series_title')}</label>
                            <div className="col-sm-7">
                                <input type="text" name="title" className="form-control" data-cy="test-series-title" value={ inputs.title }
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
                                <textarea name="description" className="form-control" data-cy="test-series-description" value={ inputs.description }
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
                            <div className="col-sm-9 series-admin-list">
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
                            <div className="col-sm-9 series-admin-list">
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
                                <RadioButtonGroup name="published" id="publicity-radio-buttons" members={publicityRadioButtons} />
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
                                <div className="col-sm-12 video-list" data-cy="test-series-video-list">
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
                            <button type="submit" id="submitBtnId" className="btn btn-primary button-position" data-cy="test-series-submit-button">{translate('save')}</button>
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
