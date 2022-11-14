import axios from "axios";
// import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://todo-be-ashen.vercel.app/user",
});
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = "*";
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
