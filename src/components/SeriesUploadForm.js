import React, { useEffect, useState } from 'react';
import { actionUploadSeries } from '../actions/seriesAction';
import { connect } from 'react-redux';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {updateVideoList} from "../actions/videosAction";

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

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
    }, [inputs]);

    const generateAclList = (newSeries) => {
        let aclList = [];
        newSeries.acl = [];
        if (newSeries.published) {
            aclList.push(newSeries.published);
        }
        newSeries.acl = aclList;
    };

    const uploadSeries = async() => {
        const newSeries = { ...inputs };
        generateAclList(newSeries);
        //call unitube proxy api
        try {
            await actionUploadSeries(newSeries);
            setSuccessMessage('SERIES UPLOAD SUCCESS MESSAGE');
        }catch (error){
            setErrorMessage('SERIES UPLOAD ERROR MESSAGE');
        }
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
        console.log(inputs.moodleNumber);
        event.preventDefault();
    };

    return(
        <div>
            {successMessage !== null ?
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    <p>
                        {successMessage}
                    </p>
                </Alert>
                : (<></>)
            }
            {errorMessage !== null ?
                <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                    <p>
                        {errorMessage}
                    </p>
                </Alert>
                : (<></>)
            }
            <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">{translate('series_title')}</label>
                    <div className="col-sm-8">
                        <input onChange={handleInputChange} type="text" name="title" className="form-control" maxLength="150" required/>
                    </div>
                    <div className="col-sm-2">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('video_file_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">{translate('series_description')}</label>
                    <div className="col-sm-8">
                        <textarea onChange={handleInputChange} type="text" name="description" className="form-control" maxLength="1500" required/>
                    </div>
                    <div className="col-sm-2">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_description_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">{translate('series_visibility')}</label>
                    <div className="col-sm-8">
                        <div className="form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="checkbox" name="published" value="ROLE_ANONYMOUS" onChange={handleCheckBoxChange} />
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
                    <label className="col-sm-2 col-form-label">{translate('series_moodle_visibility')}</label>
                    <div className="col-sm-8">
                        <input type="text" value={inputs.moodleNumber} name="moodleNumber" onChange={handleMoodleInputChange} /><button disabled={!inputs.moodleNumber} type="submit" className="btn btn-primary" onClick={handleButtonClick}>Lisää</button>
                        <div className="form-check-inline">

                        </div>
                    </div>
                    <div className="col-sm-2">
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('series_moodle_visibility_info')}</Tooltip>}>
                            <span className="d-inline-block">
                                <Button disabled style={{ pointerEvents: 'none' }}>?</Button>
                            </span>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10 offset-sm-9">
                        <button type="submit" className="btn btn-primary">{translate('save')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
    onMoodleNumberAdd : (moodleNumber) => dispatch(addMoodleNumber(moodleNumber))
});

export default connect(mapStateToProps, mapDispatchToProps)(SeriesUploadForm);