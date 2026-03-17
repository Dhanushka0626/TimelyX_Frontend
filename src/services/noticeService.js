import API from "../api/axiosClient";

const noticeService = {
  getStudentNotices: async (studentId) => {
    const response = await API.get(`/student/${studentId}/notices`);
    return response.data;
  },
};

export default noticeService;