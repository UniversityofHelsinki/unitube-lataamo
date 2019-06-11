// asynchronous action creator

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_EVENTS_PATH = '/api/userEvents';
const VIDEO_PATH = '/api/video/'

export const fetchVideo = (row) => {
    return async (dispatch) => {
        console.log(`${VIDEO_SERVER_API}${VIDEO_PATH}${row.identifier}`);
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${VIDEO_PATH}${row.identifier}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetVideoSuccessCall(responseJSON));
            } else if (response.status === 404) {
                dispatch(apiFailureCall('Unable to fetch data'));
            } else {
                dispatch(api401FailureCall(new Date()));
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
            } else {
                dispatch(api401FailureCall(new Date()));
            }
        } catch(err) {
            dispatch(apiFailureCall('Unable to fetch data'));
        }
    };
};

export const apiGetVideoSuccessCall = data => ({
    type: 'SUCCESS_API_GET_VIDEO',
    payload: data
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