import http from "../http-common";
import httpMultipart from "../http-multipart";

class SystemConfigService {
    /**
 * mẫu điểm danh
 */
    findAllAttendanceSample() {
        return http.get(`/master/system-config/attendance-sample`);
    }
    createAttendanceSample(data) {
        return http.post(`/master/system-config/attendance-sample`, data);
    }
    updateAttendanceSample(data) {
        return http.put(`/master/system-config/attendance-sample`, data);
    }
    deleteAttendanceSampleOne(id) {
        return http.delete(`/master/system-config/attendance-sample/${id}`);
    }
    //mau loi chuc
    findAllWishesSample() {
        return http.get(`/master/system-config/wishes-sample`);
    }
    createWishesSample(data) {
        return httpMultipart.post("/master/system-config/wishes-sample", data);
    }
    updateWishesSample(data) {
        return httpMultipart.post("/master/system-config/wishes-sample/update", data);
    }
    deleteWishesSample(id) {
        return http.delete(`/master/system-config/wishes-sample/${id}`);
    }

    /**
   * mẫu nhận xét
   */
    findAllEvaluateSample() {
        return http.get(`/master/system-config/evaluate-sample`);
    }
    createEvaluateSample(data) {
        return http.post(`/master/system-config/evaluate-sample`, data);
    }
    updateEvaluateSample(data) {
        return http.put(`/master/system-config/evaluate-sample`, data);
    }
    deleteEvaluateSampleOne(id) {
        return http.delete(`/master/system-config/evaluate-sample/${id}`);
    }
    /**
     * thiết lập tiêu đề, nội dung
     */
    findAllWebSystemTitle() {
        return http.get(`/master/system-config/web-system-title`);
    }
    updateWebSystemTitle(data) {
        return http.put(`/master/system-config/web-system-title`, data);
    }
    /**
     * thiết lập hệ thống
     */
    findAllAppVersion() {
        return http.get(`/master/system-config/system/app-version`);
    }
    updateAppVersion(data) {
        return http.put(`/master/system-config/system/app-version`, data);
    }
    findSysInfor() {
        return http.get(`/master/system-config/system/infor`);
    }
    updateSysInfor(data) {
        return http.put(`/master/system-config/system/infor`, data);
    }
    findSchoolConfig(idAgent, schoolName) {
        return http.get(`/master/system-config/school?idAgent=${idAgent}&schoolName=${schoolName}`);
    }
    findSchoolIconParent(id) {
        return http.get(`/master/system-config/school/icon-parent/${id}`);
    }
    updateSchoolIconParent(id, data) {
        return http.put(`/master/system-config/school/icon-parent/${id}`, data);
    }
    findSchoolIconTeacher(id) {
        return http.get(`/master/system-config/school/icon-teacher/${id}`);
    }
    updateSchoolIconTeacher(id, data) {
        return http.put(`/master/system-config/school/icon-teacher/${id}`, data);
    }
    findSchoolIconPlus(id) {
        return http.get(`/master/system-config/school/icon-plus/${id}`);
    }
    updateSchoolIconPlus(id, data) {
        return http.put(`/master/system-config/school/icon-plus/${id}`, data);
    }
    findSchoolConfigSystem(id) {
        return http.get(`/master/system-config/school/config/${id}`);
    }
    updateSchoolConfigSystem(data) {
        return http.put(`/master/system-config/school/config`, data);
    }
    /**
     * cấu hình khác
     */
    findAllBirthdaySample() {
        return http.get(`/master/system-config/birthday-sample`);
    }
    updateActiveBirthdaySample(data) {
        return http.put(`/master/system-config/birthday-sample/active`, data);
    }
    updateBirthdaySample(data) {
        return httpMultipart.post(`/master/system-config/birthday-sample/update`, data);
    }
    findAllCelebrateSample() {
        return http.get(`/master/system-config/celebrate-sample`);
    }
    updateActiveCelebrateSample(data) {
        return http.put(`/master/system-config/celebrate-sample/active`, data);
    }
    createCelebrateSample(data) {
        return httpMultipart.post("/master/system-config/celebrate-sample", data);
    }
    updateCelebrateSample(data) {
        return httpMultipart.post(`/master/system-config/celebrate-sample/update`, data);
    }
    deleteCelebrateSample(id) {
        return http.delete(`/master/system-config/celebrate-sample/${id}`);
    }
    getNotifyConfig(idSchool) {
        return http.get(`/master/system-config/config-notify/${idSchool}`);
    }
    updateNotifyConfig(data) {
        return http.put(`/master/system-config/config-notify`, data);
    }
    getIconLocConfig(idSchool) {
        return http.get(`/master/system-config/config-icon-lock/${idSchool}`);
    }
    updateIconLockConfig(data) {
        return http.put(`/master/system-config/config-icon-lock`, data);
    }
    getApi(type) {
        return http.get(`/master/system-config/api?type=${type}`);
    }
    updateApi(data) {
        return http.put(`/master/system-config/api`, data);
    }
    updateApiRanks(data) {
        return http.put(`/master/system-config/api/ranks`, data);
    }
    //onecam
    getOneCamConfigService(id) {
        return http.get(`/master/system-config/onecam/config?idSchool=${id}`);
    }
    updateOneCamConfigService(data) {
        return http.put(`/master/system-config/onecam/config`, data);
    }
}
export default new SystemConfigService();