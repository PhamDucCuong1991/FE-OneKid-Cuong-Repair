import http from "../http-common";

class KidsGroupService {
  getAll(pageNumber, maxPageItem) {
    return http.get(`/student-group?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}`);
  }
  getAllKidsInGroup() {
    return http.get(`/student-group/add`);
  }
  getById(id) {
    return http.get(`/student-group/${id}`);
  }

  create(data) {
    return http.post("/student-group", data);
  }

  update(id, data) {
    return http.put(`/student-group/${id}`, data);
  }
  updateTransferGroup(data) {
    return http.put(`/student-group/transfer-group/`, data);
  }

  delete(id) {
    return http.delete(`/student-group/${id}`);
  }
  //export excel
  exportExcelGroupNew(id){
    return http.get(`/student/list-by-grade-class-new?idGroup=${id}`);
}
}

export default new KidsGroupService();