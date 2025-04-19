import axios from 'axios';

const api = axios.create({
  baseURL: 'https://startuprush-back.onrender.com', // teu backend Spring Boot
});

export default api;
