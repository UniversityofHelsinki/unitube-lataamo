const initialState = {
    timeRemaining: 0,
    percentage: 0,
    updateSuccessMessage : null,
    updateFailedMessage: null,
    textFileSuccessMessage: null,
    textFileFailedMessage: null
};

const fileUploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PROGRESS':
            return {
                ...state,
                percentage: action.payload
            };
        case 'UPDATE_TIME_REMAINING':
            return {
                ...state,
                timeRemaining: action.payload
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
        case 'EMPTY_PROGRESS_ERROR_MESSAGE':
            return {
                ...state,
                updateFailedMessage: action.payload
            };
        case 'TEXT_FILE_UPLOAD_SUCCESS':
            return {
                ...state,
                textFileSuccessMessage: action.payload
            };
        case 'TEXT_FILE_UPLOAD_FAILED':
            return {
                ...state,
                textFileFailedMessage: action.payload
            };
        default:
            return state;
    }
};

export default fileUploadReducer;
