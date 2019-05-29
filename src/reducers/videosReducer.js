
const initialState = {
    videos: []
};

const videosReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_VIDEOS':
        return {
            ...state,
            videos: action.payload
        };
    default:
        return state;
    }
};

export default videosReducer;