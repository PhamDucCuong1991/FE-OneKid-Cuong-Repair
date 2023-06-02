import http from "../http-common";

class NewsExtraService {
  getAllNewsExtra() {
    return http.get("/news-extra-onekids/");
  }

  createNewsExtra(data) {
    return http.post("/news-extra-onekids", data);
  }

  updateNewsExtra(data) {
    return http.put(`/news-extra-onekids`, data);
  }

  deleteNewsExtra(id) {
    return http.delete(`/news-extra-onekids/${id}`);
  }

  deleteMultiNewsExtra(data) {
    return http.put(`/news-extra-onekids/delete-multi`,data);
  }

}

export default new NewsExtraService();