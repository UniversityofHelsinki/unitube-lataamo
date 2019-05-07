const apiReducer = (state = {}, action) => {
    switch (action.type) {
        case "SUCCESS_API_CALL":
            return {
                ...state,
                helloPayload: action.payload
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