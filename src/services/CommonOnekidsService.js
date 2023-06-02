import http from "../http-common";

class CommonOnekidsService {

    updatePhoneSMS(data) {
        return http.put(`/common-onekids/change-phone-sms`, data);
    }
    createAccountHandleNewPhone(data) {
        return http.put(`/user/account/update-newphone`, data);
    }
    findInfoEmployeeInEmployee() {
        return http.get(`/common-onekids/user/school`);
    }
    updateEmployeeInEmployee(id) {
        return http.put(`/common-onekids/user/school/${id}`);
    }
    getSchoolConfigAdd() {
        return http.get(`/common-onekids/config/add`);
    }
    getAvatar() {
        return http.get(`/common-onekids/avatar`);
    }
    getApiAgain() {
        return http.get(`/common-onekids/api`);
    }
    getSchoolAgain() {
        return http.get(`/common-onekids/school`);
    }
}

export default new CommonOnekidsService();