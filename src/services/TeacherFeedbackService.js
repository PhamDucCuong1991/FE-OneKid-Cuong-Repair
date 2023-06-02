import http from "../http-common";

class TeacherFeedbackService {
  getAll() {
    return http.get("/feedbacktc");
  }

  getById(id) {
    return http.get(`/feedbacktc/${id}`);
  }
  // searchFeedBack(hiddenStatus, schoolUnread, dateStartEnd, feedbackTitle) {
  //   return http.get(`/feedbacktc/search?hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}`);
  // }
  searchFeedBack(pageNumber, maxPageItem, hiddenStatus, schoolUnread, dateStartEnd, feedbackTitle) {
    return http.get(`/feedbacktc/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}`);
  }
  update(id, data) {
    return http.put(`/feedbacktc/${id}`, data);
  }
  updateRead(data) {
    return http.put(`/feedbacktc/update-many-read`, data);
  }
}
export default new TeacherFeedbackService();