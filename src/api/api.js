import axios from 'axios';

const api = axios.create({
  // Ajuda para não termos de escrever sempre o url da api.
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;