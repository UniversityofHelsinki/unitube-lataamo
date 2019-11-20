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

const DOWNLOAD_PATH = '/api/download';

export const downloadVideo = async (data, fileName) => {

    const queryString = (data = {}) => {
        return Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
    };
    
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: queryString,
        responseType: 'arraybuffer'
    };

    try {
        let response = await axios.post(`${VIDEO_SERVER_API}${DOWNLOAD_PATH}`, data, config);
        if (response.status === 200) {
            fileDownload(response.data, fileName);
        }
    } catch (error) {
        console.log("ERROR" , error);
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
                dispatch(apiFailureCall('Unable to fetch data'));
            }else if(response.status === 401){
                dispatch(api401FailureCall(new Date()));
            } else {
                dispatch(apiFailureCall('Unable to fetch data'));
            }
        } catch(err) {
            dispatch(apiFailureCall('Unable to fetch data'));
        }
    };
};

export const actionUploadVideo = (newVideo) => {
    return async (dispatch) => {
        try {
            let response = await axios.post(`${VIDEO_SERVER_API}${USER_VIDEOS_PATH}`, newVideo, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    dispatch(fileUploadProgressAction(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)));
                }
            });

            if (response.status === 200) {
                const responseMessage = await response.data.message;
                dispatch(fileUploadSuccessActionMessage(responseMessage));
            } else {
                const responseMessage = await response.data.message;
                dispatch(fileUploadFailedActionMessage(responseMessage));
                dispatch(fileUploadProgressAction( 0));
            }
        } catch (error) {
            dispatch(fileUploadFailedActionMessage(JSON.stringify(error)));
            dispatch(fileUploadProgressAction( 0));
        }
    };
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