// asynchronous action creator
import axios from 'axios';
import {
    fileUploadFailedActionMessage,
    fileUploadProgressAction,
    fileUploadSuccessActionMessage
} from './fileUploadAction';

import fileDownload from 'js-file-download';


const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_VIDEOS_PATH = '/api/userVideos';
const VIDEO_PATH = '/api/videoUrl/';
const MONITOR_JOB_PATH = '/api/monitor/';

const DOWNLOAD_PATH = '/api/download';

export const downloadVideo = async (data, fileName) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${DOWNLOAD_PATH}`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
        const blob = await response.blob();

        if (response.status === 200) {
            fileDownload(blob, fileName);
            return response;
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};


//fetch video url
export const fetchVideoUrl = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${VIDEO_PATH}${row.identifier}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetVideoSuccessCall(responseJSON, row.identifier));
            } else if (response.status === 404) {
                dispatch(apiFailureCall('not_found_error'));
            }else if(response.status === 401){
                dispatch(api401FailureCall(new Date()));
            } else {
                dispatch(apiFailureCall('general_error'));
            }
        } catch(err) {
            dispatch(apiFailureCall('general_error'));
        }
    };
};

export const actionUploadVideo = (newVideo) => {
    return async (dispatch) => {
        initVideoUploadProcessInformation(dispatch);
        const extracted = async (response, jobId) => {
            return await new Promise(resolve => {
                const checkUntilConditionIsFalse = setInterval(async () => {
                    response = await fetch(`${VIDEO_SERVER_API}${MONITOR_JOB_PATH}${jobId}`);
                    if (response.status !== 202) {
                        clearInterval(checkUntilConditionIsFalse);
                    }
                    if (response.status === 201) {
                        dispatch(fileUploadProgressAction(90));
                        dispatch(fileUploadSuccessActionMessage('success_on_video_upload'));
                        dispatch(fileUploadProgressAction(100));
                        resolve(response);
                    }
                    if (response.status === 500) {
                        dispatch(fileUploadSuccessActionMessage('error_on_video_upload'));
                        dispatch(fileUploadProgressAction(0));
                        resolve(response);
                    }
                }, 1000);
            });
        };

        try {
            let response = await axios.post(`${VIDEO_SERVER_API}${USER_VIDEOS_PATH}`, newVideo, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    let actualPercentage = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
                    let displayedPercentage = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total-20);
                    dispatch(fileUploadProgressAction(displayedPercentage < 0 ? actualPercentage : displayedPercentage));
                }
            });

            if (response.status === 202) {
                const jobId = response.data.id;
                const result = extracted(response, jobId);
                return result;
            }
        } catch (error) {
            if(error.response.status===415){
                const errorResponseMessage = await error.response.data.message;
                dispatch(fileUploadFailedActionMessage(errorResponseMessage));
                dispatch(fileUploadProgressAction( 0));
            }else{
                dispatch(fileUploadFailedActionMessage('error_on_video_upload'));
                dispatch(fileUploadProgressAction( 0));
            }
        }
    };
};

const initVideoUploadProcessInformation = (dispatch) => {
    dispatch(fileUploadSuccessActionMessage(null));
    dispatch(fileUploadFailedActionMessage(null));
    dispatch(fileUploadProgressAction(0));
};

export const apiGetVideoSuccessCall = (data, selectedRowId) => ({
    type: 'SUCCESS_API_GET_VIDEO',
    payload: data,
    selectedRowId: selectedRowId
});

export const api401FailureCall = failureTime => ({
    type: 'STATUS_401_API_CALL',
    payload : failureTime,
    loading: false
});

export const apiFailureCall = msg => ({
    type: 'FAILURE_API_CALL',
    payload: msg,
    loading: false
});
