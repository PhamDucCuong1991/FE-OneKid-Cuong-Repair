import http from "../http-common";
class EmployeeSalaryService {
  searchEmloyeeSalaryDefault(id) {
    return http.get(`/fn/salary/salary-default?id=${id}`);
  }
  seachSalaryDefault(id) {
    return http.get(`/fn/salary/salary-default/${id}`);
  }
  searchEmloyeeSalaryMonth(id, year) {
    return http.get(`/fn/salary/order/month?id=${id}&year=${year}`);
  }
  searchBillEmployee(idOrder, idInfoEmployee, category) {
    return http.get(
      `/fn/salary/order/payment/${idOrder}?idInfoEmployee=${idInfoEmployee}&category=${category}`
    );
  }
  searchSalaryApply(idInfo, localDate) {
    return http.get(
      `/fn/salary/salary-apply/dialog?idInfoEmployee=${idInfo}&localDate=${localDate}`
    );
  }
  deleteSalaryApplyOne(id) {
    return http.delete(`/fn/salary/salary-apply/${id}`);
  }
  deleteSalaryApplyMany(idList) {
    return http.delete(`/fn/salary/salary-apply/many?idList=${idList}`);
  }
  activeSalaryDefault(id) {
    return http.put(`/fn/salary/salary-default/active/${id}`);
  }
  createEmployeeSalaryDefault(idInfoEmployee, data) {
    return http.post(`/fn/salary/salary-default/${idInfoEmployee}`, data);
  }
  createEmployeeSalaryCustom(idInfoEmployee, data) {
    return http.post(`/fn/salary/salary-apply/create/${idInfoEmployee}`, data);
  }
  updateEmployeeSalaryDefault(data) {
    return http.put(`/fn/salary/salary-default`, data);
  }
  deleteSalaryDefault(id) {
    return http.delete(`/fn/salary/salary-default/${id}`);
  }
  deleteSalaryDefaultMany(idList) {
    return http.delete(`/fn/salary/salary-default/many?idList=${idList}`);
  }
  updateSalaryApply(data) {
    return http.put(`/fn/salary/salary-apply`, data);
  }
  getSalaryApply(id) {
    return http.get(`/fn/salary/salary-apply/${id}`);
  }
  generateEmployeeSalaryFromDefault(data) {
    return http.post(`/fn/salary/generate/employee-salary/default`, data);
  }
  generateEmployeeSalaryFromSchool(data) {
    return http.post(`/fn/salary/generate/employee-salary/school`, data);
  }
  generateEmployeeSalaryDefault(data) {
    return http.post(`/fn/salary/generate/employee-salary-default`, data);
  }
  searchEmployeeSalarySetting(
    date,
    statusEmployeee,
    idDepartment,
    employeeNameOrPhone
  ) {
    return http.get(
      `/fn/salary/salary-apply/list?date=${date}&employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&employeeNameOrPhone=${employeeNameOrPhone}`
    );
  }
  searchEmployeeSalaryInSchool(
    date,
    statusEmployeee,
    idDepartment,
    employeeNameOrPhone,
    idList
  ) {
    return http.get(
      `/fn/salary/approved/list?date=${date}&employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&employeeNameOrPhone=${employeeNameOrPhone}&idList=${idList}`
    );
  }
  searchEmployeeSalaryDetail(id, date) {
    return http.get(
      `/fn/salary/approved/detail?id=${id}&date=${date}`
    );
  }
  searchEmployeeSalaryPaid(
    date,
    statusEmployeee,
    idDepartment,
    employeeNameOrPhone
  ) {
    return http.get(
      `/fn/salary/order/list?date=${date}&employeeStatus=${statusEmployeee}&idDepartment=${idDepartment}&employeeNameOrPhone=${employeeNameOrPhone}`
    );
  }
  updateEmployeeSalaryApply(data) {
    return http.put(`/fn/salary/salary-apply`, data);
  }
  searchSalarySampleBrief() {
    return http.get(`/fn/salary/generate/salary-sample/brief`);
  }
  searchSalarySample(name) {
    return http.get(`/fn/salary/salary-sample?name=${name}`);
  }
  detailSalarySample(id) {
    return http.get(`/fn/salary/salary-sample/${id}`);
  }
  createSalarySample(data) {
    return http.post(`/fn/salary/salary-sample`, data);
  }
  updateSalarySample(data) {
    return http.put(`/fn/salary/salary-sample`, data);
  }
  deleteSalarySample(id) {
    return http.delete(`/fn/salary/salary-sample/${id}`);
  }
  // showAllSalary(data) {
  //   return http.put(`/fn/salary/salary-show-all`, data);
  // }
  approvedOneSalary(id) {
    return http.put(`/fn/salary/approved/approved/one/${id}`);
  }
  approvedAllSalary(data) {
    return http.put(`/fn/salary/approved/approved/many`, data);
  }
  lockedOneSalary(id) {
    return http.put(`/fn/salary/approved/locked/one/${id}`);
  }
  lockedAllSalary(data) {
    return http.put(`/fn/salary/approved/locked/many`, data);
  }
  saveNumberUser(data) {
    return http.put(`/fn/salary/approved/use-number/one`, data);
  }
  transferNumberEmployeeMany(dataList) {
    return http.put(`/fn/salary/approved/use-number/transfer/many`, dataList);
  }
  usedNumberEmployeeMany(dataList) {
    return http.put(`/fn/salary/approved/use-number/save/many`, dataList);
  }
  generateOrderEmployee(data) {
    return http.post(`/fn/salary/order/generate`, data);
  }
  sendNotify(data) {
    return http.put(`/fn/salary/order/notify`, data);
  }
  showBill(data) {
    return http.put(`/fn/salary/order/view`, data);
  }
  lockedBill(data) {
    return http.put(`/fn/salary/order/locked`, data);
  }

