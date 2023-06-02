import http from "../http-common";


class MaClassService {
    getAllClassCommon() {
        return  http.get("/common-data/class-in-school");
    }
    getClassInGrade(idGrade) {
        return http.get(`/common-data/class-in-grade?idGrade=${idGrade}`);
    }
    getById(id) {
        return http.get(`/class/${id}`);
    }
    searchClassNew(pageNumber, maxPageItem, className) {
        return http.get(`/class/search/new?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&className=${className}`);
    }
    findClassNewById(id) {
        return http.get(`/class/new/${id}`);
    }
    findTeacherInClass(id) {
        return http.get(`/class/teacher/${id}`);
    }
    findEmployeeInClass(id) {
        return http.get(`/class/employee/${id}`);
    }

    create(data) {
        return http.post("/class", data);
    }

    update(id, data) {
        return http.put(`/class/${id}`, data);
    }

    delete(id) {
        return http.delete(`/class/${id}`);
    }
    //export excel
    exportExcelClassNew(status, idClass){
        return http.get(`student/list-by-grade-class-new?status=${status}&idClass=${idClass}`);
    }

}

export default new MaClassService();