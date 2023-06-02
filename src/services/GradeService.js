import http from "../http-common";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

class GradeService {

  getGradeInPrinciple() {
    return  http.get("/common-data/grade-in-school")
  }
  getAll(pageNumber, maxPageItem) {
    return http.get(`/grade?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}`);
  }
  get(id) {
    return http.get(`/tutorials/${id}`);
  }

  create(data) {
    return http.post("/grade", data);
  }

  update(id, data) {
    return http.put(`/grade/${id}`, data);
  }

  delete(id) {
    return http.delete(`/grade/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
  //export excel
  exportExcelGradeNew(status, idGrade){
    return http.get(`student/list-by-grade-class-new?status=${status}&idGrade=${idGrade}`);
  }
}

export default new GradeService();