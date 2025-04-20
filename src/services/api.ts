import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' // Porta do backend local
  });

export default api;
