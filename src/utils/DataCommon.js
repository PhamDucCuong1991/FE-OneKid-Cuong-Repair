export const funcData = {
    //add for employee
    getAttendanceEmployeeTypeFuncList() {
        return [
            { key: "goWork", value: "Điểm danh đi làm" },
            { key: "goWorkDateToDate", value: "Đi làm chi tiết" },
            { key: "goSchool", value: "Điểm danh đến" },
            { key: "leave", value: "Điểm danh về" },
            { key: "absentYes", value: "Nghỉ có phép" },
            { key: "absentNo", value: "Nghỉ không phép" },
            { key: "absentCommon", value: "Nghỉ chung(CP+Ko phép)" },
            { key: "absentDateToDate", value: "Nghỉ làm chi tiết" },
            { key: "eat", value: "Điểm danh ăn" },
        ];
    },
    getAttendanceEmployeeFuncList() {
        return [
            { key: "morning", value: "Buổi sáng" },
            { key: "afternoon", value: "Buổi chiều" },
            { key: "evening", value: "Buổi tối" },
            { key: "allDay", value: "Cả ngày1" },
            { key: "goSchoolTime", value: "Đi làm(cả ngày+nửa buổi)" },
        ];
    },
    getAbsentCommonFuncList() {
        return [{ key: "absentTime", value: "Cả ngày + Nửa ngày" }];
    },
    getAbsentDateToDateDetailList() {
        return [
            { key: "absentDateToDateNo26", value: "Nghỉ làm T.2-T.6(Ko P)" },
            { key: "absentDateToDateYesNo26", value: "Nghỉ làm T.2-T.6(Co P+Ko P)" },
            { key: "absentDateToDateNo78", value: "Nghỉ làm T.7&CN(Ko P)" },
            { key: "absentDateToDateYesNo78", value: "Nghỉ làm T.7&CN(Co P+Ko P)" },
        ];
    },
    getGoWorkDateToDateDetailList() {
        return [
            { key: "goWorkDataToDate26", value: "T.2-T.6(Cả ngày+Nửa ngày)" },
            { key: "goWorkDataToDate78", value: "T.7&CN(Cả ngày+Nửa ngày)" }
        ];
    },

    //add for kids
    getAttendanceDetailArriveInList() {
        return [
            { key: "arriveGoSchool", value: "Thu tiền đi học theo lịch" },
            { key: "arriveGoSchool27", value: "Thu tiền từ T.2->T.6 + T.7" },
            { key: "arriveGoSchool26", value: "Chỉ thu T.2->T.6" },
            { key: "arriveGoSchool7", value: "Chỉ thu T.7" },
        ]
    },

    getAttendanceDetailArriveOutList() {
        return [
            { key: "arriveAbsentYes", value: "Trả lại tiền nghỉ có phép" },
            { key: "arriveAbsentNo", value: "Trả lại tiền nghỉ không phép" },
            { key: "arriveAbsentYesNo27", value: "Trả lại tiền nghỉ T.2-T7(Có P+Ko P)" },
            { key: "arriveAbsentYes26", value: "Trả lại tiền nghỉ T.2-T.6(Có P)" },
            { key: "arriveAbsentYesNo26", value: "Trả lại tiền nghỉ T.2-T.6(Có P+Ko P)" },
            { key: "arriveAbsentYes7", value: "Trả lại tiền nghỉ T.7(Có P)" },
            { key: "arriveAbsentYesNo7", value: "Trả lại tiền nghỉ T.7(Có P+Ko P)" },
        ]
    },

    getAttendanceGoSchooList() {
        return [
            { key: "morning", value: "Buổi sáng" },
            { key: "afternoon", value: "Buổi chiều" },
            { key: "evening", value: "Buổi tối" },
            { key: "allDay", value: "Cả ngày" },
            { key: "onlySartuday", value: "Chỉ tính T.7(Tháng hiện tại)" },
            { key: "onlySartudayBefore", value: "Chỉ tính T.7(Tháng trước)" },
        ];
    },

    funcAttendanceTypeNewList() {
        return [
            { key: "eatNew", value: "Điểm danh ăn" },
            { key: "arriveNew", value: "Điểm danh đi học" },
        ];
    },

    getRoleListExcel() {
        return [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "AA",
            "AB",
            "AC",
            "AD",
            "AE",
            "AF",
            "AG",
            "AH",
            "AI",
            "AJ",
            "AK",
            "AL",
            "AM",
            "AN",
            "AO",
            "AP",
            "AQ",
            "AR",
            "AS",
            "AT",
            "AU",
            "AV",
            "AW",
            "AX",
            "AY",
            "AZ",//52
            "BA",
            "BB",
            "BC",
            "BD",
            "BE",
            "BF",
            "BG",
            "BH",
            "BI",
            "BJ",
            "BK",
            "BL",
            "BM",
            "BN",
            "BO",
            "BP",
            "BQ",
            "BR",
            "BS",
            "BT",
            "BU",
            "BV",
            "BW",
            "BX",
            "BY",
            "BZ",//78
            "CA",
            "CB",
            "CC",
            "CD",
            "CE",
            "CF",
            "CG",
            "CH",
            "CI",
            "CJ",
            "CK",
            "CL",
            "CM",
            "CN",
            "CO",
            "CP",
            "CQ",
            "CR",
            "CS",
            "CT",
            "CU",
            "CV",
            "CW",
            "CX",
            "CY",
            "CZ",
            "DA",
            "DB",
            "DC",
            "DD",
            "DE",
            "DF",
            "DG",
            "DH",
            "DI",
            "DJ",
            "DK",
            "DL",
            "DM",
            "DN",
            "DO",
            "DP",
            "DQ",
            "DR",
            "DS",
            "DT",
            "DU",
            "DV",
            "DW",
            "DX",
            "DY",
            "DZ",//130
        ]
    },
    getAttendanceDetailOutNewList() {
        return [
            { key: "eatBreakfastOut1", value: "Trả lại tiền bữa sáng (1)" },
            { key: "eatRemainOut1", value: "Trả lại tiền bữa còn lại (1)" },
            { key: "eatDayOut2", value: "Trả lại tiền gói một ngày (2)" },
            { key: "eatBreakfastOut2", value: "Trả lại tiền bữa sáng (2)" },
            { key: "eatRepayDinner26", value: "Trả lại tiền ăn tối (T2-T6)" },
        ];
    },

    getKidsStatusList() {
        return [
          { key: "STUDYING", value: "Đang học" },
          { key: "STUDY_WAIT", value: "Chờ học" },
          { key: "RESERVE", value: "Bảo lưu" },
          { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
        ]
    },

    getMonthList(){ 
        return[
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ]
    }
}