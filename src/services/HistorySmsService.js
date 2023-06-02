import http from "../http-common";
import httpMultipart from "../http-multipart";
class HistoryService {
  getAllHistorySms(idSchool, appType, fromTimeSend, toTimeSend, typeSend) {
    return http.get(`history-sms?idSchool=${idSchool}&appType=${appType}&fromTimeSend=${fromTimeSend}&toTimeSend=${toTimeSend}&typeSend=${typeSend}`);
  }
  getAllSchool() {
    return http.get(`/history-sms/school/search`);
  }
  getHistorySmsById(id) {
    return http.get(`/history-sms/${id}`);
  }
  getById(id) {
    return http.get(`/schedulesms/${id}`);
  }
  getByIdSmsApp(id) {
    return http.get(`/smsapp/${id}`);
  }
  getByIdSmsAppSend(id) {
    return http.get(`/historysmssend/detail/${id}`);
  }
  getByIdSmscustom(id) {
    return http.get(`/smscustom/detail/${id}`);
  }
  getByIdSmsAppSendFail(id) {
    return http.get(`/historysmssend/fail/${id}`);
  }
  getByIdSmsCustomFail(id) {
    return http.get(`/smscustom/fail/${id}`);
  }
  getByIdSmsAppSendAll(id) {
    return http.get(`/historysmssend/detailall/${id}`);
  }
  getByIdSmsCustomAll(id) {
    return http.get(`/smscustom/detailall/${id}`);
  }
  downloadFileAbsent(idUrlFileAppsend){
    return httpMultipart.get(`/appsend/appsendowloadBirthday/${idUrlFileAppsend}`);
}
  getViewContent(id) {
    return http.get(`/historysmssend/viewContent/${id}`);
  }
  getByIdSmsSchedule(id) {
    return http.get(`/schedulesms/${id}`);
  }
  getByIdSent(id) {
    return http.get(`/smsreiceive/${id}`);
  }
  create(data) {
    return http.post("/subjects", data);
  }
  update(id) {
    return http.put(`/smsapp/${id}`);
  }
  updateApprove(id) {
    return http.put(`/appsend/approved/${id}`);
  }

  updateRevokehis(id) {
    return http.put(`/appsend/revoke/${id}`);
  }
  updateUnRevokehis(id) {
    return http.put(`/appsend/unrevoke/${id}`);
  }
  updateRead(data) {
    return http.put(`/smsapp/update-many-approved`, data);
  }
  updateAppove(data) {
    return http.put(`/smsapp/update-many-confirm`, data);
  }
  updaterevoke(id, data) {
    return http.put(`/smsapp/a/${id}`, data);
  }
  updaterevokeun(id, data) {
    return http.put(`/smsapp/b/${id}`, data);
  }

  updateuserapproved(id, data) {
    return http.put(`/reiceivers/${id}`, data);
  }
  updateuserrevoke(id, data) {
    return http.put(`/reiceivers/a/${id}`, data);
  }
  updateuserrevokeun(id, data) {
    return http.put(`/reiceivers/b/${id}`, data);
  }
  deleteSmsuser(id) {
    return http.delete(`reiceivers/${id}`);
  }
  delete(id) {
    return http.delete(`schedulesms/${id}`);
  }
  //  duyệt many
  updateManyApproved(data) {
    return http.put(`/reiceivers/update-many-approved`, data);
  }

  searchSmsSendHistory(pageNumber, maxPageItem,dateStartEnd) {
    return http.get(`/historysmssend/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}`);
}
exportExcelSmsService(idList) {
  return http.get(`/historysmssend/export/excel?idList=${idList}`);
}
searchSmsCustom(pageNumber, maxPageItem,dateStartEnd) {
  return http.get(`/smscustom/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}`);
}
  deleteSmsReiceivers(id) {
    return http.delete(`/smsreiceive/${id}`);
  }
  searchSmsapp(hiddenStatus, schoolUnread, dateStartEnd, feedbackTitle) {
    return http.get(`/smssendhistory/search?hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}`);
  }
  searchSmsappsys(pageNumber, maxPageItem, dateStartEnd, dateSick, receiverType, title) {
    return http.get(`/smsapp/searchforsysnew?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}&dateSick=${dateSick}&receiverType=${receiverType}&title=${title}`);
  }
  searchSmstc(pageNumber, maxPageItem, dateStartEnd, dateSick,title) {
    return http.get(`/smsapp/searchforteachernew?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}&dateSick=${dateSick}&title=${title}`);
  }
  searchSmsappteacher(hiddenStatus, schoolUnread, dateStartEnd, feedbackTitle,dateSick) {
    return http.get(`/smsapp/searchforteacher?hiddenStatus=${hiddenStatus}&schoolUnread=${schoolUnread}&dateStartEnd=${dateStartEnd}&feedbackTitle=${feedbackTitle}&dateSick=${dateSick}`);
  }
  deleteappsend(id) {
    return http.delete(`/smsapp/${id}`);
  }
  deleteMulti(data) {
    return http.delete(`/smsreiceive/delete-multi`, data)
  }
  deleteSmsAppNotSetDelactive(id) {
    return http.delete(`/smsapp/a/${id}`);
  }
}

export default new HistoryService();