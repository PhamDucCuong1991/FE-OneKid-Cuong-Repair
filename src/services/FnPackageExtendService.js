import http from "../http-common";
class FnPackageExtendService {
    /**
     * khoản đính kèm của trường
     * @returns 
     */
    getPackageForAdd(){
        return http.get("/fn/fees/extend/package/add");
    }
    getPackageExtend(name){
        return http.get(`/fn/fees/extend/package/search?name=${name}`);
    }
    getPackageExtendById(id){
        return http.get(`/fn/fees/extend/package/${id}`);
    }
    createPackageExtend(data) {
        return http.post(`/fn/fees/extend/package`, data);
    }
    updatePackageExtend(data) {
        return http.put(`/fn/fees/extend/package`, data);
    }
    deletePackageExtend(id) {
        return http.delete(`/fn/fees/extend/package/${id}`);
    }
    activePackageExtendById(data) {
        return http.put(`/fn/fees/extend/package/active`, data);
    }
    /**
     * khoảng đính kèm mặc định
     */
    createDefaultExtendFromKid(idKidList) {
        return http.post(`/fn/fees/extend/default/kid/manual?idKidList=${idKidList}`);
    }
    activeDefaultExtendFromKid(idKidList, active) {
        return http.put(`/fn/fees/extend/default/kid/active?idKidList=${idKidList}&active=${active}`);
    }
    deleteDefaultExtendFromKid(idKidList) {
        return http.delete(`/fn/fees/extend/default/kid?idKidList=${idKidList}`);
    }
    getDefaultExtendById(id){
        return http.get(`/fn/fees/extend/default/${id}`);
    }
    updateDefaultExtend(data) {
        return http.put(`/fn/fees/extend/default`, data);
    }
    createDefaultExtendFromPackage(idDefaultPackageList) {
        return http.post(`/fn/fees/extend/default/package/manual?idDefaultPackageList=${idDefaultPackageList}`);
    }
    activeDefaultExtendFromPackage(idDefaultPackageList, active) {
        return http.put(`/fn/fees/extend/default/package/active?idDefaultPackageList=${idDefaultPackageList}&active=${active}`);
    }
    deleteDefaultExtendFromPackage(idDefaultPackageList) {
        return http.delete(`/fn/fees/extend/default/package?idDefaultPackageList=${idDefaultPackageList}`);
    }
    /**
     * khoản học sinh
     */
     createKidsExtendFromKid(idKidList, date) {
        return http.post(`/fn/fees/extend/kids/kid/manual?idKidList=${idKidList}&date=${date}`);
    }
    activeKidsExtendFromKid(idKidList, active, date) {
        return http.put(`/fn/fees/extend/kids/kid/active?idKidList=${idKidList}&active=${active}&date=${date}`);
    }
    deleteKidsExtendFromKid(idKidList, date) {
        return http.delete(`/fn/fees/extend/kids/kid?idKidList=${idKidList}&date=${date}`);
    }
    getKidsExtendById(id){
        return http.get(`/fn/fees/extend/kids/${id}`);
    }
    updateKidsExtend(data) {
        return http.put(`/fn/fees/extend/kids`, data);
    }
    createKidsExtendFromPackage(idKidsPackageList) {
        return http.post(`/fn/fees/extend/kids/package/manual?idKidsPackageList=${idKidsPackageList}`);
    }
    activeKidsExtendFromPackage(idKidsPackageList, active) {
        return http.put(`/fn/fees/extend/kids/package/active?idKidsPackageList=${idKidsPackageList}&active=${active}`);
    }
    deleteKidsExtendFromPackage(idKidsPackageList) {
        return http.delete(`/fn/fees/extend/kids/package?idKidsPackageList=${idKidsPackageList}`);
    }
}
export default new FnPackageExtendService();