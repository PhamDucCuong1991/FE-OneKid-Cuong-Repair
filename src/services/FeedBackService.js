import http from "../http-common";

class FeedBackService {
  getAll() {
    return http.get("/feedbackpr");
  }

  getById(id) {
    return http.get(`/feedbackpr/${id}`);
  }
  searchFeedBack(pageNumber, maxPageItem,hiddenStatus,schoolUnread, dateStartEnd, feedbackTitle) {
    return http.get(`/feedbackpr/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}`);
  }
    // searchMessageParent(pageNumber, maxPageItem,date, idGrade, idClass,confirmStatus,name) {
    //     return http.get(`/message/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&idGrade=${idGrade}&idClass=${idClass}&confirmStatus=${confirmStatus}&name=${name}`);
    // }
   
  searchSchedule(hiddenStatus, schoolUnread, dateStartEnd, feedbackTitle) {
    return http.get(`/schedulesms/search?hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}`);
  }
  update(id, data) {
    return http.put(`/feedbackpr/${id}`, data);
  }
  updateRead(data) {
    return http.put(`/feedbackpr/update-many-read`, data);
  }

}
export default new FeedBackService();