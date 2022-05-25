export const setGlobalFeedback = (message) => {
    return {
        type: 'SET_GLOBAL_FEEDBACK',
        payload: message
    };
};

export default setGlobalFeedback;