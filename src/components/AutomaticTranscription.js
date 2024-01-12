import React, { useEffect, useState } from 'react';
import constants from '../utils/constants';
import { connect } from 'react-redux';
import { isAuthorizedToTranslation } from '../actions/userAction';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { generateAutomaticTranscriptionForVideo } from '../actions/videosAction';
import SweetAlert from 'sweetalert2';

const AutomaticTranscription = (props) => {
    const [inputs, setInputs] = useState({ translationLanguage: '', translationModel : '' });
    const [disabledInputs, setDisabledInputs] = useState(false);

    useEffect(() => {
        props.onAuthorizedToTranslation();
    }, []);

    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };

    const getLanguage = (language) => {
        if (language === constants.TRANSLATION_LANGUAGE_FI) {
            return translate('finnish');
        } else if (language === constants.TRANSLATION_LANGUAGE_SV) {
            return translate('swedish');
        } else {
            return translate('english');
        }
    };

    const getModelName = (model) => {
        if (model === constants.TRANSLATION_MODEL_MS_WHISPER) {
            return translate('ms_whisper');
        } else {
            return translate('ms_asr');
        }
    };

    const drawLanguageSelectionValues = () => {
        return constants.TRANSLATION_LANGUAGES.map(language => {
            return <option key={ language } id={ language } value={ language }>{getLanguage(language)}</option>;
        });
    };

    const drawModelSelectionValues = () => {
        return constants.TRANSLATION_MODELS.map(model => {
            return <option key={ model } id={ model } value={ model }>{getModelName(model)}</option>;
        });
    };

    const handleInputChange = (event) => {
        setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
    };

    useEffect(() => { // this hook will get called everytime when inputs has changed
        console.log('Updated State', inputs);
        setDisabledInputs(false);
    }, [inputs]);

    const handleSelectionChange = async (event) => {
        handleInputChange(event);

        // Check if translationModel is not defined, then empty translationLanguage
        if (event.target.name === 'translationModel' && event.target.value === '') {
            setInputs((prevInputs) => ({
                ...prevInputs,
                translationLanguage: '',
            }));
        }
    };

    const createAlert = async () => {
        const result = await SweetAlert.fire({
            title: translate('confirm_generate_vtt_file'),
            text: translate('vtt_file_generation_info_text'),
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonColor: '#58dd33',
            confirmButtonText: translate('generate_text_track_button'),
            cancelButtonText: translate('close_alert')
        });
        return result;
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.persist();
            event.preventDefault();
            setDisabledInputs(true);
            const data = { identifier : props.event.identifier, translationModel : inputs.translationModel, translationLanguage : inputs.translationLanguage };
            const result = await createAlert();
            if (result.value && result.value === true) {
                await generateAutomaticTranscriptionForVideo(data);
            } else {
                setDisabledInputs(false);
            }
        }
    };

    return (
        <div>
            { props.isAllowedToTranslate && (
                <form id="automatic_transcription_form" encType="multipart/form-data" onSubmit={handleSubmit}
                    className="was-validated">
                    <div className="events-bg">
                        <div className="form-group row">
                            <h3 className="series-title col-sm-10 margin-top-position col-form-label">{translate('automatic_video_text_track_label')}</h3>
                        </div>
                    </div>
                    <div>
                        <div className="form-group row">
                            <label htmlFor="translationModel"
                                className="col-sm-2 col-form-label">{translate('translation_model')}</label>
                            <div className="col-sm-8">
                                <select className="form-control" data-cy="upload-test-translation-model-select"
                                    name="translationModel" value={inputs.translationModel}
                                    onChange={handleSelectionChange}>
                                    <option key="-1" id="NOT_SELECTED" value="">no_translation_model</option>
                                    {drawModelSelectionValues()}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <OverlayTrigger overlay={<Tooltip
                                    id="tooltip-disabled">{translate('translation_model_info')}</Tooltip>}>
                                    <span className="d-inline-block">
                                        <Button disabled
                                            style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="translationLanguages"
                                className="col-sm-2 col-form-label">{translate('translation_language')}</label>
                            <div className="col-sm-8">
                                <select disabled={!inputs.translationModel} className="form-control"
                                    data-cy="upload-test-translation-language-select"
                                    name="translationLanguage"
                                    value={inputs.translationModel ? inputs.translationLanguage : ''}
                                    onChange={handleSelectionChange}>
                                    <option key="-1" id="NOT_SELECTED" value="">{translate('select')}</option>
                                    {drawLanguageSelectionValues()}
                                </select>
                            </div>
                            <div className="col-sm-2">
                                <OverlayTrigger overlay={<Tooltip
                                    id="tooltip-disabled">{translate('translation_language_info')}</Tooltip>}>
                                    <span className="d-inline-block">
                                        <Button disabled
                                            style={{ pointerEvents: 'none' }}>{translate('info_box_text')}</Button>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <button type="submit" disabled={!inputs.translationModel || !inputs.translationLanguage || disabledInputs}
                                className="btn btn-primary float-right button-position mr-1">{translate('generate_automatic_transcription')}</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    event: state.er.event,
    i18n: state.i18n,
    isAllowedToTranslate: state.ur.isAuthorizedToTranslation
});

const mapDispatchToProps = dispatch => ({
    onAuthorizedToTranslation: () => dispatch(isAuthorizedToTranslation())
});


export default connect(mapStateToProps, mapDispatchToProps)(AutomaticTranscription);
