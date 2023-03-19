import axios from 'axios';

const ZL_GRAPH_API = 'https://graph.zalo.me/v2.0/';

export const ZaloZPI = {
    queryUserData: (access_token: string) =>
        axios.get(`${ZL_GRAPH_API}me`, {
            params: {
                access_token,
                fields: 'id,name',
            },
        }),
};
