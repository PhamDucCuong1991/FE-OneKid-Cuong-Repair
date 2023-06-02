import http from "../http-common";
import httpMultipart from "../http-multipart";
class SupperPlusService {
  searchEmployeeInSchoolPlus(pageNumber, maxPageItem, deleteStatus, statusEmployeee, idDepartment, employeeNameOrPhone) {
    return http.get(`/supperPlus/plus/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&employeeNameOrPhone=${employeeNameOrPhone}`)
  }
  createPlus(formData) {
    return http.post("/supperPlus/plus/create", formData);
  }
  updatePlus(id, data) {
    return http.put(`/supperPlus/plus/update/${id}`, data);
  }
  deletePlusById(id) {
    return http.delete(`/supperPlus/plus/${id}`);
  }
  getPlusById(id) {
    return http.get(`/supperPlus/plus/${id}`);
  }
  findIconPlusCreate() {
    return http.get(`/supperPlus/plus/icon-plus-create`);
  }
  findIconPlusUpdate(id) {
    return http.get(`/supperPlus/plus/icon-plus-update/${id}`);
  }
  uploadEditAvatar(formData) {
    return httpMultipart.post("/supperPlus/plus/edit-avatar", formData);
  }
  updateActiveOne(data) {
    return http.put(`/supperPlus/plus/update/active-one`, data);
  }
  updateActiveOneSMSReceive(data) {
    return http.put(`/supperPlus/plus/update/active-one/sms-receive`, data);
  }
  updateActiveOneSMSSend(data) {
    return http.put(`/supperPlus/plus/update/active-one/sms-send`, data);
  }
  getConfigFunction() {
    return http.get(`/supperPlus/config/function`);
  }
  updateConfigFunction(data) {
    return http.put(`/supperPlus/config/function`, data);
  }
}


export default new SupperPlusService();