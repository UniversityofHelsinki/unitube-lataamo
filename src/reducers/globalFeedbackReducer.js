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
    default:
        return state;
    }
};