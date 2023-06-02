import http from "../http-common";

class KidsBirhtdayService {
    getDetailKidsMethod
    getAll() {
        return http.get("/kids-birthday");
    }
    getById(id) {
        return http.get(`/kids-birthday/${id}`);
    }
    searchKidsBirthday(date, week, month, name) {
        return http.get(`/kids-birthday/search?date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    searchKidsBirthdayNew(pageNumber, maxPageItem,date, week, month, name) {
        return http.get(`/kids-birthday/searchnew?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&date=${date}&week=${week}&month=${month}&name=${name}`);
    }
    update(id, data) {
        return http.put(`/appsend/${id}`, data);
    }
    createBirthdayKids(data) {
        return http.post("/kids-birthday/kids", data);
    }
    createparent(data) {
        return http.post("/parent-birthday/parentreal", data);
    }
    createteacher(data) {
        return http.post("/teacher-birthday/teacher", data);
    }
    delete(id) {
        return http.delete(`/appsend/${id}`);
      }

    searchWish(){
        return http.get(`/wish/search`);
    }

    searchWishParent(){
        return http.get(`/wish/searchforparent`);
    }
    searchWishTeacher(){
        return http.get(`/wish/searchforteacher`);
    }
    // updateRead(data) {
    //     return http.put(`/medicine/update-many-read`, data);
    // }
    // updateConfirm(data) {
    //     return http.put(`/medicine/update-many-confirm`, data);
    // }

}

export default new KidsBirhtdayService();