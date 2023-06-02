import http from "../http-common";
import httpMulipart from "../http-multipart";

class EmployeeMasterService {

  searchAccountUser(idSchool, employeeNameOrPhone) {
    return http.get(`/employees-master/account-user?idSchool=${idSchool}&employeeNameOrPhone=${employeeNameOrPhone}`)
  }
  update(id, data) {
    return http.put(`/employees-master/${id}`, data);
  }
  getEmployeeByIdAndIdSchool(id, idSchool) {
    return http.get(`/employees-master/school/${id}/?idSchool=${idSchool}`);
  }
  uploadEditAvatar(formData) {
    return httpMulipart.post("/employees-master/edit-avatar", formData);
  }
  getAccountType(idSchool) {
    return http.get(`/employees-master/account-type?idSchool=${idSchool}`);
  }
  deleteEmployeeAdmin(id) {
    return http.delete(`/employees-master/${id}`);
  }
  restoreEmployeeAdmin(id) {
    return http.put(`/employees-master/restore/${id}`);
  }
}

export default new EmployeeMasterService();