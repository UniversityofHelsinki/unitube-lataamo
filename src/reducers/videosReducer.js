
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
            videos: action.payload,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_VIDEO':
        return {
            ...state,
            video: action.payload,
            selectedRowId: action.selectedRowId
        };
    case 'GET_VIDEOS_REQUEST':
        return {
            ...state,
            loading: action.loading
        };
    default:
        return state;
    }
};

export default videosReducer;