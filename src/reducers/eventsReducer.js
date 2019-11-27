
const initialState = {
    videos: [],
    inboxVideos: [],
    event: {
        title : '',
        description: ''
    }
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SUCCESS_API_GET_EVENTS':
        return {
            ...state,
            videos: action.payload,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_INBOX_EVENTS':
        return {
            ...state,
            inboxVideos: action.payload,
            loading: action.loading
        };
    case 'GET_EVENTS_REQUEST':
        return {
            ...state,
            loading: action.loading
        };
    case 'SUCCESS_API_GET_EVENT':
        return {
            ...state,
            event: action.payload
        };
    case 'DESELECT_EVENT':
        return {
            ...state,
            event: {
                title : '',
                description: ''
            }
        };
    default:
        return state;
    }
};

export default eventsReducer;