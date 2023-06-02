import http from "../http-common";

class MessageParent {
    getDetailKidsMethod
    getAll() {
        return http.get("/absent-letter");
    }
    getByIdAbsentDate(id) {
        return http.get(`/absent-letter/date/${id}`);
    }

    getById(id) {
        return http.get(`/absent-letter/${id}`);
    }
    getById1(id) {
        return http.get(`/absent-date/${id}`);
    }
    searchMessageParent(pageNumber, maxPageItem,date, idGrade, idClass,confirmStatus,dateSick,name) {
        return http.get(`/absent-letter/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&idGrade=${idGrade}&idClass=${idClass}&confirmStatus=${confirmStatus}&dateSick=${dateSick}&name=${name}`);
    }

    saveReply(data) {
        return http.put(`/absent-letter/save/reply`, data);
    }

    confirmParentReply(id) {
        return http.put(`/absent-letter/confirm/${id}`);
    }

    revokePlus(data) {
        return http.put(`/absent-letter/revoke/plus`, data);
    }

    revokeTeacher(data) {
        return http.put(`/absent-letter/revoke/teacher`, data);
    }
    
    updateRead(data) {
        return http.put(`/absent-letter/update-many-read`, data);
    }

    updateConfirm(data) {
        return http.put(`/absent-letter/update-many-confirm`, data);
    }


}

export default new MessageParent();