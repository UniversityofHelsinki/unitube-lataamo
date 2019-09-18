import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { fetchSeries } from '../actions/seriesAction';
import { actionUploadVideo } from '../actions/videosAction';
import {
    actionEmptyFileUploadProgressErrorMessage,
    actionEmptyFileUploadProgressSuccessMessage
} from '../actions/fileUploadAction';
import ReactHintFactory from 'react-hint';
import FileUploadProgressbar from '../components/FileUploadProgressbar';


const ReactHint = ReactHintFactory(React);


const VideoUploadForm = (props) => {

    const [selectedVideoFile, setVideoFile] = useState(null);
    const [selectedButtonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        props.onFetchSeries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.fur.updateSuccessMessage, props.fur.updateFailedMessage]);


    const translations =  props.i18n.translations[props.i18n.locale];

    const translate = (key) => {
        return translations ? translations[key] : '';
    };


    const uploadVideo = async() => {
        //https://developer.mozilla.org/en-US/docs/Web/API/FormData/set
        const data = new FormData();
        data.set('videofile', selectedVideoFile);
        // call unitube-proxy api
        await props.onUploadVideo(data);
    };

    const handleSubmit = async (event) => {
        event.persist();
        event.preventDefault();
        setButtonDisabled(true);
        await uploadVideo();
        clearVideoFileSelection();
        setButtonDisabled(false);
    };

    const handleFileInputChange = (event) => {
        event.persist();
        setVideoFile(event.target.files[0]);
    };

    const clearVideoFileSelection = () => {
        document.getElementById('upload_video_form').reset();
    };

    return (
        <div>
            <ReactHint events autoPosition="true" />
            {/* https://getbootstrap.com/docs/4.0/components/alerts/ */}
            {props.fur.updateSuccessMessage !== null ?
                <Alert variant="success" onClose={() => props.onSuccessMessageClick()} dismissible>
                    <p>{props.fur.updateSuccessMessage}</p>
                </Alert>
                : (<></>)
            }
            {props.fur.updateFailedMessage !== null ?
                <Alert variant="danger" onClose={() => props.onFailureMessageClick() } dismissible>
                    <p>{props.fur.updateFailedMessage}</p>
                </Alert>
                : (<></>)
            }
            <form id="upload_video_form" encType="multipart/form-data" onSubmit={handleSubmit} className="was-validated">
                <div className="form-group row">
                    <label htmlFor="title" className="col-sm-2 col-form-label">Video file</label>
                    <div className="col-sm-8">
                        <input onChange={handleFileInputChange} type="file" className="form-control" name="video_file" required/>
                    </div>
                    <div className="col-sm-2">
                        <button className="btn btn-primary" data-rh={translate('video_file_info')}>?</button>
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-12">
                        <FileUploadProgressbar />
                    </div>
                </div>

                <div className="form-group row">
                    <div className="col-sm-2">
                        <button type="submit" className="btn btn-primary" disabled={selectedButtonDisabled}>Tallenna</button>
                    </div>
                </div>
            </form>
        </div>
    );
};


const mapStateToProps = state => ({
    event : state.er.event,
    series : state.ser.series,
    i18n: state.i18n,
    fur: state.fur
});

const mapDispatchToProps = dispatch => ({
    onFetchSeries: () => dispatch(fetchSeries()),
    onUploadVideo : (data) => dispatch(actionUploadVideo(data)),
    onSuccessMessageClick : () => dispatch(actionEmptyFileUploadProgressSuccessMessage()),
    onFailureMessageClick : () => dispatch(actionEmptyFileUploadProgressErrorMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploadForm);