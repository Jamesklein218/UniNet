import {axios} from '@utils/custom-axios';
import {API_URL} from '@config/setting';

export const NotificationAPI = {
  getNotification: () => axios.get(`${API_URL}/me/notification`),

  readNotification: notificationId =>
    axios.post(`${API_URL}/notification/${notificationId}`),
};
