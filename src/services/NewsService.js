import http from "../http-common";

class NewsService {
  getAllNews(title) {
    return http.get(`/news-onekids?title=${title}`);
  }
  get(id) {
    return http.get(`/tutorials/${id}`);
  }

  createNews(data) {
    return http.post("/news-onekids", data);
  }

  updateNews(data) {
    return http.put(`/news-onekids`, data);
  }

  deleteNews(id) {
    return http.delete(`/news-onekids/${id}`);
  }

  deleteMultiNews(data) {
    return http.put(`/news-onekids/delete-multi`,data);
  }

}

export default new NewsService();