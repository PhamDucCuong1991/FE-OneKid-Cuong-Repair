import http from "../http-common";
// import httpMulipart from "../http-multipart";

class StudentMasterService {

  searchAccountKids(idSchool, nameOrPhone) {
    return http.get(`/student-master/search/account-kids?&idSchool=${idSchool}&nameOrPhone=${nameOrPhone}`);
  }
  updateExtra(id, data) {
    return http.put(`/student-master/extra/${id}`, data);
  }
  updateOneActiveSMS(data) {
    return http.put(`/student-master/one-actived-sms`, data);
  }
  updateOneActive(data) {
    return http.put(`/student-master/one-actived`, data);
  }
  mergeKidsIntoParent(data) {
    return http.put(`/student-master/merge-kids`, data);
  }
  deleteKidsAdmin(id) {
    return http.delete(`/student-master/${id}`);
  }
  restoreKidsAdmin(id) {
    return http.put(`/student-master/restore/${id}`);
  }
}

export default new StudentMasterService();