import http from "../http-common";
import httpMultipart from "../http-multipart";
import httpDownload from "../http-download";


class GradeService {
    getAll() {
        return http.get("/grade");
    }
    getKidDate(id) {
        return http.get(`/evaluate-kids/date/${id}`);
    }
    getSampleDate() {
        return http.get(`/evaluate-kids/sample-date`);
    }
    searchDate(date, idGrade, idClass, approved) {
        return http.get(`/evaluate-kids/search?date=${date}&idGrade=${idGrade}&idClass=${idClass}&approved=${approved}`);
    }
    searchDetailDate(date, idGrade, idClass, approved) {
        return http.get(`/evaluate-kids/search-detail-date?date=${date}&idGrade=${idGrade}&idClass=${idClass}&approved=${approved}`);
    }
    searchEvaluateWeek(date, idGrade, idClass, approved) {
        return http.get(`/evaluate-kids/search-week?date=${date}&idGrade=${idGrade}&idClass=${idClass}&approved=${approved}`);
    }
    searchEvaluateWeekById(id) {
        return http.get(`/evaluate-kids/search-week/${id}`);
    }
    searchEvaluateMonth(date, idGrade, idClass, approved) {
        return http.get(`/evaluate-kids/search-month?date=${date}&idGrade=${idGrade}&idClass=${idClass}&approved=${approved}`);
    }
    searchEvaluateMonthById(id) {
        return http.get(`/evaluate-kids/search-month/${id}`);
    }
    searchEvaluatePeriodic(idGrade, idClass, approved) {
        return http.get(`/evaluate-kids/search-periodic?idGrade=${idGrade}&idClass=${idClass}&approved=${approved}`);
    }
    searchEvaluatePeriodicKidsClass(idClass) {
        return http.get(`/evaluate-kids/search-kids-class?&idClass=${idClass}`);
    }
    searchEvaluateWeekDateAndKid(date, idKid) {
        return http.get(`/evaluate-kids/search-week-date?date=${date}&idKid=${idKid}`);
    }
    searchEvaluateMonthDateAndKid(date, idKid) {
        return http.get(`/evaluate-kids/search-month-date?date=${date}&idKid=${idKid}`);
    }
    searchEvaluatePeriodicDetail(id) {
        return http.get(`/evaluate-kids/search-periodic-detail/${id}`);
    }
    saveOnekidDate(data) {
        return httpMultipart.post(`/evaluate-kids/onekid-date`, data);
    }
    saveOnekidDetailDate(data) {
        return httpMultipart.post(`/evaluate-kids/onekid-detail-date`, data);
    }
    saveManykidDetailDateCommon(data) {
        return httpMultipart.post(`/evaluate-kids/manykids-detail-common`, data);
    }
    // saveEvaluateWeekOne(data) {
    //     return http.put(`/evaluate-kids/save-week-one`, data);
    // }
    // saveEvaluateMonthOne(data) {
    //     return http.put(`/evaluate-kids/save-month-one`, data);
    // }
    // saveEvaluatePeriodicOne(data) {
    //     return http.put(`/evaluate-kids/save-periodic-one`, data);
    // }
    createEvaluatePeriodicOne(id, data) {
        return httpMultipart.post(`/evaluate-kids/periodic/create/${id}`, data);
    }
    createEvaluatePeriodicMany(data) {
        return httpMultipart.post(`/evaluate-kids/periodic/create`, data);
    }
    // saveEvaluateWeekMany(data) {
    //     return http.put(`/evaluate-kids/save-week-many`, data);
    // }
    // saveEvaluateMonthMany(data) {
    //     return http.put(`/evaluate-kids/save-month-many`, data);
    // }
    // saveEvaluatePeriodicMany(data) {
    //     return http.put(`/evaluate-kids/save-periodic-many`, data);
    // }
    saveEvaluateWeekDetail(data) {
        return httpMultipart.post(`/evaluate-kids/save-week-detail`, data);
    }
    saveEvaluateWeekCommon(data) {
        return httpMultipart.post(`/evaluate-kids/save-week-common`, data);
    }
    saveEvaluateMonthDetail(data) {
        return httpMultipart.post(`/evaluate-kids/save-month-detail`, data);
    }
    saveEvaluateMonthCommon(data) {
        return httpMultipart.post(`/evaluate-kids/save-month-common`, data);
    }
    saveEvaluatePeriodicDetail(data) {
        return httpMultipart.post(`/evaluate-kids/save-periodic-detail`, data);
    }
    updateApprovedOnekidsDate(data) {
        return http.put(`/evaluate-kids/approved-onekids-date`, data);
    }
    updateApprovedManykidsDate(data) {
        return http.put(`/evaluate-kids/approved-manykids-date`, data);
    }
    updateApprovedWeekOne(data) {
        return http.put(`/evaluate-kids/approved-week-one`, data);
    }
    updateApprovedMonthOne(data) {
        return http.put(`/evaluate-kids/approved-month-one`, data);
    }
    updateApprovedPeriodicOne(data) {
        return http.put(`/evaluate-kids/approved-periodic-one`, data);
    }
    updateApprovedWeekMany(data) {
        return http.put(`/evaluate-kids/approved-week-many`, data);
    }
    updateApprovedMonthMany(data) {
        return http.put(`/evaluate-kids/approved-month-many`, data);
    }
    downloadFileDate(id){
        return httpDownload.get(`/evaluate-kids/download-date/${id}`);
    }
    downloadFileWeek(id){
        return httpDownload.get(`/evaluate-kids/download-week/${id}`);
    }
    downloadFileMonth(id){
        return httpDownload.get(`/evaluate-kids/download-month/${id}`);
    }
    downloadFilePeriodic(id){
        return httpDownload.get(`/evaluate-kids/download-periodic/${id}`);
    }
    //Export excel
    getExportExcelDate(idClass, date){
        return http.get(`/evaluate-kids/evaluate-to-excel-date-new?idClass=${idClass}&date=${date}`)
    }
    getExportExcelMonth(idClass, date){
        return http.get(`/evaluate-kids/evaluate-to-excel-month-new?idClass=${idClass}&date=${date}`)
    }

}

export default new GradeService();