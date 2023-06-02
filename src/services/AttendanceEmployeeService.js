import http from "../http-common";
class AttendanceEmployeeService {
  searchConfigEmployeeAttendance(statusEmployeee, idDepartment, nameOrPhone) {
    return http.get(
      `/attendance-employees/config?employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&nameOrPhone=${nameOrPhone}`
    );
  }
  updateConfigAttendanceEmployee(id, data) {
    return http.put(`/attendance-employees/config/${id}`, data);
  }
  searchAttendanceDetail(date, nameOrPhone, status) {
    return http.get(
      `/attendance-employees/detail-day?date=${date}&nameOrPhone=${nameOrPhone}&status=${status}`
    );
  }
  searchAttendanceArrive(date, nameOrPhone, status) {
    return http.get(
      `/attendance-employees/arrive?date=${date}&nameOrPhone=${nameOrPhone}&status=${status}`
    );
  }
  saveArriveOne(data) {
    return http.post(`/attendance-employees/arrive/one`, data);
  }
  saveArriveMany(data) {
    return http.post(`/attendance-employees/arrive/many`, data);
  }
  searchAttendanceLeave(date, nameOrPhone, status) {
    return http.get(
      `/attendance-employees/leave?date=${date}&nameOrPhone=${nameOrPhone}&status=${status}`
    );
  }
  saveLeaveOne(data) {
    return http.post(`/attendance-employees/leave/one`, data);
  }
  saveLeaveMany(data) {
    return http.post(`/attendance-employees/leave/many`, data);
  }
  updateArriveContent(id, data) {
    return http.put(`/attendance-employees/arrive/content/${id}`, data);
  }
  updateLeaveContent(id, data) {
    return http.put(`/attendance-employees/leave/content/${id}`, data);
  }
  searchAttendanceEat(date, nameOrPhone, status) {
    return http.get(
      `/attendance-employees/eat?date=${date}&nameOrPhone=${nameOrPhone}&status=${status}`
    );
  }
  saveEatOne(data) {
    return http.post(`/attendance-employees/eat/one`, data);
  }
  saveEatMany(data) {
    return http.post(`/attendance-employees/eat/many`, data);
  }

  //export excel
  getExportExcelEmployeeDay(date){
    return http.get(`/attendance-employees/export-attendance-employee-new?&date=${date}`);
  }
  getExportExcelEmployeeMonth(date){
    return http.get(`/attendance-employees/export-attendance-employee-month-new?&date=${date}`);
  }
  getExportExcelEmployeeTotal(dateStartEnd, status){
    return http.get(`fn/salary/export-employ-attedance-new?dateStartEnd=${dateStartEnd}&status=${status}`);
  }

}

export default new AttendanceEmployeeService();
