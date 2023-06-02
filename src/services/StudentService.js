import http from "../http-common";
import httpMultipart from "../http-multipart";

class StudentService {
    getAll() {
        return http.get("/student");
    }
    getIdExtra(id) {
        return http.get(`/student/extra/${id}`);
    }
    getKidsExtraInfo(id) {
        return http.get(`/student/extra-info/${id}`);
    }
    getKidStatus() {
        return http.get(`/student/kid-status`);
    }
    searchKids(pageNumber, maxPageItem, loginStatus, status, idGrade, idClass, nameOrPhone, type, dateList) {
        return http.get(`/student/search/new?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&loginStatus=${loginStatus}&status=${status}&idGrade=${idGrade}&idClass=${idClass}&nameOrPhone=${nameOrPhone}&type=${type}&dateList=${dateList}`);
    }
    searchKidsTransfer(pageNumber, maxPageItem, status, idGrade, idClass, nameOrPhone) {
        return http.get(`/student/transfer/search/?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&status=${status}&idGrade=${idGrade}&idClass=${idClass}&nameOrPhone=${nameOrPhone}`);
    }
    kidsTransferByIdKid(idKid) {
        return http.get(`/student/transfer?idKid=${idKid}`);
    }
    kidsTransferCreateUpdate(data) {
        let id = data.get("id");
        if (id == "") {
            return http.post("/student/transfer", data);
        } else {
            return http.put("/student/transfer", data);
        }
    }
    kidsTransferInSatusService(id, status) {
        return http.put(`/student/transfer/in/${id}?status=${status}`);
    }
    kidsTransferOutSatusService(id, status) {
        return http.put(`/student/transfer/out/${id}?status=${status}`);
    }
    kidsTransferDeleteById(id) {
        return http.delete(`/student/transfer?id=${id}`);
    }
    kidsTransferDeleteByIdKidList(idKidList) {
        return http.delete(`/student/transfer/kids?idKidList=${idKidList}`);
    }
    searchAccountKids(idSchool, nameOrPhone) {
        return http.get(`/student/search?&idSchool=${idSchool}&nameOrPhone=${nameOrPhone}`);
    }
    create(data) {
        return http.post("/student", data);
    }
    createAvatar(data) {
        return httpMultipart.post("/student/avatar", data);
    }
    update(id, data) {
        return http.put(`/grade/${id}`, data);
    }
    updateExtra(id, data) {
        return http.put(`/student/extra/${id}`, data);
    }
    updateExtraAdmin(id, data) {
        return http.put(`/student/extra/admin/${id}`, data);
    }
    updateOneActive(data) {
        return http.put(`/student/one-actived`, data);
    }
    updateOneActiveSMS(data) {
        return http.put(`/student/one-actived-sms`, data);
    }
    delete(id) {
        return http.delete(`/student/${id}`);
    }
    findIconParentCreate() {
        return http.get(`/student/icon-parent-create`);
    }
    findIconParentUpdate(id) {
        return http.get(`/student/icon-parent-update/${id}`);
    }

    // cac thao tac lien quan den dropdow
    updateManyActive(data) {
        return http.put(`/student/action/many-actived`, data);
    }
    updateManyCancelActive(data) {
        return http.put(`/student/action/many-cancel-actived`, data);
    }
    updateManyActiveSMS(data) {
        return http.put(`/student/action/many-actived-sms`, data);
    }
    updateManyCancelActiveSMS(data) {
        return http.put(`/student/action/many-cancel-actived-sms`, data);
    }
    changeClass(data) {
        return http.put(`/student/action/change-class`, data);
    }
    deleteManyKids(data) {
        return http.put(`/student/action/delete-many-kids`, data);
    }
    //create Notify
    createdNotifyStudent(data) {
        return httpMultipart.post(`/student/student-notify`, data);
    }
    // createdNotifyStudentSms(data) {
    //     return http.post("/student/student-sms", data);
    // }
    //sms
    createStudentSms(data) {
        return http.post("/student/sms", data);
    }
    sendAccountStudent(data) {
        return http.post("/student/sms/account", data);
    }
    convertSms(data) {
        return http.post("/schedulesms/convert-sms", data);
    }
    findTitleSms() {
        return http.get("/schedulesms/student-sms-title");
    }
    updateKidsStatus(data) {
        return http.put("/student/kids-status", data);
    }
    //exportExcel
    exportExcelStudentNew(idKidsList) {
        return http.get(`/student/list-by-grade-class-new?idKidsList=${idKidsList}`);
    }
    exportExcelMessageParent(idList) {
        return http.get(`/student/action/export/message-parent?idList=${idList}`);
    }
    exportExcelMedicine(idList) {
        return http.get(`/student/action/export/message-medicine?idList=${idList}`);
    }
    exportExcelMedicineDate(idList, date, idClass) {
        return http.get(`/student/action/export/message-medicine-date?idList=${idList}&date=${date}&idClass=${idClass}`);
    }
    exportExcelAbsentLetter(idList) {
        return http.get(`/student/action/export/message-absent?idList=${idList}`);
    }
    exportExcelSMS(idList) {
        return http.get(`/student/action/export/excel-sms?idList=${idList}`);
    }
    //importExcel
    createStudentExcel(dataList) {
        return http.post("/student/import-excel-kid-new", dataList);
    }
    getAllClassCommonNew() {
        return http.get("/student/class-grade-name");
    }

}

export default new StudentService();