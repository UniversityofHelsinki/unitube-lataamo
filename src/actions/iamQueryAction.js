
export const iamGroupQuery = async (query) => {
    try {
        let response = await fetch('https://esb-api-test-1-19.it.helsinki.fi/devel/iam/group/unitube/search/' + query, {
            method: 'GET',
        });
        if(response.status === 200) {
            return await response.json();
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        throw new Error(error);
    }
};