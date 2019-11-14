
const initialState = {
    videoFiles: [],
    selectedRowId: ''
};

const videosReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_VIDEO':
        return {
            ...state,
            videoFiles: action.payload,
            selectedRowId: action.selectedRowId
        };
        case 'DESELECT_ROW':
            return {
                selectedRowId: ''
            };
    default:
        return state;
    }
};

export default videosReducer;