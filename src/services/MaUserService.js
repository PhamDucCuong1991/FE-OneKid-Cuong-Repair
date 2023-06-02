import http from "../http-common";
import httpMultipart from "../http-multipart";

class MaUserService {
    findProfile() {
        return http.get(`/user/profile`);
    }

    updateProfile(data) {
        return httpMultipart.post("user/profile", data);
    }
    checkExistUsername(data) {
        return http.put(`/user/account/check-exist`, data);
    }
    createAccountHandleNewPhone(data) {
        return http.put(`/user/account/update-newphone`, data);
    }
    verificationCode(data) {
        return http.put(`/user/account/verification-account`, data);
    }
    mergeAccount(data) {
        return http.put(`/user/account/merge-account`, data);
    }
    findAccountEmployeeDublicate(appType, phone) {
        return http.get(`/user/account/duplicate-employee?appType=${appType}&phone=${phone}`);
    }
    findAccountKidsDublicate(phone) {
        return http.get(`/user/account/duplicate-kids?phone=${phone}`);
    }
    findUserByUsername(phone, appType) {
        return http.get(`/user/username?phone=${phone}&appType=${appType}`);
    }
    updatePasswordManyService(type, idList, newPassword){
        if(type=='kidsType'){
            return http.put(`/student-master/update/password?idList=${idList}&newPassword=${newPassword}`);
        }else if(type=='employeeType'){
            return http.put(`/employees-master/update/password?idList=${idList}&newPassword=${newPassword}`);
        }else{
            alert('type invalid')
        }
    }

}

export default new MaUserService();