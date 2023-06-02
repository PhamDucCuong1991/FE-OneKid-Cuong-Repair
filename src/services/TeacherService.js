import http from "../http-common";

class TeacherService {
  getClassInTeacher() {
    return http.get(`/teacher/class`);
  }
}
export default new TeacherService();