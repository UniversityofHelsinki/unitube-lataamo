const initialState = {
    globalFeedback: ''
};

export const globalFeedbackReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SET_GLOBAL_FEEDBACK':
        return {
            ...state,
            globalFeedback: action.payload
        };
    case 'CLEAR_GLOBAL_FEEDBACK':
        return {
            ...state,
            globalFeedback: undefined
        };
    default:
        return state;
    }
};