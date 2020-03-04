
const initialState = {
    videos: [],
    inboxVideos: [],
    trashVideos: [],
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
    case 'SUCCESS_API_GET_TRASH_EVENTS':
        return {
            ...state,
            trashVideos: action.payload,
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
    case 'PROCESSING_STATE_UPDATE':
        return {
            ...state,
            event: action.payload
        };
    default:
        return state;
    }
};

export default eventsReducer;