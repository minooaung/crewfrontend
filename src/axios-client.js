import axios from "axios";

import store from "./store/index";
import { authActions } from "./store/auth";
import { notiActions } from "./store/notification";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // Send cookies automatically
});

axiosClient.interceptors.request.use((config) => {
  // Not using token as automatically sending cookies
  // const token = localStorage.getItem("ACCESS_TOKEN");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  config.headers["Content-Type"] = "application/json";

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response, config } = error;

      console.log("config: ", config);

      if (response.status === 401) {
        // Prevent redirect loop when already on login page
        if (!config.url.includes("/auth/login")) {
          console.log("Session Expired. Logging out...");

          store.dispatch(authActions.logout());
          window.location.href = "/login";
        }
      }

      // if (response.status === 401) {
      //   // Session expired or user is not authenticated
      //   console.log("Session Expired. Logging out...");

      //   // Dispatch Redux logout action
      //   store.dispatch(authActions.logout());

      //   window.location.href = "/login"; // Redirect to login
      // }
    } catch (e) {
      console.error(e);
    }

    throw error;
  }
);

export default axiosClient;
