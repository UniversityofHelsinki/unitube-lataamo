export const fetchUser = () => {
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/user';
    return async (dispatch)  => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetUserSuccessCall(responseJSON));
            } else {
                dispatch(api401FailureCall(new Date()));
            }
        } catch(err) {
            dispatch(apiFailureCall('Unable to fetch data'));
        }
    };
};

export const apiGetUserSuccessCall = data => {
    return{
        type: 'SUCCESS_API_GET_USER',
        payload: data
    };
};

export const apiGetUserTranslationAuthorizedSuccessCall = data => {
    return{
        type: 'SUCCESS_API_GET_USER_TRANSLATION_AUTHORIZED',
        payload: data
    };
};


export const api401FailureCall = failureTime => ({
    type: 'STATUS_401_API_CALL',
    payload : failureTime
});

export const apiFailureCall = msg => ({
    type: 'FAILURE_API_CALL',
    payload: msg
});

export const isAuthorizedToTranslation = () => {
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/user/isAuthorizedToTranslation';
    return async (dispatch)  => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
            if(response.status === 200) {
                let responseJSON = await response.json();
                dispatch(apiGetUserTranslationAuthorizedSuccessCall(responseJSON));
            } else {
                dispatch(api401FailureCall(new Date()));
            }
        } catch(err) {
            dispatch(apiFailureCall('Unable to fetch data'));
        }
    };
};
