import http from "../http-common";

class OtherService {
    createDataSystem() {
        return http.post(`/common/create/common`);
    }
    createFolderSystem() {
        return http.post(`/common/create/folder-system`);
    }
    checkBackend() {
        return http.get(`/test/check-backend`);
    }
    createAttendanceEvaluateFromDate(date, idSchool) {
        return http.post(`/common/create/attendance-evaluate?idSchool=${idSchool}`, date);
    }
    getSchoolAllService() {
        return http.get(`/school/all`);
    }

}

export default new OtherService();