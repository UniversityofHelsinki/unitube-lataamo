// asynchronous action creator
const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const SERIE_PATH = '/api/series/';

export const fetchSerie = (row) => {
    return async (dispatch) => {
        try {
            let response = await fetch(`${ VIDEO_SERVER_API }${ SERIE_PATH }${ row.identifier }`);
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
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/userSeries';

    return async (dispatch) => {
        try {
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

export const actionUpdateSerieDetails = async (id, updatedSerie) => {
    try {
        let response = await fetch(`${VIDEO_SERVER_API}${SERIE_PATH}${id}`, {
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