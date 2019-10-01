const SERVER_API = process.env.REACT_APP_LATAAMO_PROXY_SERVER;
const IAM_GROUP_PATH = '/api/iamGroups/';

export const iamGroupQuery = async (query) => {
    try {
        let response = await fetch(`${SERVER_API}${IAM_GROUP_PATH}${query}`, {
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