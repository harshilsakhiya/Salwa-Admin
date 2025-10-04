import axios from "axios";

const successHandler = (res: { data: { data: any } }, data = false) => {
  const responseData = data ? res : res?.data?.data ? res.data.data : res.data;

  return {
    success: true,
    data: responseData,
  };
};

const errorHandler = (err: { response: any; request?: any }) => {
  const { request, response } = err;
  if (response) {
    const { message, status } = response.data;

    if (err.response.status === 401 || status === 401) {
      localStorage.clear();
      return;
    }

    return {
      message: err?.response?.data ?? message ?? "something went wrong",
      success: false,
    };
  } else if (request) {
    //request sent but no response received
    return {
      message: "server time out",
      success: false,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: "opps! something went wrong while setting up request",
      success: false,
    };
  }
};

// Function to refresh token

// Error handler with token refresh logic
// const errorHandler = async (err) => {
//   const { request, response } = err;

//   if (response) {
//     const { message, status } = response.data;

//     if (err.response.status === 401 || status === 401) {
//       const originalRequest = err.config;

//       // Try refreshing the token
//       const newAccessToken = await refreshToken();

//       if (newAccessToken) {
//         // Set the new access token in the headers
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//         // Retry the original request with new token
//         return axios(originalRequest);
//       }
//       // else {
//       //   // Token refresh failed, clear storage and handle as needed
//       //   localStorage.clear();
//       //   return {
//       //     message: "Session expired. Please log in again.",
//       //     success: false,
//       //   };
//       // }
//     }

//     return {
//       message: err?.response?.data ?? message ?? "something went wrong",
//       success: false,
//     };
//   } else if (request) {
//     // Request sent but no response received
//     return {
//       message: "server time out",
//       success: false,
//     };
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     return {
//       message: "opps! something went wrong while setting up request",
//       success: false,
//     };
//   }
// };

// Axios interceptor to catch errors and apply the error handler
axios.interceptors.response.use(
  (response) => response,
  (error) => errorHandler(error)
);

export { successHandler, errorHandler };
