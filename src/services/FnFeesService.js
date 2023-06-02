import http from "../http-common";
import httpMultipart from "../http-multipart";

class FnFeesService {
  //danh sách khoản thu
  searchPackage(name, usingStatus, category) {
    return http.get(`/fn/fees/package/search?name=${name}&usingStatus=${usingStatus}&category=${category}`);
  }
  getPackageById(id) {
    return http.get(`/fn/fees/package/${id}`);
  }
  createPackage(data) {
    return http.post("/fn/fees/package", data);
  }
  updatePackage(data) {
    return http.put("/fn/fees/package", data);
  }
  detailPackage(idPackage, date) {
    return http.get(`/fn/fees/package/detail/${idPackage}?date=${date}`);
  }
  deletePackage(id) {
    return http.delete(`/fn/fees/package/${id}`);
  }
  changeSortNumber(data) {
    return http.put("/fn/fees/package/change-sort", data);
  }

  searchPackageRoot() {
    return http.get(`/fn/fees/package/root/search`);
  }
  updatePackageRoot(data) {
    return http.put(`/fn/fees/package/root`, data);
  }

  searchClassPackage(className) {
    return http.get(`/fn/fees/package/class/search?className=${className}`);
  }
  getPackageInClass(id) {
    return http.get(`/fn/fees/package/class/package-in-class/${id}`);
  }
  addPackageForClass(data) {
    return http.put(`/fn/fees/package/class/add-in-class`, data);
  }

  //đăng ký khoản thu
  searchPackageKidsDefaultInClass(idClass) {
    return http.get(`/fn/fees/kids-package/default/class/${idClass}`);
  }
  searchPackageKidsDefault(status, idClass, fullName) {
    return http.get(
      `/fn/fees/kids-package/default/search?status=${status}&idClass=${idClass}&fullName=${fullName}`
    );
  }
  updatePackageKidsDefaultOne(data) {
    return http.put(`/fn/fees/kids-package/default/one`, data);
  }
  updatePackageKidsDefaultMany(requestList) {
    return http.put(`/fn/fees/kids-package/default/many`, requestList);
  }
  getPackageForDefaultPackageAdd(idKid) {
    return http.get(`/fn/fees/kids-package/default/add/${idKid}`);
  }
  createPackageForDefaultPackageAdd(idKid, data) {
    return http.post(`/fn/fees/kids-package/default/add/${idKid}`, data);
  }
  getPackageDefaultKid(idKid) {
    return http.get(`/fn/fees/kids-package/default/kid/${idKid}`);
  }
  activePackageDefaultKid(data) {
    return http.put(`/fn/fees/kids-package/default/kid/active`, data);
  }
  deletePackageDefaultKid(idPackageDefault) {
    return http.delete(`/fn/fees/kids-package/default/kid/${idPackageDefault}`);
  }
  getPackageDefaultById(id) {
    return http.get(`/fn/fees/kids-package/default/${id}`);
  }
  updatePackageDefault(data) {
    return http.put(`/fn/fees/kids-package/default/`, data);
  }
  getPackageKids(id) {
    return http.get(`/fn/fees/kids-package/default/${id}`);
  }
  searchPackageKids(date, status, idClass, fullName) {
    return http.get(
      `/fn/fees/kids-package/search?date=${date}&status=${status}&idClass=${idClass}&fullName=${fullName}`
    );
  }
  generatePackageKidsOne(idKid, date) {
    return http.post(
      `/fn/fees/kids-package/generate/${idKid}?date=${date}`
    );
  }
  generatePackageKidsMany(data) {
    return http.post(`/fn/fees/kids-package/generate`, data);
  }
  activePackageKidsOne(data) {
    return http.put(`/fn/fees/kids-package/active/one`, data);
  }
  activePackageKidsMany(requestList) {
    return http.put(`/fn/fees/kids-package/active/many`, requestList);
  }
  getPackageForAdd(idKid, date) {
    return http.get(
      `/fn/fees/kids-package/add/${idKid}?date=${date}`
    );
  }
  getPackageForAddNotInClass(idClass) {
    return http.get(`/fn/fees/kids-package/add/many/${idClass}`);
  }
  createPackageForAddNotInClass(data) {
    return http.post(`/fn/fees/kids-package/add/many`, data);
  }
  createPackageKidsForAdd(idKid, data) {
    return http.post(`/fn/fees/kids-package/add/${idKid}`, data);
  }
  getPackageKidsDetail(idKid, date, idClass) {
    return http.get(
      `/fn/fees/kids-package/${idKid}?date=${date}&idClass=${idClass}`
    );
  }
  getPackageKidstById(id) {
    return http.get(`/fn/fees/kids-package/update/${id}`);
  }
  updatePackageKids(data) {
    return http.put(`/fn/fees/kids-package/update/`, data);
  }
  deletePackageKidsById(idKidsPackage) {
    return http.delete(`/fn/fees/kids-package/${idKidsPackage}`);
  }
  deletePackageKidsMany(idList) {
    return http.delete(`/fn/fees/kids-package/many?idList=${idList}`);
  }
  deletePackageKidsManyKids(idKidList, idPackageList, date) {
    return http.delete(`/fn/fees/kids-package/many-kids?idKidList=${idKidList}&idPackageList=${idPackageList}&date=${date}`);
  }
  addPackageKidsFromPackageDefault(idKid, idPackageDefault) {
    return http.post(
      `/fn/fees/kids-package/add/default-package/${idKid}?id=${idPackageDefault}`
    );
  }
  addPackageKidsFromPackageDefaultMany(idKidList, idPackageDefaultList) {
    return http.post(
      `/fn/fees/kids-package/add/default-package/many?idKidList=${idKidList}&idPackageDefaultList=${idPackageDefaultList}`
    );
  }
  activePackageKids(data) {
    return http.put(`/fn/fees/kids-package/kid/active`, data);
  }

