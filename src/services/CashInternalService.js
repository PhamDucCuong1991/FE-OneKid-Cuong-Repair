import http from "../http-common";

class CashInternalService {

    searchPeopleType(pageNumber, maxPageItem,type,nameOrPhone) {
        return http.get(`/fn/cashinternal/people/list?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&type=${type}&nameOrPhone=${nameOrPhone}`);
    }
    getById(id) {
        return http.get(`/fn/cashinternal/people/${id}`);
    }
    createPeopleType(data) {
        return http.post("/fn/cashinternal/people", data);
    }
    updatePeopleType(data) {
        return http.put("/fn/cashinternal/people", data);
    }
    deletePeopleType(id) {
        return http.delete(`/fn/cashinternal/people/${id}`);
    }
    findByTypeInteral() {
        return http.get("/fn/cashinternal/search-type");
    }
    findBankInfo() {
        return http.get("/fn/cashinternal/bank");
    }
    createCashInternalOut(data) {
        return http.post("/fn/cashinternal/out/create", data);
    }
    createCashInternalIn(data) {
        return http.post("/fn/cashinternal/in/create", data);
    }
    createBankInfo(data) {
        return http.post("/fn/cashinternal/bank", data);
    }
    updatBankInfo(data) {
        return http.put("/fn/cashinternal/bank", data);
    }
    updateCash(id,data) {
        return http.put(`/fn/cashinternal/update-cash/${id}`, data);
    }
 
    getByIdBank(id) {
        return http.get(`/fn/cashinternal/bank/${id}`);
    }

    deleteBankInfo(id) {
        return http.delete(`/fn/cashinternal/bank/${id}`);
    }
    updateBankChecked(data) {
        return http.put(`/fn/cashinternal/bank/checked`, data);
    }
    testpdf(){
        return http.get(`/report/product`);
    }
    updateSchoolDescription(data) {
        return http.put(`/fn/cashinternal/school-description-bank`, data);
    }
    searchInteralPay(pageNumber, maxPageItem, dateStartEnd, status,code) {
        return http.get(`/fn/cashinternal/out/list?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}&status=${status}&code=${code}`);
    }
    searchcollectcash(pageNumber, maxPageItem, dateStartEnd, status, code) {
        return http.get(`/fn/cashinternal/in/list?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&dateStartEnd=${dateStartEnd}&status=${status}&code=${code}`);
    }
    updateApproveManyIn(data) {
        return http.put(`/fn/cashinternal/in/approved/many`, data);
    }
    cancelManyIn(data) {
        return http.put(`/fn/cashinternal/in/cancel/many`, data);
    }
    cancelManyOut(data) {
        return http.put(`/fn/cashinternal/out/cancel/many`, data);
    }
    updateApproveManyOut(data) {
        return http.put(`/fn/cashinternal/out/approved/many`, data);
    }
    updateApproveIn(id, status) {
        return http.put(`/fn/cashinternal/in/approved/${id}?status=${status}`);
    }
    updatePaymentIn(id) {
        return http.put(`/fn/cashinternal/in/payment/${id}`);
    }
    updatePaymentOut(id) {
        return http.put(`/fn/cashinternal/out/payment/${id}`);
    }
    updateApproveOut(id,status) {
        return http.put(`/fn/cashinternal/out/approved/${id}?status=${status}`);
    }
    updatepayment(data) {
        return http.put(`/fn/cashinternal/update-payment`, data);
    }

    getByIdCashinternal(id) {
        return http.get(`/fn/cashinternal/detail/${id}`);
    }

    // cashbook
    findCashBook() {
        return http.get(`/fn/cashinternal/cashbook`);
    }
    searchCashBookHistory(pageNumber, maxPageItem, idCashBook, type, month, dateList) {
        return http.get(`/fn/cashinternal/cashbook/history?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idCashBook=${idCashBook}&type=${type}&month=${month}&dateList=${dateList}`);
    }
    //năm hiện tại
    searchCashBookHistoryNow(pageNumber, maxPageItem, idCashBook, type, month, dateList, typeCashbook) {
        return http.get(`/fn/cashinternal/cashbook/history-now?pageNumber=${pageNumber}&maxPageItem=${maxPageItem}&idCashBook=${idCashBook}&type=${type}&month=${month}&dateList=${dateList}&typeCashbook=${typeCashbook}`);
    }
    searchCashBookHistoryYear(year, type, month, dateList) {
        return http.get(`/fn/cashinternal/cashbook/history-year/${year}?pageNumber=1&maxPageItem=1&idCashBook=1&type=${type}&month=${month}&dateList=${dateList}&typeCashbook=KID`);
    }

    //thống kê
    getOutCashinternalMoney(type, category, month, dateList){
        return http.get(`/fn/cashinternal/out/total?&type=${type}&category=${category}&month=${month}&dateList=${dateList}`);
    }
    
   
}

export default new CashInternalService();