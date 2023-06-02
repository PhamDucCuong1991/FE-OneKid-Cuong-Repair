import http from "../http-common";

class GroupOutService {
  /**
   * tab category kids
   */
  getAllGroupOutKids() {
    return http.get("/group-out/group/kids");
  }
  create(data){
    return http.post("/group-out/group/kids", data);
  }
  update(id, data){
    return http.put(`/group-out/group/kids/${id}`, data);
  }
  delete(id){
    return http.delete(`/group-out/group/kids/${id}`);
  }
  /**
   * tab category employee
   */
  getAllGroupOutEmployee() {
    return http.get("/group-out/group/employee");
  }
  createEmployee(data){
    return http.post("/group-out/group/employee", data);
  }
  updateEmployee(id, data){
    return http.put(`/group-out/group/employee/${id}`, data);
  }
  deleteEmployee(id){
    return http.delete(`/group-out/group/employee/${id}`);
  }
  /**
   * tab quản lý nghỉ học
   */
    //học sinh
  getAllStudentGroupOut(pageNumber, maxPageItem, idGroupOut, year, dateInList, birthdayList, fullName){
    return http.get(`/group-out/kids/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idGroupOut=${idGroupOut}&yearOut=${year}&dateInList=${dateInList}&birthdayList=${birthdayList}&fullName=${fullName}`);
  }
  getByIdGroupOut(id){
    return http.get(`/group-out/kids/${id}`);
  }
  getAllGroupOutKidsName() {
    return http.get("/group-out/kids/group-name");
  }
  restoreKidsGroupOut(id, idClass){
    return http.put(`/group-out/kids/restore/${id}?idClass=${idClass}`)
  }
  getExportExcelKidsGroupOut(idList){
    return http.get(`/group-out/kids/excel?idList=${idList}`)
  }
  getExportExcelKidsGroupOutProviso(year, dateInList, birthdayList){
    return http.get(`/group-out/kids/excel-proviso?yearOut=${year}&dateInList=${dateInList}&birthdayList=${birthdayList}`);
  }
  //nhân sụ
  getAllEmployeeGroupOut(pageNumber, maxPageItem, idGroupOut, year, dateInList){
    return http.get(`/group-out/employee/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idGroupOut=${idGroupOut}&yearOut=${year}&dateInList=${dateInList}`);
  }
  getByIdEmployeeGroupOut(id){
    return http.get(`/group-out/employee/${id}`);
  }
  getAllGroupOutEmployeeName() {
    return http.get("/group-out/employee/group-name");
  }
  restoreEmployeeGroupOut(id){
    return http.put(`/group-out/employee/restore/${id}`)
  }
  getExportExcelEployeeGroupOut(idList){
    return http.get(`/group-out/employee/excel?idList=${idList}`)
  }
  getExportExcelEmployeeGroupOutProviso(year, dateInList, birthdayList){
    return http.get(`/group-out/employee/excel-proviso?yearOut=${year}&dateInList=${dateInList}&birthdayList=${birthdayList}`);
  }
  /**
   * tab ds học sinh
   */
  getAllGroupOutKidsNameKids(){
    return http.get("/student/kids-group-out/group-name");
  }
  updateKidsGroupOut(data){
    return http.put("/student/kids-group-out",data)
  }
  /**
   * tab ds nhân sự
   */
   getAllGroupOutEmployeeNameEmployee(){
    return http.get("/employees/employee-group-out/group-name");
  }
  updateEmployeeGroupOut(data){
    return http.put("/employees/employee-group-out",data)
  }
  
}

export default new GroupOutService();