  // duyệt khoản thu
  searchPackageKidsForKids(date, status, idClass, fullName) {
    return http.get(
      `/fn/fees/kids-package/kids/search?date=${date}&status=${status}&idClass=${idClass}&fullName=${fullName}`
    );
  }
  searchPackageKidsForApproved(date, status, idClass, fullName, idKidList) {
    return http.get(
      `/fn/fees/approved/kids-package/search?date=${date}&status=${status}&idClass=${idClass}&fullName=${fullName}&idKidList=${idKidList}`
    );
  }
  searchPackageKidsForApprovedDetail(idKid, date) {
    return http.get(
      `/fn/fees/approved/kids-package/search/detail?idKid=${idKid}&date=${date}`
    );
  }
  approvedKidsPackageAdvance(id) {
    return http.put(`/fn/fees/approved/kids-package/approved/one/advance/${id}`);
  }
  deleteKidsPackageAdvance(id) {
    return http.delete(`/fn/fees/approved/kids-package/approved/one/advance/${id}`);
  }
  approvedKidsPackage(data) {
    return http.put(`/fn/fees/approved/kids-package/approved/one`, data);
  }
  lockedKidsPackage(data) {
    return http.put(`/fn/fees/approved/kids-package/locked/one`, data);
  }
  approvedKidsPackageMany(data) {
    return http.put(`/fn/fees/approved/kids-package/approved/many`, data);
  }
  lockvedKidsPackageMany(data) {
    return http.put(`/fn/fees/approved/kids-package/locked/many`, data);
  }
  usedNumberKidsPackage(data) {
    return http.put(`/fn/fees/approved/use-number/save/one`, data);
  }
  usedNumberKidsPackageMany(data) {
    return http.put(`/fn/fees/approved/use-number/save/many`, data);
  }
  transferNumberOne(data) {
    return http.put(`/fn/fees/approved/use-number/transfer/one`, data);
  }
  transferNumberMany(dataList) {
    return http.put(`/fn/fees/approved/use-number/transfer/many`, dataList);
  }
  //thu học phí
  searchOrderKids(date, status, idClass, fullName, walletStatus) {
    return http.get(
      `/fn/fees/order/search?date=${date}&status=${status}&idClass=${idClass}&fullName=${fullName}&walletStatus=${walletStatus}`
    );
  }
  getOrderKidsDetail(idOrder) {
    return http.get(`/fn/fees/order/detail/${idOrder}`);
  }
  saveOrderKidsDescription(idOrder, data) {
    return http.put(`/fn/fees/order/description/${idOrder}`, data);
  }
  findKidsPackagePaymentDetail(idKidsPackage) {
    return http.get(`/fn/fees/order/history/kids-package/${idKidsPackage}`);
  }
  searchOrderKidsMonth(idKid, year) {
    return http.get(`/fn/fees/order/month/search?idKid=${idKid}&year=${year}`);
  }
  searchOrderKidsAll(idKid, year) {
    return http.get(`/fn/fees/order/kids/search?idKid=${idKid}&year=${year}`);
  }
  generateOrderKids(data) {
    return http.post(`/fn/fees/order/generate`, data);
  }
  sendNotifyFees(data) {
    return http.put(`/fn/fees/order/notify`, data);
  }
  setViewOrder(data) {
    return http.put(`/fn/fees/order/view/one`, data);
  }
  setLockedOrder(data) {
    return http.put(`/fn/fees/order/locked/one`, data);
  }
  setViewOrderMany(data) {
    return http.put(`/fn/fees/order/view/many`, data);
  }
  setViewOrderManyNoSMS(data) {
    return http.put(`/fn/fees/order/notify/app`, data);
  }
  setLockedOrderMany(data) {
    return http.put(`/fn/fees/order/locked/many`, data);
  }
  searchOrderKidsCasher(idOrder, idKid, category) {
    return http.get(
      `/fn/fees/order/payment/${idOrder}?idKid=${idKid}&category=${category}`
    );
  }
  OrderPrint(idKid, category, idList) {
    return http.get(
      `/fn/fees/order/print?idKid=${idKid}&category=${category}&idList=${idList}`
    );
  }
  OrderPrintMany(request) {
    return http.put(
      `/fn/fees/order/print/many`, request
    );
  }
  OrderPrintOut(idKid, category, idList) {
    return http.get(
      `/fn/fees/order/print/out?idKid=${idKid}&category=${category}&idList=${idList}`
    );
  }
  OrderPrintIn(idKid, category, idList) {
    return http.get(
      `/fn/fees/order/print/in?idKid=${idKid}&category=${category}&idList=${idList}`
    );
  }
  orderKidsPayment(idOrder, data) {
    return http.put(`/fn/fees/order/payment/${idOrder}`, data);
  }
  findOrderKidsHistory(idOrder) {
    return http.get(`/fn/fees/order/history/${idOrder}`);
  }
  findOrderKidsHistoryDetail(idOrderHistory) {
    return http.get(`/fn/fees/order/history/detail/${idOrderHistory}`);
  }
  printOrderKids(idOrder, idList) {
    return http.get(`/pdfn/kids/order/${idOrder}?idList=${idList}`);
  }

