const routeAction = (payload) => {
    return {
        type: 'routeChange',
        payload
    };
};
export default routeAction;