import http from "../http-common";
import httpMultipart from "../http-multipart";
class Medicine {
    getDetailKidsMethod
    getAll() {
        return http.get("/medicine");
    }

    getById(id) {
        return http.get(`/medicine/${id}`);
    }
    searchMedicine(pageNumber, maxPageItem,date, idGrade, idClass, confirmStatus, dateSick, name) {
        return http.get(`/medicine/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&idGrade=${idGrade}&idClass=${idClass}&confirmStatus=${confirmStatus}&dateSick=${dateSick}&name=${name}`);
    }
    update(id, data) {
        return http.put(`/medicine/${id}`, data);
    }
    updateRead(data) {
        return http.put(`/medicine/update-many-read`, data);
    }
    updateConfirm(data) {
        return http.put(`/medicine/update-many-confirm`, data);
    }
    saveReply(data) {
        return http.put(`/medicine/save/reply`, data);
    }
    confirmParentReply(id) {
        return http.put(`/medicine/confirm/${id}`);
    }
    revokePlus(data) {
        return http.put(`/medicine/revoke/plus`, data);
    }
    revokeTeacher(data) {
        return http.put(`/medicine/revoke/teacher`, data);
    }
    downloadFileAbsent(idUrlFileAppsend){
        return httpMultipart.get(`/medicine/medicinedowload/${idUrlFileAppsend}`);
    }

}

export default new Medicine();