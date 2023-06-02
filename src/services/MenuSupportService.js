import http from "../http-common";
class MenuSupportService {
    getSupportSearch(){
        return http.get(`/menu/support/search`);
    }
    createSupport(data) {
        return http.post(`/menu/support`, data);
    }
    updateSupport(data) {
        return http.put(`/menu/support`, data);
    }
    deleteSupport(id) {
        return http.delete(`/menu/support/${id}`);
    }
}
export default new MenuSupportService();