import { api401FailureCall, apiFailureCall, apiGetEventSuccessCall } from './videosAction';

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const EVENT_PATH = '/api/event/';

export const fetchEvent = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${EVENT_PATH}${row.identifier}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetEventSuccessCall(responseJSON));
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