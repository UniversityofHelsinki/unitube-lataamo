// asynchronous action creator

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_EVENTS_PATH = '/api/userVideos';
const VIDEO_PATH = '/api/video/';

export const fetchVideo = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${VIDEO_PATH}${row.id}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetVideoSuccessCall(responseJSON, row.id));
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

export const fetchVideos = () => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${USER_EVENTS_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetVideosSuccessCall(responseJSON));
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

// update the videolist in state (called on video information update)
export const updateVideoList = (updatedList) => {
    return async dispatch => {
        dispatch(apiGetVideosSuccessCall(updatedList));
    };
};

export const apiGetEventSuccessCall = (data) => ({
    type: 'SUCCESS_API_GET_EVENT',
    payload: data
});

export const apiGetVideoSuccessCall = (data, selectedRowId) => ({
    type: 'SUCCESS_API_GET_VIDEO',
    payload: data,
    selectedRowId: selectedRowId
});

export const apiGetVideosSuccessCall = data => ({
    type: 'SUCCESS_API_GET_VIDEOS',
    payload: data
});

export const api401FailureCall = failureTime => ({
    type: 'STATUS_401_API_CALL',
    payload : failureTime
});


export const apiFailureCall = msg => ({
    type: 'FAILURE_API_CALL',
    payload: msg
});