import setGlobalFeedback from './globalFeedbackAction';
// asynchronous action creator
const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_SERIES_PATH = '/api/series/';
const USER_SERIES_ACL_PATH = '/api/series/acl/';
const PERSON_API_PATH = '/api/persons/';
const SERIES_DROP_DOWN_PATH = '/api/getUserSeriesDropDownList';
const SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const IAM_GROUP_PATH = '/api/iamGroups/';

export const personQuery = async (query) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${PERSON_API_PATH}${query}`, {
            method: 'GET',
        });
        if(response.status === 200) {
            return await response.json();
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const fetchSerie = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${ VIDEO_SERVER_API }${ USER_SERIES_PATH }${ row.identifier }`);
            if (response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetSerieSuccessCall(responseJSON, row.identifier));
            } else if (response.status === 404) {
                dispatch(apiFailureCall('not_found_error'));
            } else if (response.status === 401) {
                dispatch(api401FailureCall(new Date()));
            } else {
                dispatch(apiFailureCall('general_error'));
            }
        } catch (err) {
            dispatch(apiFailureCall('general_error'));
        }
    };
};

export const fetchSeriesDropDownList = () => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${SERIES_DROP_DOWN_PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetSeriesDropDownListSuccessCall(responseJSON));
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

export const fetchSeriesWithOutTrash = () => {
    // server from .env variable
    const PATH = '/api/userSeriesWithOutTrash';
    return async (dispatch) => {
        try {
            dispatch(apiGetSeriesRequestCall());
            let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetSeriesSuccessCall(responseJSON));
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

export const fetchSeries = () => {
    // server from .env variable
    const PATH = '/api/userSeries';
    return async (dispatch) => {
        try {
            dispatch(apiGetSeriesRequestCall());
            let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetSeriesSuccessCall(responseJSON));
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

export const iamGroupQuery = async (query) => {
    try {
        let response = await fetch(`${SERVER_API}${IAM_GROUP_PATH}${query}`, {
            method: 'GET',
        });
        if(response.status === 200) {
            return await response.json();
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const actionUpdateSerieDetails = async (id, updatedSerie) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${USER_SERIES_PATH}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSerie)
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

export const actionUpdateSerieAclMetaData = async (id, updatedSerie) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${USER_SERIES_ACL_PATH}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSerie)
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

export const actionDeleteSeries = (series) => {
    return async (dispatch) => {
        const response = await fetch(`${VIDEO_SERVER_API}${USER_SERIES_PATH}${series.identifier}`, {
            method: 'DELETE'
        });
        if (response.status === 204) {
            dispatch(apiDeleteSeriesSuccessCall(series));
            dispatch(setGlobalFeedback('api_delete_series_successful'));
        } else {
            throw new Error(response.status);
        }
    };
};

export const actionUploadSeries = (newSeries) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${USER_SERIES_PATH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSeries)
            });
            if (response.status === 200) {
                dispatch(apiPostSeriesSuccessCall());
                dispatch(setGlobalFeedback('api_post_series_successful'));
            } else if(response.status === 403){
                dispatch(apiPostSeries403FailureCall());
            } else if(response.status === 500){
                let resp = await response.json();
                dispatch(apiPostSeries500FailureCall(resp.message));
            } else {
                dispatch(apiPostSeriesFailureCall());
            }
        } catch (error) {
            dispatch(apiPostSeriesFailureCall());
        }
    };
};

export const updateSelectedSeries = (seriesId) => {
    return async (dispatch) => {
        dispatch(updateSelectedSeriesCall(seriesId));
    };
};

export const addMoodleNumber = (moodleNumber) => {
    return async (dispatch) => {
        dispatch(addMoodleNumberCall(moodleNumber));
    };
};

export const removeMoodleNumber = (moodleNumber) => {
    return async (dispatch) => {
        dispatch(removeMoodleNumberCall(moodleNumber));
    };
};

