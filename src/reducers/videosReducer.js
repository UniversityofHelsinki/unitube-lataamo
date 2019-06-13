
const initialState = {
    videos: [],
    video: {},
    selectedRowId: ''
};

const videosReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_VIDEOS':
        return {
            ...state,
            videos: action.payload
        };
    case 'SUCCESS_API_GET_VIDEO':
        return {
            ...state,
            video: action.payload,
            selectedRowId: action.selectedRowId
        };
    default:
        return state;
    }
};

export default videosReducer;