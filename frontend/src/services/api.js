import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adjunta automáticamente el token JWT guardado en localStorage a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('caa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const registerRequest = (data) => api.post('/auth/register', data);
export const loginRequest = (data) => api.post('/auth/login', data);
export const getProfileRequest = () => api.get('/auth/profile');
export const updatePreferencesRequest = (data) => api.put('/auth/preferences', data);

// --- Cards ---
export const getCardsRequest = (category) =>
  api.get('/cards', { params: category ? { category } : {} });
export const createCardRequest = (data) => api.post('/cards', data);
export const updateCardRequest = (id, data) => api.put(`/cards/${id}`, data);
export const deleteCardRequest = (id) => api.delete(`/cards/${id}`);

// --- Boards ---
export const getBoardsRequest = () => api.get('/boards');
export const getBoardRequest = (id) => api.get(`/boards/${id}`);
export const createBoardRequest = (data) => api.post('/boards', data);
export const updateBoardRequest = (id, data) => api.put(`/boards/${id}`, data);
export const addCardToBoardRequest = (boardId, cardId) =>
  api.put(`/boards/${boardId}/add-card/${cardId}`);
export const deleteBoardRequest = (id) => api.delete(`/boards/${id}`);

// --- Vinculación (equipo de cuidado: paciente / tutor / terapeuta) ---
export const generateInviteCodeRequest = () => api.post('/links/invite-code');
export const connectWithCodeRequest = (code) => api.post('/links/connect', { code });
export const getLinkedUsersRequest = () => api.get('/links');
export const removeLinkRequest = (userId) => api.delete(`/links/${userId}`);

export default api;
