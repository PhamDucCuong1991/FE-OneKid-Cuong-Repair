import http from "../http-common";
class DashboardService {
    getStatisticalInSchool() {
      return http.get("/home/statistical");
    }
    getStatisticalInClass() {
        return http.get("/home/statistical/class");
      }
  }
  
  export default new DashboardService();