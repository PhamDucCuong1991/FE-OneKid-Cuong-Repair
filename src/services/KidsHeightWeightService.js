import http from "../http-common";

class KidsHeightWeight {
  getDetailKidsMethod

  getById(id) {
    return http.get(`/kid-quality/${id}`);
  }

  getHeightWeightSample(id) {
    return http.get(`/kid-quality/sample/${id}`);
  }
  getHeightSample() {
    return http.get(`/kid-quality/heightsample`);
  }
  create(data) {
    return http.post("/kid-quality", data);
  }

  update(id, data) {
    return http.put(`/grade/${id}`, data);
  }

  delete(id) {
    return http.delete(`/kid-quality/weight/${id}`);
  }
  delete1(id) {
    return http.delete(`/kid-quality/height/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }

  searchWeightHeight(date, status, idGrade, idClass, codeOrName) {
    return http.get(`/kid-quality/search?date=${date}&status=${status}&idGrade=${idGrade}&idClass=${idClass}&codeOrName=${codeOrName}`);
  }

  //export excel
  getExportExcelWeightHeight(list){
    return http.get(`/kid-quality/export-height-weight-all-v3?idList=${list}`);
  }
  getExportExcelNew(list, idClass, date){
    return http.get(`/kid-quality/export-height-weight-month-final?idList=${list}&idClass=${idClass}&date=${date}`);
  }
}

export default new KidsHeightWeight();