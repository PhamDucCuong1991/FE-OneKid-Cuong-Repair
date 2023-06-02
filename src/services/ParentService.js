import http from "../http-common";
import httpDownload from "../http-download";

class ParentService {
    getNotifyParent(pageNumber, maxPageItem, dataSearch) {
        return http.get(`/parent/notify?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&title=${dataSearch.title}&content=${dataSearch.content}&dateList=${dataSearch.dateList}`);
    }
    viewNotifyParent(idList) {
        return http.put(`/parent/notify?idList=${idList}`);
    }
    downloadFileNotify(id){
        return httpDownload.get(`parent/notify/download/${id}`);
    }
    searchNotifySchoolParent(pageNumber, maxPageItem, active, dateList, title, content) {
        return http.get(`/parent/news?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&active=${active}&dateList=${dateList}&title=${title}&content=${content}`);
    }
    downloadFileNews(id){
        return httpDownload.get(`parent/news/download/${id}`);
    }
    getVideoParentService(){
        return http.get(`parent/video`);
    }
    getVideoOtherParentService(){
        return http.get(`parent/video/other`);
    }
    chartdAttendanceParent(){
        return http.get(`parent/dashboard/chart/attendance`);
    }
    chartFeesParent(){
        return http.get(`parent/dashboard/chart/fees`);
    }
    schoolInforParent(){
        return http.get(`parent/dashboard/infor`);
    }
    getChangeKidsParent(){
        return http.get(`parent/dashboard/changeKids`);
    }
    updateChangeKidsParent(idKid){
        return http.put(`parent/dashboard/changeKids/${idKid}`);
    }

}

export default new ParentService();