import http from "../http-common";
import httpMulipart from "../http-multipart";
import httpMultipart from "../http-multipart";

class EmployeeDataService {
  searchEmployeeInSchool(pageNumber, maxPageItem, loginStatus, statusEmployeee, idDepartment, employeeNameOrPhone) {
    return http.get(`/employees/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&loginStatus=${loginStatus}&employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&employeeNameOrPhone=${employeeNameOrPhone}`)
  }

  getEmployeeStatus() {
    return http.get(`/employees/employee-status`);
  }

  getAccountType() {
    return http.get(`/common-data/account-type`);
  }

  getEmployeeById(id) {
    return http.get(`/employees/${id}`);
  }
  getEmployeeByIdAndIdSchool(id, idSchool) {
    return http.get(`/employees/school/${id}/?idSchool=${idSchool}`);
  }

  getTabDepartmentInEmployeeService() {
    return http.get(`/employees/tab-department`);
  }
  getTabDepartmentInEmployeeById(idEmployee) {
    return http.get(`/employees/tab-department/${idEmployee}`);
  }
  getTabProfessionalInEmployee() {
    return http.get(`/employees/tab-professional`);
  }
  getTabProfessionalInEmployeeById(idEmployee) {
    return http.get(`/employees/tab-professional/${idEmployee}`);
  }
  getSubjectInClassByIdClass(idClass) {
    return http.get(`/employees/subject-in-class/${idClass}`);
  }
  createTeacher(formData) {
    return http.post("/employees", formData);
  }
  createExcelTeacher(dataList) {
    return http.post("/employees/import-excel-employee-new", dataList);
  }
  uploadAvatar(formData) {
    return httpMulipart.post("/employees/insert-avatar", formData);
  }
  uploadEditAvatar(formData) {
    return httpMulipart.post("/employees/edit-avatar", formData);
  }
  update(id, data) {
    return http.put(`/employees/${id}`, data);
  }
  updateActiveOne(data) {
    return http.put(`/employees/update/active-one`, data);
  }
  updateActiveMany(data) {
    return http.put(`/employees/update/active-many`, data);
  }
  updateActiveManySMS(data) {
    return http.put(`/employees/update/active-many/sms-receive`, data);
  }
  updateActiveOneSMSReceive(data) {
    return http.put(`/employees/update/active-one/sms-receive`, data);
  }
  updateMultiEmployeeActivated(data) {
    return http.put(`/employees/multi-employee-activate`, data);
  }
  updateMultiEmployeeUnActivated(data) {
    return http.put(`/employees/multi-employee-unactivate`, data);
  }
  delete(id) {
    return http.delete(`employees/${id}`);
  }
  deleteMulti(data) {
    return http.put(`/employees/delete-multi`, data)
  }

  findIconTeacherCreate() {
    return http.get(`/employees/icon-teacher-create`);
  }
  // findIconPlusCreate() {
  //   return http.get(`/common-data/icon-plus-create`);
  // }
  //bỏ
  findIconPlusNotifyCreate() {
    return http.get(`/employees/icon-plus-notify-create`);
  }
  findIconTeacherUpdate(id) {
    return http.get(`/employees/icon-teacher-update/${id}`);
  }

  findIconNotifyPlusUpdate(id) {
    return http.get(`/employees/icon-plus-notify-update/${id}`);
  }
  findAllByDepartment(id) {
    return http.post(`/employees/export-excel/${id}`, { responseType: 'blob' });
  }
  //create Notify
  createdNotifyEmployee(data) {
    return httpMultipart.post(`/employees/employee-notify`, data);
  }
  //khoong dung nua
  createdNotifySmsEmployee(data) {
    return http.post(`/schedulesms/employee-sms`, data);
  }

  createdNotifySmsEmployeeNew(data) {
    return http.post(`/employees/employee-sms`, data);
  }
  //gửi sms mới
  createEmployeeSms(data){
    return http.post("/employees/sms", data);
  }

  sendAccountEmployee(data) {
    return http.post(`/employees/sms/account`, data);
  }
  updateEmployeeStatus(data) {
    return http.put("/employees/employee-status", data);
  }
  //Export excel
  exportExcelEmployeeNew(list){
    return http.get(`employees/export-excel/employee-new?list=${list}`)
  }
  exportExcelDepartmentNew(idDepartment){
    return http.get(`employees/export-excel/employee-new?idDepartment=${idDepartment}`)
  }

}

export default new EmployeeDataService();