import http from "../http-common";

class KidsBirthday {


    getAll() {
        return http.get("/brand");
    }
    getAllBrandName() {
        return http.get("/brandconfig");
    }
    getById(id) {
        return http.get(`/brand/${id}`);
    }
    searchSmsConfig(name) {
        return http.get(`/brand/search?name=${name}`);
    }

    searchAgentBrand1(name){
        return http.get(`/brandconfig/searchagent?name=${name}`);
    }

    searchBrand(name) {
        return http.get(`/brandconfig/search?name=${name}`);
    }
    searchAgentBrand(name) {
        return http.get(`/agentbrand/search?name=${name}`);
    }
    searchSchoolBrand1(name) {
        return http.get(`/schoolbrand/search?name=${name}`);
    }
    searchSchoolBrand(idAgent,status, name) {
        return http.get(`/schoolbrand/search?idAgent=${idAgent}&status=${status}&name=${name}`);
    }
    create(data) {
        return http.post("/brand", data);
    }
    createBrand(data) {
        return http.post("/brandconfig", data);
    }
    delete(id) {
        return http.delete(`/brand/${id}`);
    }
    getBrandForSchool(id) {
        return http.get(`/schoolbrand/searchAgent/${id}`);
    }
    update(id, data) {
        return http.put(`/brand/${id}`, data);
    }
    updatebrand(id, data) {
        return http.put(`/brandconfig/${id}`, data);
    }
    updateSchoolbrand(id, data) {
        return http.put(`/schoolbrand/${id}`, data);
    }
    deletebrand(id) {
        return http.delete(`/brandconfig/${id}`);
    }
    updateActiveBrand(data) {
        return http.put(`/brandconfig/one-actived-sms`, data);
    }
    deletebramd(id) {
        return http.delete(`/schoolbrand/${id}`);
    }



}

export default new KidsBirthday();