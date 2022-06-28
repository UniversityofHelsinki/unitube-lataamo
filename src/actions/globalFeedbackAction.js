const _setGlobalFeedback = (message, variant = 'success') => {
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

let timeoutID;
export const setGlobalFeedback = (message, variant = 'success', ms = 10000) => {
    return (dispatch) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        dispatch(_setGlobalFeedback(message, variant));
        timeoutID = setTimeout(() => {
            dispatch(clearGlobalFeedback());
        }, ms);
    };
};

export default setGlobalFeedback;