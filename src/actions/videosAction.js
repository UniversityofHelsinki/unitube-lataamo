// asynchronous action creator

export const fetchVideos = () => {

    // json-server, port specified in package.json
    const LOCAL_DEV_JSON_SERVER_API = 'http://localhost:3002/videos'

    return async (dispatch) => {
        try {
            let response = await fetch(LOCAL_DEV_JSON_SERVER_API);
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
