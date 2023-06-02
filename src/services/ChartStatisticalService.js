import http from "../http-common";

class ChartStatisticalService {

    //thống kê trạng thái học sinh
    findAllChartKidsStatus(){
        return http.get("/chart/statistical/chart-status");
    }
    findStuddingChartKidsStatus(date){
        return http.get(`/chart/statistical/chart-status/studding?date=${date}`);
    }
    findFiveChartKidsStatus(year){
        return http.get(`/chart/statistical/chart-status/five-status?year=${year}`);
    }
    findFistMonthChartKidsStatus(year){
        return http.get(`/chart/statistical/chart-status/fist-month?year=${year}`);
    }
    findDetailChartKidsStatus(typeSchool){
        return http.get(`/chart/statistical/chart-status/detail?typeSchool=${typeSchool}`);
    }
    exportExcelStatusKids(year){
        return http.get(`/chart/statistical/chart-status/excel?year=${year}`);
    }

    //thống kê điểm danh học sinh
    findAttendanceKids(idGrade, idClass, type, dateList, week, month, year){
        return http.get(`/chart/statistical/attendance?idGrade=${idGrade}&idClass=${idClass}&type=${type}&dateList=${dateList}&week=${week}&month=${month}&year=${year}`);
    }

    //thống kê nhaanjk xét học sinh
    findEvaluateKids(idGrade, idClass, type, dateList, weekList, monthList){
        return http.get(`/chart/statistical/evaluate?idGrade=${idGrade}&idClass=${idClass}&type=${type}&dateList=${dateList}&weekList=${weekList}&monthList=${monthList}`);
    }

    //thống kê album ảnh
    findAlbumKids(typeSchool, date){
        return http.get(`/chart/statistical/album?typeSchool=${typeSchool}&date=${date}`);
    }
    findAlbumDateKids(idGrade, idClass, dateList){
        return http.get(`/chart/statistical/album/date?idGrade=${idGrade}&idClass=${idClass}&dateList=${dateList}`);
    }
    findAlbumSchoolDateKids(dateList){
        return http.get(`/chart/statistical/album/school?dateList=${dateList}`);
    }

    //thống kê học phí
    findFeesKids(year){
        return http.get(`/chart/statistical/fees?year=${year}`);
    }

    //thống kê trạng thái nhân sự
    findAllChartEmployeeStatus(type){
        return http.get(`/chart/statistical/chart-status-employee?type=${type}`);
    }
    //Thống kê 4 trạng thái nhân sự
    findFourChartEmployeeStatus(year){
        return http.get(`/chart/statistical/chart-status-employee/four-status?year=${year}`);
    }
    //export excel employee
    exportExcelStatusEmployee(year){
        return http.get(`/chart/statistical/chart-status-employee/excel?year=${year}`);
    }

    //thống kê điểm danh nhân sự
    findAttendanceEmployee(idDepartment, type, dateList, week, month, year){
        return http.get(`/chart/statistical/attendance-employee?idDepartment=${idDepartment}&type=${type}&dateList=${dateList}&week=${week}&month=${month}&year=${year}`);
    }

    //thống kê công lương
    findFinaceEmployee(year){
        return http.get(`/chart/statistical/finace?year=${year}`);
    }

    //thống kê thu chi nội bộ
    findCashInternalPayMoney(year){
        return http.get(`/chart/statistical/cashinternal-paymoney?year=${year}`);
    }

    //thống kê quyx
    findCashInternalCashbook(year){
        return http.get(`/chart/statistical/cashinternal-cashbook?year=${year}`);
    }
    findCashInternalCashbookDetail(year){
        return http.get(`/chart/statistical/cashinternal-cashbook-history?year=${year}`);
    }
    //thống kê ví
    findWalletParent(year, type){
        if(type=='money'){
            return http.get(`/chart/statistical/wallet?year=${year}`);
        }else{
            return http.get(`/chart/statistical/wallet-status?year=${year}`);
        }
    }
}

export default new ChartStatisticalService();