import http from "../http-common";
class AbsentTeacherService{

    getByIdAbsentDateTeacher(id) {
        return http.get(`/absent-date-teacher/${id}`);
    }

    getByIdTeacher(id) {
        return http.get(`/absent-teacher/${id}`);
    }

    searchMessageTeacher(pageNumber, maxPageItem, createdDate, confirmStatus, date, content) {
        return http.get(`/absent-teacher/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&createdDate=${createdDate}&confirmStatus=${confirmStatus}&date=${date}&content=${content}`);
    }

    saveReplyTeacher(data) {
        return http.put(`/absent-teacher/save/reply`, data);
    }

    revokePlusTeacher(data) {
        return http.put(`/absent-teacher/revoke/plus`, data);
    }

    confirmTeacherReply(id) {
        return http.put(`/absent-teacher/confirm/${id}`);
    }

    updateReadOfTeacher(data) {
        return http.put(`/absent-teacher/read/many`, data);
    }

    updateConfirmOfTeacher(data) {
        return http.put(`/absent-teacher/confirm/many`, data);
    }
}
export default new AbsentTeacherService();