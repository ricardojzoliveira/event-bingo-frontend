import axios from 'axios';

const api = axios.create({
  // CORS.
  baseURL: "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;