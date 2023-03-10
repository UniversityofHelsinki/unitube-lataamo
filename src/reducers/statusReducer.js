
const initialState = {
    redirect401: null
};

const statusReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'STATUS_401_API_CALL':
        return {
            ...state,
            redirect401: action.payload
        };
    case 'FAILURE_API_CALL':
        return {
            ...state,
            apiError: action.payload
        };
    default:
        return state;
    }
};

export default statusReducer;