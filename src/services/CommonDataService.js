import http from "../http-common";
class CommonDataService {
    showSupportSearch(){
        return http.get(`/common-data/support`);
    }
}
export default new CommonDataService();