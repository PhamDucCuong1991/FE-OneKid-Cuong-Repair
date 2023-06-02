import http from "../http-common";

class NotificationManageService {
  searchNotification(type, pageNumber, maxPageItem) {
    return http.get(`/notification-manage/search?type=${type}&pageNumber=${pageNumber}&maxPageItem=${maxPageItem}`);
  }
  findByIdDate(id){
    return http.get(`/notification-manage/date-notification/${id}`);
  }
  createDateNotification(data){
    return http.post("/notification-manage/date-notification",data);
  }
  updateDateNotification(data){
    return http.put("/notification-manage/date-notification",data);
  }
  deleteDateNotification(id){
    return http.delete(`/notification-manage/date-notification/${id}`);
  }
  getStatusNotification(data){
    return http.put("/notification-manage/active",data);
  }

  updateNotification(data){
    return http.put("/notification-manage",data);
  }

  //App send
  searchInternalPlus(title, pageNumber, maxPageItem) {
    return http.get(`/internal-notification-plus/search?title=${title}&pageNumber=${pageNumber}&maxPageItem=${maxPageItem}`);
  }
  findByIdInternalPlus(id) {
    return http.get(`/internal-notification-plus/${id}`);
  }
}

export default new NotificationManageService();