import api from '../config/api';

export const cityApi = {
  getAll: () => api.get('/cities'),
  getById: (id) => api.get(`/cities/${id}`),
  search: (q) => api.get('/cities/search', { params: { q } }),
  getCountries: () => api.get('/cities/countries'),
  getByCountry: (country) => api.get(`/cities/country/${encodeURIComponent(country)}`),
};

export const interestApi = {
  getAll: () => api.get('/interests'),
  getById: (id) => api.get(`/interests/${id}`),
  search: (q) => api.get('/interests/search', { params: { q } }),
};

export const userApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getById: (id) => api.get(`/users/${id}`),
  createIdentity: (data) => api.post('/users/identity', data),
  regenerateName: () => api.post('/users/regenerate-name'),
  updateInterests: (ids) => api.put('/users/interests', ids),
  updateCity: (cityId) => api.put(`/users/city/${cityId}`),
  updateProfile: (data) => api.put('/users/me', data),
  search: (q, page = 0, size = 20) => api.get('/users/search', { params: { q, page, size } }),
};

export const communityApi = {
  getById: (id) => api.get(`/communities/${id}`),
  getByCity: (cityId, page = 0, size = 20) => api.get(`/communities/city/${cityId}`, { params: { page, size } }),
  getSuggested: (cityId, limit = 6) => api.get(`/communities/city/${cityId}/suggested`, { params: { limit } }),
  getTrending: (cityId, limit = 6) => api.get(`/communities/city/${cityId}/trending`, { params: { limit } }),
  create: (data) => api.post('/communities', data),
  update: (id, data) => api.put(`/communities/${id}`, data),
  delete: (id) => api.delete(`/communities/${id}`),
  getMembers: (id, page = 0, size = 20) => api.get(`/communities/${id}/members`, { params: { page, size } }),
  join: (id) => api.post(`/communities/${id}/join`),
  leave: (id) => api.post(`/communities/${id}/leave`),
};

export const postApi = {
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  getFeed: (cityId, page = 0, size = 20) => api.get('/posts/feed', { params: { cityId, page, size } }),
  getCommunityPosts: (communityId, page = 0, size = 20) => api.get(`/posts/community/${communityId}`, { params: { page, size } }),
  getUserPosts: (userId, page = 0, size = 20) => api.get(`/posts/user/${userId}`, { params: { page, size } }),
  getTrending: (cityId, page = 0, size = 20) => api.get('/posts/trending', { params: { cityId, page, size } }),
  like: (id) => api.post(`/posts/${id}/like`),
  unlike: (id) => api.delete(`/posts/${id}/like`),
  bookmark: (id) => api.post(`/posts/${id}/bookmark`),
  unbookmark: (id) => api.delete(`/posts/${id}/bookmark`),
  getBookmarks: (page = 0, size = 20) => api.get('/posts/bookmarks', { params: { page, size } }),
  search: (q, page = 0, size = 20) => api.get('/posts/search', { params: { q, page, size } }),
};

export const commentApi = {
  getByPost: (postId, page = 0, size = 20) => api.get(`/comments/post/${postId}`, { params: { page, size } }),
  getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
  create: (postId, data) => api.post(`/comments/post/${postId}`, data),
  update: (commentId, data) => api.put(`/comments/${commentId}`, data),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
  like: (commentId) => api.post(`/comments/${commentId}/like`),
  unlike: (commentId) => api.delete(`/comments/${commentId}/like`),
};

export const chatApi = {
  getRooms: () => api.get('/chat/rooms'),
  getRoom: (id) => api.get(`/chat/rooms/${id}`),
  getOrCreatePrivate: (recipientId) => api.post(`/chat/rooms/private/${recipientId}`),
  createCommunityRoom: (communityId) => api.post(`/chat/rooms/community/${communityId}`),
  sendMessage: (data) => api.post('/chat/messages', data),
  getMessages: (chatRoomId, page = 0, size = 50) => api.get(`/chat/rooms/${chatRoomId}/messages`, { params: { page, size } }),
  getPinnedMessages: (chatRoomId) => api.get(`/chat/rooms/${chatRoomId}/pinned`),
  editMessage: (messageId, content) => api.put(`/chat/messages/${messageId}`, content),
  deleteMessage: (messageId) => api.delete(`/chat/messages/${messageId}`),
  pinMessage: (messageId) => api.post(`/chat/messages/${messageId}/pin`),
  unpinMessage: (messageId) => api.delete(`/chat/messages/${messageId}/pin`),
  getOnlineUsers: (chatRoomId) => api.get(`/chat/rooms/${chatRoomId}/online`),
};

export const notificationApi = {
  getAll: (page = 0, size = 20) => api.get('/notifications', { params: { page, size } }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const searchApi = {
  search: (q, cityId) => api.get('/search', { params: { q, cityId } }),
};

export const dashboardApi = {
  getDashboard: (cityId) => api.get('/dashboard', { params: { cityId } }),
};

export const reportApi = {
  create: (data) => api.post('/reports', data),
  getAll: (page = 0, size = 20) => api.get('/reports', { params: { page, size } }),
  resolve: (id) => api.put(`/reports/${id}/resolve`),
  dismiss: (id) => api.put(`/reports/${id}/dismiss`),
};
