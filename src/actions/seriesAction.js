// asynchronous action creator

const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const USER_SERIES_PATH = '/api/series';

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