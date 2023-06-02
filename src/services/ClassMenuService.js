import http from "../http-common";
import httpMultipart from "../http-multipart";
import httpDownload from "../http-download";
class ClassMenuService {
  getClassMenuAllClassInWeek(timeSchedule, idGrade, idClass) {
    return http.get(`/class-menu?timeClassMenu=${timeSchedule}&idGrade=${idGrade}&idClass=${idClass}`);
  }

  getClassMenuByIdClass(data, id) {
    return http.get(`/class-menu/class-menu-idclass?timeClassMenu=${data}&idClass=${id}`);
  }

  createFileAndPicture(data){
    return httpMultipart.post("/class-menu/file-and-picture", data);
  }
  createFileAndPictureMultiClass(data){
    return httpMultipart.post("/class-menu/file-and-picture-multi-class", data);
  }
  getAllClassMenuDetail(timeClassMenu,idGrade,idClass) {
    return http.get(`/class-menu/all-classmenu-detail?timeClassMenu=${timeClassMenu}&idGrade=${idGrade}&idClass=${idClass}`);
  }
  searchClassMenuViewDetail(idClass) {
    return http.get(`/class-menu/classmenu-view-detail/${idClass}`)
  }
  createClassMenuInClassInWeek(data) {
    return http.post("/class-menu/class-menu-idclass", data);
  }
  createFileMultiClassMenu(data) {
    return http.post("/class-menu/file-and-picture-multi-class", data);
  }
  createMultiClassMenuForClass(data) {
    return http.post("/class-menu/class-menu-multi-idclass", data);
  }
  updateApprove(data) {
    return http.put(`/class-menu/approve`, data);
  }

  deleteMenuFile(data){
    return http.put(`/class-menu/menu-file/`, data);
  }
  deleteContentClassMenu(data) {
    return http.put(`/class-menu/delete-content-menu`, data)
  }
  downloadClassMenu(){
    return httpDownload.get("/class-menu/download2")
  }
  createFileExcel(data){
    return httpMultipart.post("/class-menu/import-menu-excel",data)
  }

  //export excel
  getExportExcel(id, date){
    return http.get(`/class-menu/export-menu-class-new?idClass=${id}&timeClassMenu=${date}`);   
  }
}

export default new ClassMenuService();