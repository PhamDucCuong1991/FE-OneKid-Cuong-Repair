import http from "../http-common";
import httpMultipart from "../http-multipart";

class SchoolConfigService {
  getSchoolData() {
    return http.get(`/school-config/infor`);
  }
  updateSchoolData( data) {
    return http.put(`/school-config/infor`, data);
  }
  getConfigCommon() {
    return http.get(`/supperPlus-config/school`);
  }
  updateConfigCommon(data) {
    return http.put(`/supperPlus-config/school`, data);
  }
  getConfigAttendanceSchool() {
    return http.get(`/school-config/attendance-employee`);
  }
  getConfigAttendanceTimeSchool() {
    return http.get(`/school-config/attendance-employee/time`);
  }
  updateConfigAttendanceSchool(data) {
    return http.put(`/school-config/attendance-employee`,data);
  }
  updateConfigAttendanceTimeSchool(data) {
      return http.put(`/school-config/attendance-employee/time`,data);
  }


  updateConfigClassAbsent(data) {
    return http.put(`/school-config/class/absent`, data);
  }
  searchConfigClass(idGrade, idClass, className) {
    return http.get(`/school-config/class/absent?idGrade=${idGrade}&idClass=${idClass}&className=${className}`);
  }

  // media config
  findAllMedia() {
    return http.get(`/supperPlus-config/media`);
  }
  updateActiveMedia(data) {
    return http.put(`/supperPlus-config/media-active-one`, data);
  }
  updateMedia(data) {
    return http.put(`/supperPlus-config/media`, data);
  }
  deleteOneMedia(id) {
    return http.delete(`/supperPlus-config/media/${id}`);
  }
  deleteManyMedia(dataList) {
    return http.put(`/supperPlus-config/media/delete`, dataList);
  }
  createMedia(data) {
    return http.post(`/supperPlus-config/media`, data);
  }
  findAllMediaSetting(idGrade, idClass, className) {
    return http.get(`/supperPlus-config/media-setting?idGrade=${idGrade}&idClass=${idClass}&className=${className}`);
  }
  findAllMediaForClass(id) {
    return http.get(`/supperPlus-config/media-class/${id}`);
  }
  updateMediaForClass(id, data) {
    return http.put(`/supperPlus-config/media-class/${id}`, data);
  }

  /**
   * camera config
   */
  //dvrcamera config
  findAllDvrCamera() {
    return http.get(`/supperPlus-config/dvrcamera`);
  }
  findOneCamNews() {
    return http.get(`/onecam/news`);
  }
  updateOneCamNews(data) {
    return http.put(`/onecam/news`, data);
  }
  findOneCamSetting(idGrade, idClass, className) {
    return http.get(`/onecam/setting?idGrade=${idGrade}&idClass=${idClass}&className=${className}`);
  }
  updateOneCamSetting(data) {
    return http.put(`/onecam/setting`, data);
  }
  createDvrCamera(data) {
    return http.post(`/supperPlus-config/dvrcamera`, data);
  }
  updateDvrCamera(data) {
    return http.put(`/supperPlus-config/dvrcamera`, data);
  }
  deleteDvrCamera(id) {
    return http.delete(`/supperPlus-config/dvrcamera/${id}`);
  }
  deleteDvrCameraMany(data) {
    return http.put(`/supperPlus-config/dvrcamera/delete`, data);
  }
  updateActiveDvrCamera(data) {
    return http.put(`/supperPlus-config/dvrcamera/active-one`, data);
  }
  //camere list
  findAllCamera() {
    return http.get(`/supperPlus-config/camera`);
  }
  createCamera(data) {
    return http.post(`/supperPlus-config/camera`, data);
  }
  updateCamera(data) {
    return http.put(`/supperPlus-config/camera`, data);
  }
  deleteCameraOne(id) {
    return http.delete(`/supperPlus-config/camera/${id}`);
  }
  deleteCameraMany(data) {
    return http.put(`/supperPlus-config/camera/delete`, data);
  }
  updateActiveCamera(data) {
    return http.put(`/supperPlus-config/camera/active-one`, data);
  }
  //camera setting
  findAllCameraSetting(idGrade, idClass, className) {
    return http.get(`/supperPlus-config/camera-setting?idGrade=${idGrade}&idClass=${idClass}&className=${className}`);
  }
  findAllCameraForClass(id) {
    return http.get(`/supperPlus-config/camera-class/${id}`);
  }
  updateCameraForClass(id, data) {
    return http.put(`/supperPlus-config/camera-class/${id}`, data);
  }
  /**
   * quản lý môn học
   */
  findAllSubjectManege(idGrade, idClass, className) {
    return http.get(`/school-config/subject/manage?idGrade=${idGrade}&idClass=${idClass}&className=${className}`);
  }
  findAllSubjectForClass(id) {
    return http.get(`/school-config/subject/class/${id}`);
  }
  updateSubjectForClass(id, data) {
    return http.put(`/school-config/subject/class/${id}`, data);
  }
  searchSubject(subjectName) {
    return http.get(`/school-config/subject?subjectName=${subjectName}`);
  }
  createSubject(data) {
    return http.post(`/school-config/subject`, data);
  }
  updateSubject(data) {
    return http.put(`/school-config/subject`, data);
  }
  deleteSubjectOne(id) {
    return http.delete(`/school-config/subject/${id}`);
  }
  deleteSubjectMany(data) {
    return http.put(`/school-config/subject/delete`, data);
  }
  /**
   * cấu hình gửi tin
   */
  findAllBirthdaySample() {
    return http.get(`/supperPlus-config/birthday-sample`);
  }
  updateActiveBirthdaySample(data) {
    return http.put(`/supperPlus-config/birthday-sample/active`, data);
  }
  updateBirthdaySample(data) {
    return http.post(`/supperPlus-config/birthday-sample`, data);
  }
  findAllCelebrateSample() {
    return http.get(`/supperPlus-config/celebrate-sample`);
  }
  updateActiveCelebrateSample(data) {
    return http.put(`/supperPlus-config/celebrate-sample/active`, data);
  }
  createCelebrateSample(data) {
    return httpMultipart.post("/supperPlus-config/celebrate-sample", data);
  }
  updateCelebrateSample(data) {
    return httpMultipart.post(`/supperPlus-config/celebrate-sample/update`, data);
  }
  deleteCelebrateSample(id) {
    return http.delete(`/supperPlus-config/celebrate-sample/${id}`);
  }

