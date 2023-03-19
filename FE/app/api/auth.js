import {axios} from '@utils/custom-axios';
import {API_URL, AUTH_URL_ADMIN, AUTH_URL_USER} from '@config/setting';

export const AuthAPI = {
  // Call during login

  login: (username, password) =>
    axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    }),

  registerDeviceToken: token =>
    axios.post(`${API_URL}/users/register_device`, {
      token,
    }),

  registerUserToDeviceToken: tokenId =>
    axios.post(`${API_URL}/users/device_token`, {
      tokenId,
    }),

  getProfile: () => axios.get(`${API_URL}/me`),

  // Account API

  updateProfile: data =>
    axios.patch(`${API_URL}/me/profile`, {
      name: data.name,
      email: data.email,
      address: data.address,
      description: data.description,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      classId: data.classId,
      major: data.major,
      phone: data.phone,
      studentId: data.studentId,
    }),

  changePassword: (currentPassword, newPassword) =>
    axios.post(`${API_URL}/me/change-password`, {
      currentPassword,
      newPassword,
    }),

  searchUser: keyword =>
    axios.get(`${API_URL}/users/search?keyword="${keyword}"`),
};
