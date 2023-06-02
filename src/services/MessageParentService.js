import http from "../http-common";
class MessageParent {
    getDetailKidsMethod
    getAll() {
        return http.get("/message");
    }
    getById(id) {
        return http.get(`/message/${id}`);
    }
    searchMessageParent(pageNumber, maxPageItem,date, idGrade, idClass,confirmStatus,name) {
        return http.get(`/message/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&idGrade=${idGrade}&idClass=${idClass}&confirmStatus=${confirmStatus}&name=${name}`);
    }
   
    update(id, data) {
        return http.put(`/message/${id}`, data);
    }
    updateRead(data) {
        return http.put(`/message/update-many-read`, data);
    }
    updateConfirm(data) {
        return http.put(`/message/update-many-confirm`, data);
    }
    saveReply(data) {
        return http.put(`/message/save/reply`, data);
    }
    confirmParentReply(id) {
        return http.put(`/message/confirm/${id}`);
    }
    revokePlus(data) {
        return http.put(`/message/revoke/plus`, data);
    }
    revokeTeacher(data) {
        return http.put(`/message/revoke/teacher`, data);
    }
    

}

export default new MessageParent();