  orderSalaryPayment(idOrder, data) {
    return http.put(`/fn/salary/order/payment/${idOrder}`, data);
  }

  findOrderSalaryHistory(idOrder) {
    return http.get(`/fn/salary/order/history/${idOrder}`);
  }
  findOrderSalaryHistoryDetail(idOrderHistory) {
    return http.get(`/fn/salary/order/history/detail/${idOrderHistory}`);
  }

  getOrderSalaryDetail(idOrder) {
    return http.get(`/fn/salary/order/detail/${idOrder}`);
  }
  saveOrderSalaryDescription(idOrder, data) {
    return http.put(`/fn/salary/order/description/${idOrder}`, data);
  }
  findSalaryPackagePaymentDetail(idSalaryPackage) {
    return http.get(
      `/fn/salary/order/history/salary-package/${idSalaryPackage}`
    );
  }
  //thống kê chung
  statisticalCommon(year, startMonth, endMonth) {
    return http.get(
      `/fn/salary/order/statistical/common?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
    );
  }
  getOrderSalaryPrint(idInfoEmployee, category, idList) {
    return http.get(
      `fn/salary/order/print?idInfoEmployee=${idInfoEmployee}&category=${category}&idList=${idList}`
    );
  }
  getOrderSalaryInPrint(idInfoEmployee, category, idList) {
    return http.get(
      `fn/salary/order/print/in?idInfoEmployee=${idInfoEmployee}&category=${category}&idList=${idList}`
    );
  }
  getOrderSalaryOutPrint(idInfoEmployee, category, idList) {
    return http.get(
      `fn/salary/order/print/out?idInfoEmployee=${idInfoEmployee}&category=${category}&idList=${idList}`
    );
  }
  exportStatisticalCommon(type, startMonth, endMonth, year, status, idDepartment) {
    return http.get(
      `/fn/salary/order/statistical/export?type=${type}&startMonth=${startMonth}&endMonth=${endMonth}&year=${year}&status=${status}&idDepartment=${idDepartment}`
    );
  }
}

export default new EmployeeSalaryService();
