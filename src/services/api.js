import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
})

export default api
