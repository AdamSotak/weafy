import axios from "axios";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_SERVICE_API_URL,
    headers: {
        Authorization: process.env.EXPO_PUBLIC_SERVICE_API_KEY,
        "Content-Type": "application/json",
    }
});

export default api;