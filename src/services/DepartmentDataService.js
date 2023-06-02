import http from "../http-common";

class DepartmentDataService {
  getAllCommon() {
    return http.get(`/common-data/departments`);
  }
  getDepartment(pageNumber, maxPageItem) {
    return http.get(`departments?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}`);
  }
  // getInfoEmployeeForDepartment() {
  //   return http.get("/departments/infoEmployee");
  // }

  get(id) {
    return http.get(`/departments/${id}`);
  }
  updateTrasferEmployeeDepartment(data) {
    return http.put("/departments/transfer-department", data)
  }
  create(data) {
    return http.post("/departments", data);
  }

  update(id, data) {
    return http.put(`/departments/${id}`, data);
  }

  delete(id) {
    return http.delete(`departments/${id}`);
  }
}

export default new DepartmentDataService();