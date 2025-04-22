import axios from 'axios'

const api = axios.create({
  baseURL: 'https://startupback.onrender.com' // nova URL do backend
})

export default api
