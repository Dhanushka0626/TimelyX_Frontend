import API from "../api/axiosClient"; 

const bookingService = {
  getTodayClasses: async (studentId) => {
    const response = await API.get(`/student/${studentId}/today`);
    return response.data;
  },

  getWeekClasses: async (studentId) => {
    const response = await API.get(`/student/${studentId}/week`);
    return response.data;
  },
};

export default bookingService;