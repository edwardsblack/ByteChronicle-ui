import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const developerService = {
  // Get current developer key
  getCurrentKey: async () => {
    const response = await api.get('/developer/key');
    return response.data.key;
  },

  // Update developer key
  updateKey: async (newKey) => {
    const response = await api.put('/developer/key', { key: newKey });
    return response.data;
  },

  // Validate developer key
  validateKey: async (key) => {
    const response = await api.post('/developer/validate', { key });
    return response.data.valid;
  },
};

export default developerService;
