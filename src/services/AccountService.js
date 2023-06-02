import http from "../http-common";

class AccountService {
    findAccountUser(pageNumber, maxPageItem, deleteStatus, appType, active,  nameOrPhone, typeDelete, typeChildren) {
        return http.get(`/account?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&deleteStatus=${deleteStatus}&appType=${appType}&active=${active}&nameOrPhone=${nameOrPhone}&typeDelete=${typeDelete}&typeChildren=${typeChildren}`);
    }
    updateAccountUser(data) {
        return http.put(`/account`, data);
    }
    deleteAccountUser(id) {
        return http.delete(`/account/${id}`);
    }
    deleteCompleteAccountUser(id) {
        return http.delete(`/account/complete/${id}`);
    }
    restoreAccountUser(id) {
        return http.put(`/account/restore/${id}`);
    }

}

export default new AccountService();