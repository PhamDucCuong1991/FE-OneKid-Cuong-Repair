import http from "../http-common";

class StatisticalDataService {
    statisticalDataTeacher(date) {
        return http.get(`/teacher/common/statistical?date=${date}`);
    }

}

export default new StatisticalDataService();