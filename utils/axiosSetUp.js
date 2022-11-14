import axios from "axios";
// import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://todo-be-ashen.vercel.app/user",
});
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

axiosInstance.interceptors.request.use((config) => {
  if (config.url !== "/login" || config.url !== "/signup") {
    console.log('hello')
    const jwt = JSON.parse(localStorage.getItem("accessToken"));
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }
  return config;
});

export default axiosInstance;
