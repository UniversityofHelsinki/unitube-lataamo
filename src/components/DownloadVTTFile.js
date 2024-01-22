import { downloadFile, getVTTFileName } from '../actions/videosAction';
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import constants from '../utils/constants';

const DownloadVTTFile = (props) => {
    const translations =  props.i18n.translations[props.i18n.locale];
    const [videoTextFile, hasVideoTextFile] = useState(false);
    const [disabledInputs, setDisabledInputs] = useState(false);

    const translate = (key) => {
        return translations ? translations[key] : '';
    };


    const hasVttVideoFile = () => {
        props.videoFiles.forEach(videoFile => {
            if (videoFile.vttFile && videoFile.vttFile.filename !== constants.EMPTY_VTT_FILE_NAME) {
                hasVideoTextFile(true);
            } else {
                hasVideoTextFile(false);
            }
        });
    };

    useEffect(() => {
        let isDisabled  = props.event.processing_state !== constants.VIDEO_PROCESSING_SUCCEEDED;
        setDisabledInputs(isDisabled);
        hasVttVideoFile();
        // eslint-disable-next-line
    }, [props.videoFiles, props.event]);// Only re-run the effect if values of arguments changes

    const getFileName = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const downloadVTTFile = async(event) => {
        event.preventDefault();
        try {
            const fileName = getFileName(props.videoFiles[0].vttFile.url);
            await downloadFile(props.event.identifier, await getVTTFileName(fileName));
        }
        catch (err) {
            //setErrorMessage(translate('download_webvtt_failed'));
        }
    };

    return (
        <form>
            <div className="col-sm-10">
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{translate('download_vtt_file')}</Tooltip>}>
                    <span className="d-inline-block">
                        <button type="submit" disabled={!videoTextFile || disabledInputs}
                            className="btn btn-primary float-right button-position mr-1"
                            onClick={downloadVTTFile}>{translate('save_text_track')} <FiDownload></FiDownload></button>
                    </span>
                </OverlayTrigger>
            </div>
        </form>
    );
};

const mapStateToProps = state => ({
    i18n: state.i18n,
    videoFiles : state.vr.videoFiles,
    event: state.er.event,
});


export default connect(mapStateToProps, null)(DownloadVTTFile);
