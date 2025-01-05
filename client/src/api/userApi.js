import axios from "axios";

const API_URL = "http://localhost:3000/user";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const signup = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const login = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getFriends = async () => {
  try {
    const response = await api.get("/friends");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await api.get("/friendRequests");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const response = await api.post(`/sendFriendRequest/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const acceptFriendRequest = async (userId) => {
  try {
    const response = await api.post(`/acceptFriendRequest/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteFriendRequest = async (userId) => {
  try {
    const response = await api.delete(`/deleteFriendRequest/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

const handleError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.message || "An error occurred.";
  }
  return "Network error. Please try again.";
};
