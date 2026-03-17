import API from "../api/axiosClient";

const timetableService = {
  getStudentTimetable: async (studentId) => {
    const response = await API.get(`/student/${studentId}/timetable`);
    return response.data;
  },
};

export default timetableService;