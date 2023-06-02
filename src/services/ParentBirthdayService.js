import http from "../http-common";

class ParentBirthday {
    getAll() {
        return http.get("/parent-birthday");
    }

    getById(id) {
        return http.get(`/kids-birthday/${id}`);
    }
    searchKidsBirthday(date, week, month, name) {
        return http.get(`/parent-birthday/searchnew?date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    searchParentBirthdayNew(pageNumber, maxPageItem,date, week, month, name) {
        return http.get(`/parent-birthday/searchnewa?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    update(id, data) {
        return http.put(`/appsend/${id}`, data);
    }
    create(data) {
        return http.post("/appsend/parent", data);
    }
    // updateRead(data) {
    //     return http.put(`/medicine/update-many-read`, data);
    // }
    // updateConfirm(data) {
    //     return http.put(`/medicine/update-many-confirm`, data);
    // }

}

export default new ParentBirthday();