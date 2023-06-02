import http from "../http-common";
import httpFile from "../http-multipart";
class TestService {
  getAllInfoData() {
    return http.get("/test/test-get-upload");
  }
  test1(file) {
    let formData = new FormData();
    formData.append("file", file);
    return httpFile.post(`/test/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
  getById(id) {
    return http.get(`/appsend/${id}`);
  }
  searchAppSend(userUnread, dateStartEnd, sendContent) {
    return http.get(`/appsend/search?userUnread=${userUnread}&dateStartEnd=${dateStartEnd}&sendContent=${sendContent}`);
  }
}
export default new TestService();