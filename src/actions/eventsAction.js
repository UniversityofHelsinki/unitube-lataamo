import { api401FailureCall, apiFailureCall } from './videosAction';

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const EVENT_PATH = '/api/event/';
const USER_EVENTS_PATH = '/api/userVideos';

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

const eventsRequestCall = (dispatch, refresh) => {
    if (refresh) {
        dispatch(apiGetEventsRequestCall());
    }
};

export const fetchEvents = (refresh) => {
    return async (dispatch) => {
        try {
            eventsRequestCall(dispatch, refresh);
            let response = await fetch(`${VIDEO_SERVER_API}${USER_EVENTS_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetEventsSuccessCall(responseJSON));
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

// update the eventlist in state (called on video information update)
export const updateEventList = () => {
   return async dispatch => {
        dispatch(fetchEvents(false));
    };
};

export const actionUpdateEventDetails = async (id, updatedEvent) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${USER_EVENTS_PATH}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEvent)
        });
        if(response.status === 200) {
            let responseJSON = await response.json();
            return responseJSON;
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const apiGetEventSuccessCall = (data) => ({
    type: 'SUCCESS_API_GET_EVENT',
    payload: data
});

export const apiGetEventsRequestCall = () => ({
    type: 'GET_EVENTS_REQUEST',
    loading: true
});

export const apiGetEventsSuccessCall = data => ({
    type: 'SUCCESS_API_GET_EVENTS',
    payload: data,
    loading: false
});