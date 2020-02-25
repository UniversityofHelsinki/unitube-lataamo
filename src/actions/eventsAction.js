import { api401FailureCall, apiFailureCall } from './videosAction';
import axios from 'axios';
import { textFileUploadSuccessActionMessage, textFileUploadFailedActionMessage } from './fileUploadAction';

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const VIDEO_TEXT_FILE_PATH = '/api/videoTextFile';
const EVENT_PATH = '/api/event/';
const USER_EVENTS_PATH = '/api/userVideos';
const USER_INBOX_EVENTS_PATH = '/api/userInboxEvents';
const USER_TRASH_EVENTS_PATH = '/api/userTrashEvents';
const USER_TRASH_EVENT_PATH ='/api/moveEventToTrash';

export const fetchEvent = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${EVENT_PATH}${row.identifier}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetEventSuccessCall(responseJSON));
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

const eventsRequestCall = (dispatch, refresh) => {
    if (refresh) {
        dispatch(apiGetEventsRequestCall());
    }
};

export const fetchInboxEvents = (refresh) => {
    return async (dispatch) => {
        try {
            eventsRequestCall(dispatch, refresh);
            let response = await fetch(`${VIDEO_SERVER_API}${USER_INBOX_EVENTS_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetInboxEventsSuccessCall(responseJSON));
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

export const fetchTrashEvents = (refresh) => {
    return async (dispatch) => {
        try {
            eventsRequestCall(dispatch, refresh);
            let response = await fetch(`${VIDEO_SERVER_API}${USER_TRASH_EVENTS_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetTrashEventsSuccessCall(responseJSON));
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
                dispatch(apiFailureCall('general_error'));
            }
        } catch(err) {
            dispatch(apiFailureCall('general_error'));
        }
    };
};

// update the eventlist in state (called on video information update)
export const updateEventList = (inbox, updatedVideos) => {
    if(inbox==='true'){
        return async dispatch => {
            dispatch(apiGetInboxEventsSuccessCall(updatedVideos));
        };
    }
    return async dispatch => {
        dispatch(apiGetEventsSuccessCall(updatedVideos));
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

export const actionMoveEventToTrashSeries = async (id, deletedEvent) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${USER_TRASH_EVENT_PATH}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deletedEvent)
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

export const actionUploadVideoTextFile = (newTextFile) => {
    return async (dispatch) => {
        try {
            let response = await axios.post(`${VIDEO_SERVER_API}${VIDEO_TEXT_FILE_PATH}`, newTextFile, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                dispatch(textFileUploadSuccessActionMessage('success_on_video_text_file_upload'));
            } else {
                const responseMessage = await response.data.message;
                dispatch(textFileUploadFailedActionMessage(responseMessage));
            }
        } catch (error) {
            if (error.response.status === 415) {
                const errorResponseMessage = await error.response.data.message;
                dispatch(textFileUploadFailedActionMessage(errorResponseMessage));
            } else{
                dispatch(textFileUploadFailedActionMessage('error_on_video_text_file_upload'));
            }
        }
    };
};

export const deselectRow = () => {
    return async dispatch => {
        dispatch(apiDeselectRow());
    };
};

export const deselectEvent = () => {
    return async dispatch => {
        dispatch(apiDeselectEvent());
    };
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

export const apiGetInboxEventsSuccessCall = data => ({
    type: 'SUCCESS_API_GET_INBOX_EVENTS',
    payload: data,
    loading: false
});

export const apiGetTrashEventsSuccessCall = data => ({
    type: 'SUCCESS_API_GET_TRASH_EVENTS',
    payload: data,
    loading: false
});

export const apiDeselectEvent = () => ({
    type: 'DESELECT_EVENT',
    loading: false
});

export const apiDeselectRow = () => ({
    type: 'DESELECT_ROW',
    loading: false
});