  //quản lý ví
  searchWalletParent(status, idClass, fullName) {
    return http.get(
      `/fn/fees/wallet/search?status=${status}&idClass=${idClass}&fullName=${fullName}`
    );
  }
  searchWalletParentUnConfirm() {
    return http.get("/fn/fees/wallet/search-unconfirm");
  }
  createWalletParentHisotry(data) {
    return httpMultipart.post(`/fn/fees/wallet/history/create`, data);
  }
  confirmWalletParentHisotry(id) {
    return httpMultipart.put(`/fn/fees/wallet/history/confirm/${id}`);
  }
  getBankInfo() {
    return http.get(`/fn/fees/bank/info`);
  }
  getWalletParentHistory(
    pageNumber,
    maxPageItem,
    idWalletParent,
    dateList,
    category,
    type,
    status
  ) {
    return http.get(
      `/fn/fees/wallet-history/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idWalletParent=${idWalletParent}&dateList=${dateList}&category=${category}&type=${type}&status=${status}`
    );
  }
  getWalletParentHistoryFalse(idWalletParent) {
    return http.get(`/fn/fees/wallet-history/search-false?idWalletParent=${idWalletParent}`);
  }
  statisticalWalletParent(pageNumber, maxPageItem, code, type, kidName) {
    return http.get(
      `/fn/fees/wallet/statistical/search?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&code=${code}&type=${type}&kidName=${kidName}`
    );
  }
  findKidsByName(fullName) {
    return http.get(`/fn/fees/kids/search?fullName=${fullName}`);
  }
  deleteWalletParentHistoryById(id) {
    return http.delete(`/fn/fees/wallet/history/${id}`);
  }
  //thống kê chung
  statisticalCommon(year, startMonth, endMonth) {
    return http.get(
      `/fn/fees/order/statistical/common?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}`
    );
  }
  //thống kê mini
  statisticalCommonMini(year, startMonth, endMonth, idClass, status) {
    return http.get(
      `/fn/fees/order/statistical/mini?year=${year}&startMonth=${startMonth}&endMonth=${endMonth}&idClass=${idClass}&status=${status}`
    );
  }
  //Export excel
  exportWalletExcel(idList) {
    return http.get(
      `/fn/fees/wallet/excel?idList=${idList}`
    );
  }
  exportWalletExcelPro(status, idClass) {
    return http.get(
      `/fn/fees/wallet/excel-proviso?status=${status}&idClass=${idClass}`
    );
  }
  getCycleMoneyService() {
    return http.get(`/fn/cycle-money`);
  }
  updateCycleMoneyService(data) {
    return http.put(`/fn/cycle-money`, data);
  }
  exportExcelOrderService(idClass, date, idKidList) {
    return http.get(`/fn/fees/order/excel?idClass=${idClass}&date=${date}&idKidList=${idKidList}`);
  }
  exportExcelOrderNowService(idClass, date, idKidList) {
    return http.get(`/fn/fees/order/excel/now?idClass=${idClass}&date=${date}&idKidList=${idKidList}`);
  }

}

export default new FnFeesService();
