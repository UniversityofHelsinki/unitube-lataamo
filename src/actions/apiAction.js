// asynchronous action creator
export const fetchData = () => {
    return async (dispatch) => {
        try {
            let response = await fetch('http://localhost:5000/api');
            let responseJSON = await response.json();
            dispatch(apiSuccessCall(responseJSON));
        } catch(err) {
            dispatch(apiFailureCall("Unable to fetch data"));
        }
    }
}

export const apiSuccessCall = data => ({
    type: "SUCCESS_API_CALL",
    payload: {
        ...data
    }
});


export const apiFailureCall = msg => ({
    type: "FAILURE_API_CALL",
    msg
});


