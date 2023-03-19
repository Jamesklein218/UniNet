import {axios} from '@utils/custom-axios';
import {API_URL} from '@config/setting';

export const ForumAPI = {
  createForumPost: (title, content) =>
    axios.post(`${API_URL}/forum/createpost`, {title, content}),
  getAllPost: () => axios.get(`${API_URL}/forum/allposts`),
  getPostById: postId => axios.get(`${API_URL}/forum/post/${postId}`),
  deletePost: postId => axios.delete(`${API_URL}/forum/deletepost/${postId}`),
  upvotePost: postId => axios.post(`${API_URL}/forum/upvotepost/${postId}`),
  downvotePost: postId => axios.post(`${API_URL}/forum/downvotePost/${postId}`),
  createComment: (postId, content) =>
    axios.post(`${API_URL}/forum/createcomment/${postId}`, {content}),
  getAllComments: postId => axios.get(`${API_URL}/forum/allcomments/${postId}`),
  getCommentById: commentId =>
    axios.get(`${API_URL}/forum/comment/${commentId}`),
  deleteComment: commentId =>
    axios.delete(`${API_URL}/forum/deletecomment/${commentId}`),
  upvoteComment: commentId =>
    axios.post(`${API_URL}/forum/upvotecomment/${commentId}`),
  downvoteComment: commentId =>
    axios.post(`${API_URL}/forum/downvoteComment/${commentId}`),
};
