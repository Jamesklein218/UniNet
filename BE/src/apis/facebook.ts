import axios from 'axios';
const FB_GRAPH_API = 'https://graph.facebook.com/v3.3/';

export const FacebookAPI = {
    queryUserData: (access_token: string) =>
        axios.get(`${FB_GRAPH_API}me`, {
            params: {
                access_token,
                fields: 'id,first_name,last_name,email',
            },
        }),
};
