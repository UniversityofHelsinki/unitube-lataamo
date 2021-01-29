const initialState = {
    percentage: 0,
    downloadRemainingTime: null
};

const fileDownloadReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DOWNLOAD_PROGRESS':
            return {
                ...state,
                percentage: action.payload
            };
        case 'DOWNLOAD_REMAINING_TIME':
            return {
                ...state,
                downloadRemainingTime: action.payload
            }
        default:
            return state;
    }
};

export default fileDownloadReducer;
