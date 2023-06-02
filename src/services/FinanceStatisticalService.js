import http from "../http-common";
class FinanceStatisticalService {
    //nhóm học phí
    searchPackageGroup(name) {
        return http.get(`/fn/statistical/kids/group?name=${name}`);
      }
    getPackageGroupById(id) {
        return http.get(`/fn/statistical/kids/group/${id}`);
      }
    createPackageGroup(data) {
        return http.post(`/fn/statistical/kids/group`, data);
      }
    updatePackageGroup(data) {
        return http.put(`/fn/statistical/kids/group`, data);
      }
    deletePackageGroupById(id) {
        return http.delete(`/fn/statistical/kids/group/${id}`);
      }
    getPackageForAdd() {
        return http.get(`/fn/statistical/kids/group/add`);
      }
    addPackageForGroup(id, idList) {
        return http.put(`/fn/statistical/kids/group/add/${id}?idList=${idList}`);
      }
    getPackageForRemove(id) {
        return http.get(`/fn/statistical/kids/group/remove/${id}`);
      }
    removePackageInGroup(idList) {
        return http.put(`/fn/statistical/kids/group/remove?idList=${idList}`);
      }
    //nhóm công lương
    searchSalaryGroup(name) {
        return http.get(`/fn/statistical/employee/group?name=${name}`);
      }
    getSalaryGroupById(id) {
        return http.get(`/fn/statistical/employee/group/${id}`);
      }
    createSalaryGroup(data) {
        return http.post(`/fn/statistical/employee/group`, data);
      }
    updateSalarygeGroup(data) {
        return http.put(`/fn/statistical/employee/group`, data);
      }
    deleteSalaryGroupById(id) {
        return http.delete(`/fn/statistical/employee/group/${id}`);
      }
    getSalaryGroupInSchool() {
        return http.get(`/fn/statistical/employee/group/add`);
      }
    addSampleSalaryIntoGroup(id, idList, type) {
        return http.put(`/fn/statistical/employee/group/add/${id}?idList=${idList}&&type=${type}`);
      }
      //thống kê báo cáo
    getStatisticalKids(startMonth, endMonth, year, name) {
        return http.get(`/fn/statistical/money/kids/statistical?startMonth=${startMonth}&&endMonth=${endMonth}&&year=${year}&&name=${name}`);
      }
    exportExcelFees(idGroupList, startMonth, endMonth, year, name) {
        return http.get(`/fn/statistical/money/kids/export?idGroupList=${idGroupList}&&startMonth=${startMonth}&&endMonth=${endMonth}&&year=${year}&&name=${name}`);
      }
    getStatisticalEmployee(startMonth, endMonth, year, name) {
        return http.get(`/fn/statistical/money/employee/statistical?startMonth=${startMonth}&&endMonth=${endMonth}&&year=${year}&&name=${name}`);
      }
    exportExcelSalary(idGroupList, startMonth, endMonth, year, name) {
        return http.get(`/fn/statistical/money/employee/export?idGroupList=${idGroupList}&&startMonth=${startMonth}&&endMonth=${endMonth}&&year=${year}&&name=${name}`);
      }
    //thống kê
    searchCashBookStatistical(year, type, month, dateList) {
      return http.get(`/fn/statistical/statistical/cashbook?year=${year}&type=${type}&month=${month}&dateList=${dateList}`);
     }
    searchStatisticalInternal(year, startMonth, endMonth) {
      return http.get(
        `/fn/statistical/statistical/internal?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
      );
    }
    searchStatisticalFees(year, startMonth, endMonth) {
      return http.get(
        `/fn/statistical/statistical/fees?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
      );
    }
    searchStatisticalSalary(year, startMonth, endMonth) {
      return http.get(
        `/fn/statistical/statistical/salary?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
      );
    }

    //Export excel
    getExportExcelKidPackageInAndOut(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-bill-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
    getExportExcelKidPackageIn(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-in-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
    getExportExcelKidPackageOut(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-out-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
    getExportExcelKidPackageOrderFalseKids(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-in-out-false-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
    getExportExcelKidPackageOrderTrueKids(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-in-out-true-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
    getExportExcelKidPackageOrderKids(startMonth, endMonth, year, idClass, status){
      return http.get(
        `fn/export-import/kid-in-out-new?startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&idClass=${idClass}&status=${status}`
        );
    }
}
export default new FinanceStatisticalService();
