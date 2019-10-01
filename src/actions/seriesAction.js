// asynchronous action creator
const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_SERIES_PATH = '/api/series/';

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

export const fetchSerie = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${ VIDEO_SERVER_API }${ USER_SERIES_PATH }${ row.identifier }`);
            if (response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetSerieSuccessCall(responseJSON, row.identifier));
            } else if (response.status === 404) {
                dispatch(apiFailureCall('Unable to fetch data'));
            } else if (response.status === 401) {
                dispatch(api401FailureCall(new Date()));
            } else {
                dispatch(apiFailureCall('Unable to fetch data'));
            }
        } catch (err) {
            dispatch(apiFailureCall('Unable to fetch data'));
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
                dispatch(apiFailureCall('Unable to fetch data'));
            }
        } catch(err) {
            dispatch(apiFailureCall('Unable to fetch data'));
        }
    };
};

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

export const apiGetSeriesRequestCall = () => ({
    type: 'GET_SERIES_REQUEST',
    loading: true
});

const SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const IAM_GROUP_PATH = '/api/iamGroups/';

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

// update the serielist in state (called on serie information update)
export const updateSerieList = (updatedList) => {
    return async dispatch => {
        dispatch(apiGetSeriesSuccessCall(updatedList));
    };
};

export const apiGetSerieSuccessCall = (data, selectedRowId) => ({
    type: 'SUCCESS_API_GET_SERIE',
    payload: data,
    selectedRowId: selectedRowId
});

export const actionUploadSeries = async (newSeries) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${USER_SERIES_PATH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSeries)
        });
        if(response.status === 200){
            let responseJSON = await response.json();
            return responseJSON;
        }else{
            throw new Error(response.status);
        }

    }catch (error) {
        throw new Error(error);
    }
};

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