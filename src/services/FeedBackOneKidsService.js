import http from "../http-common";
import httpMultipart from "../http-multipart";
class FeedBackOneKidsService {
  searchFeedBackOneKids(pageNumber, maxPageItem, deleteStatus, idAgent, idSchool, accountType) {
    return http.get(`feedback-onekids/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&idAgent=${idAgent}&idSchool=${idSchool}&accountType=${accountType}`);
  }
  viewDetailFeedbackAdmin(id){
    return http.get(`feedback-onekids/view/${id}`)
  }

  get(id) {
    return http.get(`/subjects/${id}`);
  }

  createFeedBackOnekids(data) {
    return httpMultipart.post("/feedback-onekids", data);
  }

  update(id, data) {
    return http.put(`/subjects/${id}`, data);
  }

  deleteFeedBackById(id) {
    return http.delete(`feedback-onekids/${id}`);
  }
  deleteMultiFeedBackById(data) {
    return http.put(`/feedback-onekids`, data);
  }
}

export default new FeedBackOneKidsService();