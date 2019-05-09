
const initialState = {
    videos: []
};

const apiReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SUCCESS_API_GET_VIDEOS":            
            return {
                ...state,
                videos: action.payload
            };
        case "FAILURE_API_CALL":
            return {
                ...state,
                error: action.msg
            };
        default:
            return state;
    }
};

export default apiReducer;