export const emptyMoodleNumber = () => {
    return async (dispatch) => {
        dispatch(emptyMoodleNumberCall());
    };
};

export const clearPostSeriesSuccessMessage = () => {
    return async (dispatch) => {
        dispatch(clearPostSeriesSuccessCall());
    };
};

export const clearPostSeriesFailureMessage = () => {
    return async (dispatch) => {
        dispatch(clearPostSeriesFailureCall());
    };
};

// update the series list in state (called on series information update)
export const updateSeriesList = (updatedList) => {
    return async dispatch => {
        dispatch(apiGetSeriesSuccessCall(updatedList));
    };
};

export const apiGetSeriesRequestCall = () => ({
    type: 'GET_SERIES_REQUEST',
    loading: true
});

export const apiPostSeriesSuccessCall = () => ({
    type: 'SUCCESS_API_POST_SERIES',
    payload: 'api_post_series_successful'
});

export const apiPostSeriesFailureCall = () => ({
    type: 'FAILURE_API_POST_SERIES',
    payload: 'api_post_series_failed'
});

export const clearPostSeriesSuccessCall = () => ({
    type: 'CLEAR_API_POST_SERIES_SUCCESS_CALL',
    payload: null
});

export const clearPostSeriesFailureCall = () => ({
    type: 'CLEAR_API_POST_SERIES_FAILURE_CALL',
    payload: null
});

export const apiDeleteSeriesSuccessCall = (serie) => ({
    type: 'SUCCESS_API_DELETE_SERIES',
    payload: {
        message: 'api_delete_series_successful',
        serie
    }
});

export const apiDeleteSeriesFailureCall = (serie) => ({
    type: 'FAILURE_API_DELETE_SERIES',
    payload: {
        message: 'api_delete_series_failure',
        serie
    }
});

export const apiGetSeriesDropDownListSuccessCall = data => ({
    type: 'SUCCESS_API_GET_SERIES_DROP_DOWN_LIST',
    payload: data,
    loading: false
});

export const apiGetSeriesSuccessCall = data => ({
    type: 'SUCCESS_API_GET_SERIES',
    payload: data,
    loading: false
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

export const apiPostSeries403FailureCall = () => ({
    type: 'STATUS_403_API_CALL',
    payload: 'api_post_series_failed_series_inbox_exists_already'
});

export const apiPostSeries500FailureCall = (message) => ({
    type: 'STATUS_500_API_CALL',
    payload: message
});

export const addPerson = (person) => ({
    type: 'ADD_PERSON',
    payload: person
});

export const removePerson = (person) => ({
    type: 'REMOVE_PERSON',
    payload: person
});

export const emptyPersons = () => ({
    type: 'EMPTY_PERSONS',
    payload: []
});

export const apiGetSerieSuccessCall = (data, selectedRowId) => ({
    type: 'SUCCESS_API_GET_SERIE',
    payload: data,
    selectedRowId: selectedRowId
});

export const addIamGroup = (iamGroup) => ({
    type: 'ADD_IAM_GROUP',
    payload: iamGroup
});

export const removeIamGroup = (iamGroup) => ({
    type: 'REMOVE_IAM_GROUP',
    payload: iamGroup
});

export const emptyIamGroupsCall = () => ({
    type: 'EMPTY_IAM_GROUPS',
    payload: []
});

export const removeMoodleNumberCall = (moodleNumber) => ({
    type: 'REMOVE_MOODLE_NUMBER',
    payload: moodleNumber
});

export const addMoodleNumberCall = (moodleNumber) => ({
    type: 'ADD_MOODLE_NUMBER',
    payload: moodleNumber
});

export const emptyMoodleNumberCall = () => ({
    type: 'EMPTY_MOODLE_NUMBER',
    payload: []
});

export const updateSelectedSeriesCall = (seriesId) => ({
    type: 'UPDATE_SELECTED_SERIES',
    payload: seriesId
});
