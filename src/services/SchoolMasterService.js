import http from "../http-common";

class SchoolMasterService {
  searchStudentMaster(pageNumber, maxPageItem, deleteStatus, idAgent, idSchool, status, nameOrPhone) {
    return http.get(`/student-master/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&idAgent=${idAgent}&idSchool=${idSchool}&status=${status}&nameOrPhone=${nameOrPhone}`);
  }
  updateExtra(data) {
    return http.put(`/student-master/extra`, data);
  }
  searchEmployeeMaster(pageNumber, maxPageItem, deleteStatus, idAgent, idSchool, statusEmployeee, employeeNameOrPhone, appType) {
    return http.get(`/employees-master/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&idAgent=${idAgent}&idSchool=${idSchool}&status=${statusEmployeee}&nameOrPhone=${employeeNameOrPhone}&appType=${appType}`)
  }
  updateExtraEmployee(data) {
    return http.put(`/employees-master/extra`, data);
  }
}

export default new SchoolMasterService();