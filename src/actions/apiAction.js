// asynchronous action creator

export const fetchVideos = () => {

    // server from .env variable
    const VIDEO_SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
    
    return async (dispatch) => {
        try {
            let response = await fetch(`${VIDEO_SERVER_API}/videos`);
            let responseJSON = await response.json();
            
            dispatch(apiGetVideosSuccessCall(responseJSON));
        } catch(err) {
            dispatch(apiFailureCall("Unable to fetch data"));
        }
    }
}

export const apiGetVideosSuccessCall = data => {
    
    return{
        type: "SUCCESS_API_GET_VIDEOS",
        payload: data
    };
}


export const apiFailureCall = msg => ({
    type: "FAILURE_API_CALL",
    msg
});
