const initialState = {
    percentage: 0
};

const fileDownloadReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DOWNLOAD_PROGRESS':
            return {
                ...state,
                percentage: action.payload
            };
        default:
            return state;
    }
};

export default fileDownloadReducer;
