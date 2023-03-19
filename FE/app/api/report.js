import {axios} from '@utils/custom-axios';
import {API_URL} from '@config/setting';

export const ReportAPI = {
  getActiveSession: () =>
    axios.get(`${API_URL}/practice-report/active-session`),

  getSessionById: sessionId =>
    axios.get(`${API_URL}/practice-report/session/${sessionId}`),

  getQuestionById: questionId =>
    axios.get(`${API_URL}/practice-report/question/${questionId}`),

  getAnswerById: answerId =>
    axios.get(`${API_URL}/practice-report/answer/${answerId}`),

  getReportActivity: () => axios.get(`${API_URL}/me/report-answers`),

  submitAnswer: data => axios.post(`${API_URL}/practice-report/answer`, data),
  editAnswer: data => axios.patch(`${API_URL}/practice-report/update`, data),
};
