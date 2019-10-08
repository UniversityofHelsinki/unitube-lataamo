import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { updateSerieList, actionUpdateSerieDetails, emptyIamGroupsCall } from '../actions/seriesAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import IAMGroupAutoSuggest from "./IAMGroupAutoSuggest";
import IAMGroupList from "./IamGroupList";

const SerieDetailsForm = (props) => {

    const translations = props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const [inputs, setInputs] = useState(props.serie);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const generateContributorsList = (updatedSeries, list) => {
        let contributorsList = [];
        if (list && list.length > 0) {
            list.forEach(contributor => {
                contributorsList.push(contributor);
            });
        }
        updatedSeries.contributors = contributorsList;
    };

    const updateSerieDetails = async () => {
        const serieId = inputs.identifier;
        const updatedSeries = {...inputs}; // values from the form
        generateAclList(updatedSeries);
        generateContributorsList(updatedSeries, props.iamGroups);

        // call unitube-proxy api
        try {
            await actionUpdateSerieDetails(serieId, updatedSeries);
            setSuccessMessage('JUST A PLACE HOLDER TEXT');
            // update the serielist to redux state
            props.onSerieDetailsEdit(props.series.map(
                serie => serie.identifier !== serieId ? serie : updatedSeries));
        } catch (err) {
            setErrorMessage('JUST A PLACE HOLDER TEXT');
        }
    };

    useEffect(() => {
        setInputs(props.serie);
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [props.serie]);

    const generateAclList = (updateSeries) => {
        let aclList = [];
        updateSeries.acl = [];
        if (updateSeries.published) {
            aclList.push(updateSeries.published);
        }
        updateSeries.acl = aclList;
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
            await updateSerieDetails();
        }
    };

    const handleCheckBoxChange = (event) => {
        event.persist();
        if (event.target.checked) {
            setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
        } else {
            setInputs(inputs => ({...inputs, [event.target.name]: ''}));
        }
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    };

    return (
        <div>
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

            { props.serie && props.serie.identifier !== undefined
                ?
                <form onSubmit={ handleSubmit } className="was-validated">

                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-8">
                            <input type="text" name="title" className="form-control" value={ inputs.title }
                                   onChange={ handleInputChange } placeholder="Title" maxLength="150" required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger
                                overlay={ <Tooltip id="tooltip-disabled">{ translate('serie_title_info') }</Tooltip> }>
                                <span className="d-inline-block">
                                    <Button disabled style={ {pointerEvents: 'none'} }>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-8">
                            <textarea name="description" className="form-control" value={ inputs.description }
                                      onChange={ handleInputChange } placeholder="Description" maxLength="1500"
                                      required/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={ <Tooltip
                                id="tooltip-disabled">{ translate('serie_description_info') }</Tooltip> }>
                                <span className="d-inline-block">
                                    <Button disabled style={ {pointerEvents: 'none'} }>?</Button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                        <div className="col-sm-8">
                            <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name="published" value="ROLE_ANONYMOUS" checked={inputs.published} onChange={handleCheckBoxChange} />
                                    {translate('public_series')}
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_visibility_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                            </OverlayTrigger>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate('add_iam_group')}</label>
                        <div className="col-sm-8">
                            <IAMGroupAutoSuggest/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('add_iam_groups_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">{translate('added_iam_groups')}</label>
                        <div className="col-sm-8">
                            <IAMGroupList/>
                        </div>
                        <div className="col-sm-2">
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('added_iam_groups_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                            </OverlayTrigger>
                        </div>
                    </div>


                    <div className="form-group row">
                        <div className="col-sm-10 offset-sm-2">
                            <button type="submit" className="btn btn-primary">Tallenna</button>
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
    series: state.ser.series,
    i18n: state.i18n,
    iamGroups : state.ser.iamGroups,
});

const mapDispatchToProps = dispatch => ({
    onEmptyIamGroups: () => dispatch(emptyIamGroupsCall()),
    onSerieDetailsEdit: (freshSerieList) => dispatch(updateSerieList(freshSerieList))
});

export default connect(mapStateToProps, mapDispatchToProps)(SerieDetailsForm);
