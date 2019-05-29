export const fetchUser = () => {
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    const PATH = '/api/user';
    return async (dispatch)  => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}${PATH}`);
            let responseJSON = await response.json();
            dispatch(apiGetUserSuccessCall(responseJSON));
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


export const apiFailureCall = msg => ({
    type: 'FAILURE_API_CALL',
    msg
});