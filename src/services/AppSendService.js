import http from "../http-common";
import httpMultipart from "../http-multipart";
class AppSendService {
  getAll() {
    return http.get("/appsend");
  }

  getById(id) {
    return http.get(`/appsend/${id}`);
  }
  getById2(id) {
    return http.get(`/appsend/a/${id}`);
  }
  searchAppSend(pageNumber, maxPageItem,userUnread, dateStartEnd, sendContent) {
    return http.get(`/appsend/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&userUnread=${userUnread}&dateStartEnd=${dateStartEnd}&sendContent=${sendContent}`);
  }

  updateRead(data) {
    return http.put(`/appsend/update-many-read`, data);
  }
  updateappovedmsmsapp(data) {
    return http.put(`/update-many-approved-smsapp`, data);
  }
  deleteAppSendById(id) {
    return http.delete(`/appsend/${id}`)
  }

  //Tùng
  createAppSendNotify(data) {
    return httpMultipart.post(`/appsend-notify`, data);
  }
  delateAppSendNotifyById(data) {
    return http.put(`/appsend-notify/multi`, data);
  }
  updateAppSendNotify(data) {
    return httpMultipart.post(`/appsend-notify/edit`, data);
  }
  // getAllAppSendNotify(appType, title, dateSick) {
  //   return http.get(`/appsend-notify?appType=${appType}&title=${title}&dateSick=${dateSick}`)
  // }
  getAllAppSendNotifyAdmin(pageNumber, maxPageItem, idAgent, idSchool, sendType, title) {
    return http.get(`/appsend-notify/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idAgent=${idAgent}&idSchool=${idSchool}&sendType=${sendType}&title=${title}`)
  }

  getReceiversNotifyByIdUser(idAppSend) {
    return http.get(`/receivers-notify?idAppSend=${idAppSend}`)
  }
  deleteReceiversNotifyById(id) {
    return http.delete(`/receivers-notify/${id}`)
  }
  updateRevokeReceiversNotifyById(id) {
    return http.put(`/receivers-notify/${id}`)
  }

  updateApprovedReceiversNotifyById(id) {
    return http.put(`/receivers-notify/approved/${id}`)
  }

  updateMultiRevokeReceiversNotifyByMultiId(data) {
    return http.put(`/receivers-notify/`, data)
  }
  updateMultiRevokeReceiversNotifyByMultiIdShow(data) {
    return http.put(`/receivers-notify/update-multi-revoke`, data)
  }
  deleteMultiReceiversNotifyByMutiId(data) {
    return http.put(`/receivers-notify/multi`, data)
  }
}
export default new AppSendService();