import http from "../http-common";

class NotifySchoolService {
    searchNotifySchool(pageNumber, maxPageItem, active, dateList, title, content) {
        return http.get(`/notify-school/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&active=${active}&dateList=${dateList}&title=${title}&content=${content}`);
    }

    findByNotifySchool(id){
        return http.get(`/notify-school/detail/${id}`);
    }

    getActiveNotifySchool(data){
        return http.put("/notify-school/active",data);
    }

    createNotifySchool(data){
        return http.post("/notify-school/create",data);
    }

    updateNotifySchool(data){
        return http.put("/notify-school/update",data);
    }
    
    deleteNotifySchool(id){
        return http.delete(`/notify-school/delete/${id}`);
    }
}

export default new NotifySchoolService();