  /**
   * mẫu nhận xét
   */
  findAllEvaluateSample() {
    return http.get(`/school-config/evaluate-sample`);
  }
  createEvaluateSample(data) {
    return http.post(`/school-config/evaluate-sample`, data);
  }
  updateEvaluateSample(data) {
    return http.put(`/school-config/evaluate-sample`, data);
  }
  deleteEvaluateSampleOne(id) {
    return http.delete(`/school-config/evaluate-sample/${id}`);
  }
  /**
   * mẫu điểm danh
   */
  findAllAttendanceSample() {
    return http.get(`/school-config/attendance-sample`);
  }
  createAttendanceSample(data) {
    return http.post(`/school-config/attendance-sample`, data);
  }
  updateAttendanceSample(data) {
    return http.put(`/school-config/attendance-sample`, data);
  }
  deleteAttendanceSampleOne(id) {
    return http.delete(`/school-config/attendance-sample/${id}`);
  }
  //mẫu lời chúc
  findAllWishesSample() {
    return http.get(`/school-config/wishes-sample`);
  }
  createWishesSample(data) {
    return httpMultipart.post("/school-config/wishes-sample", data);
  }
  updateWishesSample(data) {
    return httpMultipart.post("/school-config/wishes-sample/update", data);
  }
  deleteWishesSample(id) {
    return http.delete(`/school-config/wishes-sample/${id}`);
  }

  /**
   * quản lý đối tượng
   */
  findAccountType() {
    return http.get(`/school-config/account-type`);
  }
  getAccountTypeById(id) {
    return http.get(`/school-config/account-type/${id}`);
  }
  createAccountType(data) {
    return http.post(`/school-config/account-type`, data);
  }
  updateAccountType(data) {
    return http.put(`/school-config/account-type`, data);
  }
  deleteAccountTypeById(id) {
    return http.delete(`/school-config/account-type/${id}`);
  }
  /**
   * quản lý quyền
   */
  findAllPermissionManage(type) {
    return http.get(`/supperPlus-config/user-role?type=${type}`);
  }
  findPermissionForUser(id, type) {
    return http.get(`/supperPlus-config/role-user/${id}?type=${type}`);
  }
  updateRoleForUser(id, data) {
    return http.put(`/supperPlus-config/role-user/${id}`, data);
  }
  updatePermissionForUser(id, data) {
    return http.put(`/supperPlus-config/permission/${id}`, data);
  }
  searchRoleService(type, roleName) {
    return http.get(`/supperPlus-config/permission-role?type=${type}&roleName=${roleName}`);
  }
  findRole(id) {
    return http.get(`/supperPlus-config/permission-role/${id}`);
  }
  findAllApi(type) {
    return http.get(`/supperPlus-config/api?type=${type}`);
  }
  createRole(data) {
    return http.post(`/supperPlus-config/permission-role`, data);
  }
  upateRole(data) {
    return http.put(`/supperPlus-config/permission-role`, data);
  }
  deleteRole(id) {
    return http.delete(`/supperPlus-config/permission-role/${id}`);
  }
  /**
   *  cấu hình ngày nghỉ cho lớp
   */
  createDayOffClass(data) {
    return http.post(`/school-config/class/dayOff`, data);
  }
  createDayOffClassMany(data) {
    return http.post(`/school-config/class/dayOff/many`, data);
  }
  getDayOffClassYear(id, year, date, note) {
    return http.get(`/school-config/class/dayOff/${id}?year=${year}&date=${date}&note=${note}`);
  }
  updateDayOffClassYear(data) {
    return http.put(`/school-config/class/dayOff`, data);
  }
  deleteDayOffClassYear(id) {
    return http.delete(`/school-config/class/dayOff/${id}`);
  }
  deleteDayOffClassYearList(idList) {
    return http.delete(`/school-config/class/dayOff?idList=${idList}`);
  }
  viewDayOffClass(idClass) {
    return http.get(`/school-config/class/dayOff/view/${idClass}`);
  }

  /**
   * cấu hình tài chính
   */
   findCashBookYear() {
    return http.get(`/school-config/finance/cashbook`);
}
  updateMoneyCashBook(data) {
    return http.put(`/school-config/finance/cashbook/money`,data);
  }
  updateLockedCashBook(data) {
      return http.put(`/school-config/finance/cashbook/locked`,data);
  }
  createBankInfo(data) {
      return http.put("/school-config/finance/bank-info", data);
  }
  findBankInfo() {
      return http.get("/school-config/finance/bank-info");
  }

}

export default new SchoolConfigService();