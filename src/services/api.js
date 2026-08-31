import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
})

export default api
