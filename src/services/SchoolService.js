import http from "../http-common";
import httpMultipart from "../http-multipart";
class SchoolService {
  // getAllSchool(activeSchool, idAgent, schoolCodeOrName,) {
  //   return http.get(`school/search?activeSchool=${activeSchool}&idAgent=${idAgent}&schoolCodeOrName=${schoolCodeOrName}`);
  // }
  searchSchool(pageNumber, maxPageItem, deleteStatus, idAgent, idSchool, activated, name) {
    return http.get(`school/searchData?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&idAgent=${idAgent}&idSchool=${idSchool}&activated=${activated}&name=${name}`);
  }
  exportSchoolData(idList) {
    return http.get(`school/searchData/export?idList=${idList}`);
  }
  getAll() {
    return http.get(`school/search`);
  }
  getAllSchoolUnique() {
    return http.get("school/unique");
  }
  getSchoolInAgent(idAgent) {
    return http.get(`school/school-in-agent/${idAgent}`);
  }
  getAllAccountSchool(pageNumber, maxPageItem, deleteStatus, idAgent, idSchool, activated, nameOrPhone) {
    return http.get(`account-school?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&idAgent=${idAgent}&idSchool=${idSchool}&activated=${activated}&nameOrPhone=${nameOrPhone}`);
  }
  getAccountSchoolById(id) {
    return http.get(`/account-school/${id}`);
  }
  getAccountSchoolByIdSchool(id) {
    return http.get(`/account-school/id-school/${id}`);
  }
  updateAccountSchool(data) {
    return http.put(`/account-school`, data);
  }
  deleteAccountSchool(id) {
    return http.delete(`/account-school/${id}`);
  }
  updateAccountSchoolActive(data) {
    return http.put(`/account-school/active`, data);
  }
  updateAccountSchoolActiveMany(data) {
    return http.put(`/account-school/active-many`, data);
  }
  getSchoolById(id) {
    return http.get(`/school/${id}`);
  }
  getSchoolSmsByIdSchool(idSchool) {
    return http.get(`/school/add-sms-school/${idSchool}`);
  }
  createSchool(data) {
    return httpMultipart.post("/school", data);
  }
  createAccountSchool(data) {
    return http.post("/account-school", data);
  }
  updateSchool(data) {
    return httpMultipart.post(`/school/edit`, data);
  }
  updateActiveMultiSchool(data) {
    return http.put(`/school/active-multi-school/`, data);
  }
  addSmsSchool(data) {
    return http.put(`/school/add-sms-school`, data);
  }
  delete(id) {
    return http.delete(`school/${id}`);
  }
  getAllSchoolAgent() {
    return http.get(`/schoolbrand/searchSchool`);
  }
  updateGroupTypeService(data) {
    return http.put(`/school/group-type`, data);
  }
}

export default new SchoolService();