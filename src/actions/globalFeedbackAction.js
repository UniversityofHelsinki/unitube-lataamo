export const setGlobalFeedback = (message, variant = 'success') => {
    return {
        type: 'SET_GLOBAL_FEEDBACK',
        payload: { message, variant }
    };
};

export const clearGlobalFeedback = () => {
    return {
        type: 'CLEAR_GLOBAL_FEEDBACK',
    };
};

export default setGlobalFeedback;