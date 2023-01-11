import { api401FailureCall, apiFailureCall } from './videosAction';

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const VIDEO_TEXT_FILE_PATH = '/api/videoTextTrack';
const EVENT_PATH = '/api/event/';
const USER_EVENTS_PATH = '/api/userVideos';
const USER_EVENTS_BY_SELECTED_SERIES = '/api/userVideosBySelectedSeries/';
const USER_INBOX_EVENTS_PATH = '/api/userInboxEvents';
const USER_TRASH_EVENTS_PATH = '/api/userTrashEvents';
const USER_TRASH_EVENT_PATH ='/api/moveEventToTrash';
const EVENT_DELETION_DATE_PATH = '/deletionDate';
const EVENT_EXPIRY_DATE_PATH = '/updateArchivedDateOfVideosInSerie';

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

export const fetchInboxEvents = (refresh, skipSettingLoading) => {
    return async (dispatch) => {
        try {
            eventsRequestCall(dispatch, refresh);
            let response = await fetch(`${VIDEO_SERVER_API}${USER_INBOX_EVENTS_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(
                    skipSettingLoading ?  apiGetInboxEventsSuccessCallWithoutSettingLoading(responseJSON) : apiGetInboxEventsSuccessCall(responseJSON)
                );
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

export const fetchEventsBySeries = (refresh, selectedSeriesId) => {
    return async (dispatch) => {
        try {
            if (selectedSeriesId) {
                eventsRequestCall(dispatch, refresh);
                let response = await fetch(`${VIDEO_SERVER_API}${USER_EVENTS_BY_SELECTED_SERIES}${selectedSeriesId}`);
                if (response.status === 200) {
                    let responseJSON = await response.json();
                    dispatch(apiGetEventsBySeriesSuccessCall(responseJSON));
                } else if (response.status === 401) {
                    dispatch(api401FailureCall(new Date()));
                } else {
                    dispatch(apiFailureCall('general_error'));
                }
            } else {
                dispatch(apiGetEventsBySeriesSuccessCall([]));
            }
        } catch (err) {
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

export const actionDeleteVideoTextFile = async (eventId) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${VIDEO_TEXT_FILE_PATH}/${eventId}`, {
            method: 'DELETE'
        });
        if (response.status === 201) {
            let responseJSON = await response.json();
            return responseJSON;
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const actionUploadVideoTextFile = async (data) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${VIDEO_TEXT_FILE_PATH}`, {
            method: 'POST',
            body: data
        });
        if (response.status === 201) {
            let responseJSON = await response.json();
            return responseJSON;
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const fetchDeletionDate = (eventId) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${EVENT_PATH}${eventId}${EVENT_DELETION_DATE_PATH}`);
            if(response.status === 200){
                let responseJSON = await response.json();
                dispatch(apiGetDeletionDateSuccessCall(responseJSON));
            } else {
                dispatch(apiGetDeletionDateFailureCall('error_failed_to_get_event_deletion_date'));
            }
        } catch(err) {
            console.log(err);
        }

    };
};

export const actionUpdateDeletionDate = async (id, deletionDate) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${EVENT_PATH}${id}${EVENT_DELETION_DATE_PATH}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deletionDate)
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

export const actionUpdateExpiryDates = async (id, expiryDate) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${EVENT_PATH}${id}${EVENT_EXPIRY_DATE_PATH}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expiryDate)
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

export const apiGetEventsBySeriesSuccessCall = data => ({
    type: 'SUCCESS_API_GET_EVENTS_BY_SERIES',
    payload: data,
    loading: false
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

export const apiGetInboxEventsSuccessCallWithoutSettingLoading = data => ({
    type: 'SUCCESS_API_GET_INBOX_EVENTS_WITHOUT_SETTING_LOADING',
    payload: data
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

export const setEventProcessingState = data => {
    return async dispatch => {
        dispatch(apiEventProcessingState(data));
    };
};

export const apiEventProcessingState = data => ({
    type: 'PROCESSING_STATE_UPDATE',
    payload: data
});

export const apiGetDeletionDateSuccessCall = (data) => ({
    type: 'SUCCESS_API_GET_DELETION_DATE',
    payload: data
});

export const apiGetDeletionDateFailureCall = (msg) => ({
    type: 'FAILURE_API_GET_DELETION_DATE',
    payload: msg,
    loading: false
});
