import Axios from "axios";
import { getBaseUrl } from "../utility/getBaseURL";
import { jwtDecode } from "jwt-decode";

const BASEURL = getBaseUrl();

export const axiosInstance = Axios.create({
  baseURL: BASEURL,
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       const authDataString = localStorage.getItem("token");
//       const authData = JSON.parse(authDataString);
//       let token = authData?.authToken;

//       if (token && !checkIfExpired(token)) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }

//       // Initialize retry count if not already present
//       config.__retryCount = config.__retryCount || 0;
//       return config;
//     } catch (err) {
//       console.error("Error in request interceptor:", err);
//       return Promise.reject(err); // Ensure the error is properly propagated
//     }
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const authDataString = localStorage.getItem('token');
      
      if (!authDataString) {
        console.warn("No auth data found in localStorage");
        return config;
      }

     
      const token = authDataString; 

      if (token && !checkIfExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error("Interceptor: Token is expired or invalid");
      }

      // Initialize retry count if not already present
      config.__retryCount = config.__retryCount || 0;
      return config;
    } catch (err) {
      console.error("Error in request interceptor:", err);
      return Promise.reject(err);
    }
  },
  (err) => {
    console.error("Request interceptor error:", err);
    return Promise.reject(err);
  }
);

export const checkIfExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = new Date().getTime();

    if (now > decoded.exp * 1000) {
      return true; // Token is expired
    }

    if (now < decoded.iat * 1000 - 60000) {
      alert("Wrong System Time \n Please correct your system time");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in checkIfExpired:", error);
    return true; // Assume expired if decoding fails
  }
};
