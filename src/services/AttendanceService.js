import http from "../http-common";
import httpMultipart from "../http-multipart";

class AttendanceService {
    getAll() {
        return http.get("/grade");
    }
    checkAbsentDate(date, idClass){
        return http.get(`/attendance-kids/check-absent?date=${date}&idClass=${idClass}`);
    }
    getConfigCommonForAttendance() {
        return http.get(`/attendance-kids/config/pickup-kid`);
      }
    searchAll(date, idGrade, idClass, absentStatus) {
        return http.get(`/attendance-kids/search?date=${date}&idGrade=${idGrade}&idClass=${idClass}&absentStatus=${absentStatus}`);
    }
    searchArriveDate(date, idGrade, idClass, absentStatus) {
        return http.get(`/attendance-kids/search/arrive?date=${date}&idGrade=${idGrade}&idClass=${idClass}&absentStatus=${absentStatus}`);
    }
    searchLeaveDate(date, idGrade, idClass, absentStatus) {
        return http.get(`/attendance-kids/search/leave?date=${date}&idGrade=${idGrade}&idClass=${idClass}&absentStatus=${absentStatus}`);
    }
    searchEatDate(date, idGrade, idClass, absentStatus) {
        return http.get(`/attendance-kids/search/eat?date=${date}&idGrade=${idGrade}&idClass=${idClass}&absentStatus=${absentStatus}`);
    }
    getArriveByIdKidOfMonth(idKid, month, year) {
        return http.get(`/attendance-kids/arrive/month/${idKid}?month=${month}&year=${year}`);
    }
    getLeaveByIdKidOfMonth(idKid, month, year) {
        return http.get(`/attendance-kids/leave/month/${idKid}?month=${month}&year=${year}`);
    }
    getEatByIdKidOfMonth(idKid, month, year) {
        return http.get(`/attendance-kids/eat/month/${idKid}?month=${month}&year=${year}`);
    }
    saveArriveOne(id, data) {
        return http.post(`/attendance-kids/arrive/${id}`, data);
    }
    updateArriveContent(id, data) {
        return httpMultipart.post(`/attendance-kids/arrive-content/${id}`, data);
    }
    updateLeaveContent(id, data) {
        return httpMultipart.post(`/attendance-kids/leave-content/${id}`, data);
    }
    saveLeaveOne(id, data) {
        return http.post(`/attendance-kids/leave/${id}`, data);
    }
    saveEatOne(id, data) {
        return http.post(`/attendance-kids/eat/${id}`, data);
    }
    saveArriveMany(data) {
        return http.post(`/attendance-kids/arrive/many`, data);
    }
    saveLeaveMany(data) {
        return http.post(`/attendance-kids/leave/many`, data);
    }
    saveEatMany(data) {
        return http.post(`/attendance-kids/eat/many`, data);
    }
    getCalendarClass(idClass) {
        return http.get(`/attendance-kids/class/dayOff/view/${idClass}`);
    }
    //export excel
    getExportExcelDate(idClass,date){
        return http.get(`/attendance-kids/export-attendance-kid-new?idClass=${idClass}&date=${date}`);
    }
    getExportExcelMonth(idClass,date){
        return http.get(`/attendance-kids/export-attendance-kid-month-new?idClass=${idClass}&date=${date}`);
    }
    getExportExcelCustom(dateStartEnd, idClass, status){
        return http.get(`attendance-kids/export-attendance-kid-custom-new?dateStartEnd=${dateStartEnd}&idClass=${idClass}&status=${status}`);
    }
    getExportExcelMonthDetail(dateStartEnd, idClass, status){
        return http.get(`attendance-kids/export-attendance-kid-custom-detail?dateStartEnd=${dateStartEnd}&idClass=${idClass}&status=${status}`);
    }

    // get(id) {
    //     return http.get(`/tutorials/${id}`);
    // }

    // create(data) {
    //     return http.post("/grade", data);
    // }

    // update(id, data) {
    //     return http.put(`/grade/${id}`, data);
    // }

    // delete(id) {
    //     return http.delete(`/grade/${id}`);
    // }

    // deleteAll() {
    //     return http.delete(`/tutorials`);
    // }

    // findByTitle(title) {
    //     return http.get(`/tutorials?title=${title}`);
    // }
}

export default new AttendanceService();