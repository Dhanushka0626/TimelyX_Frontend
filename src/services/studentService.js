import API from "../api/axiosClient";

// Use authenticated /users/me endpoints for profile operations so the
// frontend doesn't need to know the internal user id.
const studentService = {
  getProfile: async () => {
    const response = await API.get(`/users/me`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await API.put(`/users/me`, data);
    return response.data;
  },
};

export default studentService;