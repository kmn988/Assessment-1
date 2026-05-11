import axios, { AxiosError, type AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 1000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const skipAuthUrls = ["/login", "/register"];

    if (skipAuthUrls.some((url) => config.url?.includes(url))) {
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error: AxiosError) {
    if (
      error.response?.status === 401 &&
      error.response?.config.url !== "/login" &&
      error.response?.config.url !== "/register"
    ) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
