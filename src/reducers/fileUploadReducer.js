const initialState = {
    percentage: 0,
    updateSuccessMessage : null,
    updateFailedMessage: null
};

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'UPDATE_PROGRESS':
        return {
            ...state,
            percentage: action.payload
        };
    case 'FILE_UPLOAD_SUCCESS':
        return {
            ...state,
            updateSuccessMessage: action.payload
        };
    case 'FILE_UPLOAD_FAILED':
        return {
            ...state,
            updateFailedMessage: action.payload
        };
    case 'EMPTY_PROGRESS_SUCCESS_MESSAGE':
        return {
            ...state,
            updateSuccessMessage: action.payload
        };
    case 'EMPTY_PROGRESS_FAILURE_MESSAGE':
        return {
            ...state,
            updateFailedMessage: action.payload
        };
    default:
        return state;
    }
};

export default fileUploadReducer;

