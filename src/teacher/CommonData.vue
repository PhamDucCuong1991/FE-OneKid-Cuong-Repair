<template>
  <div style="padding: 5px">
    <spinner-custom style="margin-top: 100px" v-if="showSpinner" />
    <div v-else>
      <div>
        <div>
          Chọn ngày:
          <el-date-picker
            v-model="dataSearch.date"
            :picker-options="pickerOptions"
            type="date"
            style="width: 140px"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            :clearable="false"
            @change="fetchData()"
          ></el-date-picker>
        </div>
      </div>
      <!-- <el-button
        type="primary"
        @click="logoutMethod()"
        size="medium"
        style="float: right; margin-top: -50px"
        >Đăng xuất</el-button
      > -->

      <br />
      <div>
        <div class="data-arrive">Điểm danh đi học theo khối</div>
        <el-table
          :data="responseData.statisticalAttendanceArriveGradeList"
          highlight-current-row
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          show-summary
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column min-width="75px" prop="name" label="Khối"></el-table-column>
          <el-table-column
            min-width="75px"
            prop="studyingNumber"
            label="Đang học"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goSchoolNumber"
            label="Đi học"
            min-width="65px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="absentNumber"
            label="Nghỉ học"
            min-width="65px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="noAttendance"
            label="Chưa điểm danh"
            min-width="105px"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <br />
      <div>
        <div class="data-arrive">Điểm danh đi học theo lớp</div>
        <el-table
          :data="responseData.statisticalAttendanceArriveClassList"
          highlight-current-row
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          show-summary
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column min-width="75px" prop="name" label="Lớp"></el-table-column>
          <el-table-column
            min-width="75px"
            prop="studyingNumber"
            label="Đang học"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goSchoolNumber"
            label="Đi học"
            min-width="65px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="absentNumber"
            label="Nghỉ học"
            min-width="65px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="noAttendance"
            label="Chưa điểm danh"
            min-width="105px"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <br />
      <div>
        <div class="data-eat">Điểm danh ăn theo khối</div>
        <el-table
          :data="responseData.statisticalAttendanceEatGradeList"
          highlight-current-row
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          show-summary
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column min-width="75px" prop="name" label="Khối"></el-table-column>
          <el-table-column
            min-width="65px"
            prop="allDay"
            label="Cả ngày"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="breakfast"
            label="Sáng"
            min-width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="secondBreakfast"
            label="Phụ sáng"
            min-width="70px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lunch"
            label="Trưa"
            min-width="60px"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="afternoon"
            label="Chiều"
            min-width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="secondAfternoon"
            label="Phụ chiều"
            min-width="75px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="dinner"
            label="Tối"
            min-width="60px"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <br />
      <div>
        <div class="data-eat">Điểm danh ăn theo lớp</div>
        <el-table
          :data="responseData.statisticalAttendanceEatClassList"
          highlight-current-row
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          show-summary
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column min-width="75px" prop="name" label="Lớp"></el-table-column>
          <el-table-column
            min-width="65px"
            prop="allDay"
            label="Cả ngày"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="breakfast"
            label="Sáng"
            min-width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="secondBreakfast"
            label="Phụ sáng"
            min-width="70px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lunch"
            label="Trưa"
            min-width="60px"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="afternoon"
            label="Chiều"
            min-width="60px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="secondAfternoon"
            label="Phụ chiều"
            min-width="75px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="dinner"
            label="Tối"
            min-width="60px"
            align="center"
          ></el-table-column>
        </el-table>
        <br />
        <br />
      </div>
    </div>
  </div>
</template>
<script>
import StatisticalDataService from "@/servicesteacher/StatisticalDataService";
export default {
  data() {
    return {
      showSpinner: true,
      responseData: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      dataSearch: {
        date: this.moment(new Date()).format("YYYY-MM-DD"),
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    fetchData() {
      StatisticalDataService.statisticalDataTeacher(this.dataSearch.date)
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          this.showSpinner = false;
        });
    },
  },
  beforeMount() {
    this.fetchData();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table th > .cell {
  text-align: center;
  font-size: 11px;
}
/deep/.el-table td > .cell {
  font-size: 11px;
}
.data-arrive {
  padding: 7px;
  border-radius: 5px;
  background: yellowgreen;
}
.data-eat {
  padding: 7px;
  border-radius: 5px;
  background: #ddbd52;
}
</style>
