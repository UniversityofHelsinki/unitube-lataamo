// asynchronous action creator
export const fetchSeries = () => {

    // server from .env variable
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
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

export const apiGetSeriesRequestCall = () => ({
    type: 'GET_SERIES_REQUEST',
    loading: true
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