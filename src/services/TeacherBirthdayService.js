import http from "../http-common";

class Teacherbirthday {
    getAll() {
        return http.get("/teacher-birthday");
    }

    getById(id) {
        return http.get(`/teacher-birthday/${id}`);
    }
    searchKidsBirthday(date, week, month, name) {
        return http.get(`/teacher-birthday/searchnew?date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    searchTeacherBirthdayNew(pageNumber, maxPageItem,date, week, month, name) {
        return http.get(`/teacher-birthday/searchnewa?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    update(id, data) {
        return http.put(`/appsend/${id}`, data);
    }
    create(data) {
        return http.post("/appsend", data);
    }
    // updateRead(data) {
    //     return http.put(`/medicine/update-many-read`, data);
    // }
    // updateConfirm(data) {
    //     return http.put(`/medicine/update-many-confirm`, data);
    // }

}

export default new Teacherbirthday();