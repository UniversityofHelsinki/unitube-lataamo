const languageChangeAction = (payload) => {
    return {
        type: 'LANGUAGE_CHANGE',
        payload
    };
};
export default languageChangeAction;