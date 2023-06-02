import http from "../http-common";
import httpMultipart from "../http-multipart";
class AppSendService {
  getAll() {
    return http.get("/appsend");
  }

  getById(id) {
    return http.get(`/appsend/${id}`);
  }
  getByIdSent(id) {
    return http.get(`/smsreiceive/${id}`);
  }
  searchAppSend(userUnread, dateStartEnd, sendContent) {
    return http.get(`/appsend/search?userUnread=${userUnread}&dateStartEnd=${dateStartEnd}&sendContent=${sendContent}`);
  }
  updateRead(data) {
    return http.put(`/appsend/update-many-read`, data);
  }
  deleteAppSendById(id){
    return http.delete(`/appsend/${id}`)
  }

  //Tùng
  createAppSendNotify(data) {
    return httpMultipart.post(`/appsend-notify`, data);
  }
  delateAppSendNotifyById(id) {
    return http.delete(`/appsend-notify/${id}`, );
  }
  updateAppSendNotify(data) {
    return httpMultipart.post(`/appsend-notify/edit`, data);
  }
  getAllAppSendNotify(appType,title){
    return http.get(`/appsend-notify?appType=${appType}&title=${title}`)
  }

  getReceiversNotifyByIdUser(idAppSend){
    return http.get(`/receivers-notify?idAppSend=${idAppSend}`)
  }
  deleteReceiversNotifyById(id){
    return http.delete(`/receivers-notify/${id}`)
  }
  updateRevokeReceiversNotifyById(id){
    return http.put(`/receivers-notify/${id}`)
  }
  updateMultiRevokeReceiversNotifyByMultiId(data){
    return http.put(`/receivers-notify/`,data)
  }
  deleteMultiReceiversNotifyByMutiId(data){
    return http.put(`/receivers-notify/multi`,data)
  }
}
export default new AppSendService();