import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = {
  getUsers: () => axios.get(`${API_URL}/users`),
  getNews: () => axios.get(`${API_URL}/news`),
  getNewsById: (id) => axios.get(`${API_URL}/news/${id}`),
  createNews: (data) => axios.post(`${API_URL}/news`, data),
  updateNews: (id, data) => axios.patch(`${API_URL}/news/${id}`, data),
  deleteNews: (id) => axios.delete(`${API_URL}/news/${id}`),
};
