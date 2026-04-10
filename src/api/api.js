import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // futuramente colocarr link para api
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;