import http from "../http-common";
import httpMultipart from "../http-multipart";
import httpDownload from "../http-download";
class ScheduleService {
  getAll() {
    return http.get("/schedules");
  }
  getAllScheduleDetail(timeSchedule,idGrade,idClass) {
    return http.get(`/schedules/all-schedule-detail?timeSchedule=${timeSchedule}&idGrade=${idGrade}&idClass=${idClass}`);
  }
  search(timeSchedule, idGrade, idClass) {
    return http.get(`/schedules?timeSchedule=${timeSchedule}&idGrade=${idGrade}&idClass=${idClass}`);
  }
  searchScheduleInClass(timeSchedule, idClass) {
    return http.get(`/schedules/schedule-in-class?timeSchedule=${timeSchedule}&idClass=${idClass}`);
  }
  searchScheduleInClassWeek(timeSchedule, idClass) {
    return http.get(`/schedules/schedule-in-class-week?timeSchedule=${timeSchedule}&idClass=${idClass}`);
  }
  searchScheduleViewDetail(idClass) {
    return http.get(`/schedules/schedule-view-detail/${idClass}`);
  }
  create(data) {
    return http.post("/schedules/schedule-in-class-week", data);
  }
  createMultiScheduleForClass(data) {
    return http.post("/schedules/multi-schedule", data);
  }
  update(data) {
    return http.post("/schedules/schedule-in-class-week", data);
  }
  updateTitleClass(data){
    return http.post("/schedules/title-class", data);
  }
  get(id) {
    return http.get(`/tutorials/${id}`);
  }
  updateApprove(data) {
    return http.put(`/schedules/approve`, data);
  }
  updateMultiApprove(data) {
    return http.put(`/schedules/multi-approve`, data);
  }
  deleteContentSchedule(data) {
    return http.put(`/schedules/delete-content-schedule`, data);
  }
  deleteScheduleFile(data) {
    return http.put(`/schedules/schedule-file`, data);
  }
  createFileAndPicture(data) {
    return httpMultipart.post("/schedules/file-and-picture", data);
  }
  createFileExcel(data){
    return httpMultipart.post("/schedules/import-schedule-excel",data)
  }
  downloadSchedule(){
    return httpDownload.get("/schedules/download2");
  }
  createFileMultiClassMenu(data) {
    return http.post("/schedules/file-and-picture-multi-class", data);
  }
  //export execl
  getExportExcelSchedule(id, date){
    return http.get(`/schedules/export-schedule-class-new?idClass=${id}&timeSchedule=${date}`);
  }
}

export default new ScheduleService();