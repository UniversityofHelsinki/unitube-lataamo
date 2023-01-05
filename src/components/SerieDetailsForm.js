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
    emptyMoodleNumberCall, updateSeriesList
} from '../actions/seriesAction';
import * as constants from '../utils/constants';
import IAMGroupAutoSuggest from './IAMGroupAutoSuggest';
import IAMGroupList from './IamGroupList';
import PersonList from './PersonList';
import PersonListAutoSuggest from './PersonListAutoSuggest';
import SelectedMoodleNumbers from './SelectedMoodleNumbers';
import VideosInSeries from './VideosInSeries';
import RadioButtonGroup from './RadioButtonGroup';
import DeleteSeries from './DeleteSeries';
import { actionUpdateExpiryDates } from '../actions/eventsAction';
import DatePicker from 'react-datepicker';
import { addMonths, addYears } from 'date-fns';


const SerieDetailsForm = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.serie);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [copiedMessage, setCopiedMessage] = useState(null);
    const [copiedLinkMessage, setCopiedLinkMessage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [deletionDate, setDeletionDate] = useState(null);
    const [disabledInputs, setDisabledInputs] = useState(false);
    const [errorExpiryDatesMessage, setErrorExpiryDatesMessage] = useState(null);
    const [successExpiryDatesMessage, setSuccessExpiryDatesMessage] = useState(null);

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

    const updateExpiryDates = async () => {
        const seriesId = inputs.identifier;
        const updatedDeletionDate = { deletionDate : deletionDate };
        try {
            await actionUpdateExpiryDates(seriesId, updatedDeletionDate);
            setSuccessExpiryDatesMessage(translate('update_videos_expiry_date_message'));
        } catch (err) {
            setErrorExpiryDatesMessage(translate('failed_update_videos_expiry_date'));
        }
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

    const copyLinkToClipboard = (event) => {
        event.preventDefault();
        event.persist();
        let copySeriesLink = document.getElementById('seriesLink').innerText;
        let seriesUrl = document.createElement('input');
        document.body.appendChild(seriesUrl);
        seriesUrl.value = copySeriesLink;
        /* Select the text field */
        seriesUrl.select();
        seriesUrl.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand('copy');
        seriesUrl.remove();
        setCopiedLinkMessage(translate('copied_series_link_to_clipboard'));
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

    const publishedVideosLink = props.serie && props.serie.identifier && `${process.env.REACT_APP_KATSOMO_PUBLISHED_SERIES_VIDEOS_LINK_URL}${props.serie.identifier}`;

    return (
        <div>
            { props.serie && props.serie.identifier !== undefined
                ?
                <form onSubmit={ handleSubmit } className="was-validated" >
                    <div className="series-bg">
                        <div className="form-group row">
                            <h3 className="series-title col-sm-10 margin-top-position col-form-label">{translate('series_basic_info')}</h3>
                            <input id="eventsCount" type="hidden" value={inputs.eventsCount || ''} />
                            <div className="col-sm-4">
                                { copiedMessage !== null ?
                                    <Alert variant="success" onClose={ () => setCopiedMessage(null) } dismissible>
                                        <p>
                                            { copiedMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                { copiedLinkMessage !== null ?
                                    <Alert variant="success" onClose={ () => setCopiedLinkMessage(null) } dismissible>
                                        <p>
                                            { copiedLinkMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                            </div>
                        </div>
                        {/* { inputs.published === 'ROLE_ANONYMOUS' && !props.moodleNumbers?.length ?
                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label"></label>
                                <label htmlFor="seriesLink" className="col-sm-2 col-form-label">{translate('link_to_series_videos')}</label>
                                <div className="col-sm-6">
                                    <label id="seriesLink" className="col-form-label">
                                        <a target="_blank" rel="noreferrer" href={publishedVideosLink}>{publishedVideosLink}</a>
                                    </label>
                                    <IconContext.Provider value={{ size: '1.5em' }}>
                                        <span style={{ marginLeft: '20px' }}>
                                            <FiCopy className={hovered ? 'cursor-pointer' : ''} onMouseEnter={toggleHover} onMouseLeave={toggleHover} onClick={ copyLinkToClipboard } >{translate('copy_to_clipboard')}</FiCopy>
                                        </span>
                                    </IconContext.Provider>
                                </div>
                            </div>
                            : (<></>)
                        } */}

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
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label htmlFor="series_title" className="col-sm-2 col-form-label">{translate('series_title')}</label>
                            <div className="col-sm-7">
                                <input id="series_title" type="text" name="title" className="form-control" data-cy="test-series-title" value={ inputs.title }
                                    onChange={ handleInputChange } placeholder={ translate('serie_title_info') } maxLength="150" required/>
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
                            <div className="col-sm-2 col-form-label"></div>
                            <label htmlFor="series_details_description_area" className="col-sm-2 col-form-label">{translate('series_description')}</label>
                            <div className="col-sm-7">
                                <textarea id="series_details_description_area" name="description" className="form-control" data-cy="test-series-description" value={ inputs.description }
                                    onChange={ handleInputChange } placeholder={ translate('serie_description') } maxLength="1500" required/>
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
                            <label htmlFor="seriesrights" className="series-title col-sm-11 col-form-label">{translate('series_editing_rights')}</label>
                            <div className="col-sm-1 info-box-margin">
                                <OverlayTrigger id="seriesrights" overlay={<Tooltip id="tooltip-disabled">{translate('series_editing_rights_info')}</Tooltip>}>
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
                            <label htmlFor="person_list_auto_suggest" className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-9">
                                <PersonListAutoSuggest/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('added_persons')}</label>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="personlist" className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-9 series-admin-list">
                                <PersonList id="personlist"></PersonList>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label"></label>
                            <label className="col-sm-2 col-form-label">{translate('add_iam_group')}</label>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="iam_group_auto_suggest" className="col-sm-2 col-form-label"></label>
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
                            <h3 className="series-title col-sm-2 margin-top-position col-form-label">{translate('series_visibility_title')}</h3>
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
                            <label htmlFor="moodenumber" className="col-sm-2 col-form-label"></label>
                            <div className="col-sm-9">
                                <input id="moodenumber" size="50" type="text" data-cy="test-moodle-id" value={inputs.moodleNumber} name="moodleNumber" placeholder={translate('add_moodle_placeholder')} onChange={handleMoodleInputChange}/>
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
                            <h3 className="series-title col-sm-11 margin-top-position col-form-label">{translate('series_included_videos')}</h3>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12 video-list" data-cy="test-series-video-list">
                                <VideosInSeries />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                            <label className="col-sm-2 col-form-label">{translate('update_videos_expiry_date')}</label>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="exprirydate" className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                            <div className="col-sm-2 col-form-label">
                                <DatePicker id="exprirydate"
                                    disabled={disabledInputs}
                                    dateFormat="dd.MM.yyyy"
                                    locale={props.preferredLanguage}
                                    showPopperArrow={false}
                                    minDate={addMonths(new Date(), 6)}
                                    maxDate={addYears(new Date(), 3)}
                                    showMonthYearDropdown
                                    dropdownMode="select"
                                    selected={deletionDate}
                                    onChange={(date) => setDeletionDate(date)}
                                    placeholderText={translate('select_videos_expiry_date')} />
                            </div>
                            <div className="col-sm-2 ml-2">
                                <span id="submitExpriryBtnId" tabIndex="0" className={deletionDate ? 'btn btn-primary' : 'btn unclickable-btn'} onClick={ deletionDate ? () => updateExpiryDates() : null} >
                                    {translate('update_videos_expiry_date_button')}
                                </span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                            <label className="col-sm-10 licence-long-info">{translate('update_videos_expiry_date_text')}</label>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                            <div className="col-sm-8">
                                {/* https://getbootstrap.com/docs/4.0/components/alerts/ */ }
                                { successExpiryDatesMessage !== null ?
                                    <Alert variant="success" onClose={ () => setSuccessExpiryDatesMessage(null) } dismissible>
                                        <p>
                                            { successExpiryDatesMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                                { errorExpiryDatesMessage !== null ?
                                    <Alert variant="danger" onClose={ () => setErrorExpiryDatesMessage(null) } dismissible>
                                        <p>
                                            { errorExpiryDatesMessage }
                                        </p>
                                    </Alert>
                                    : (<></>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">
                            <DeleteSeries label={translate('delete_serie')} serie={props.serie} setErrorMessage={setErrorMessage} errorMessage={translate('api_delete_series_failure')} />
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('delete_serie_info')}</Tooltip>}>
                                <span style={{ paddingLeft: '10px' }}>
                                    <Button disabled style={{ pointerEvents: 'none' }}>{'?'}</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                        <div className="col-sm-8">
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

                        </div>
                        <div className="col-sm-2">
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
    globalFeedback: state.gf.globalFeedback
});

const mapDispatchToProps = dispatch => ({
    onMoodleNumberAdd : (moodleNumber) => dispatch(addMoodleNumber(moodleNumber)),
    onEmptyMoodleNumbers : () => dispatch(emptyMoodleNumberCall()),
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onSeriesDetailsEdit: (freshSeriesList) => dispatch(updateSeriesList(freshSeriesList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SerieDetailsForm);
