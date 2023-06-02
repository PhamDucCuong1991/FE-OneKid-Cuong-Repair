<template>
  <div>
    <!-- chọn khối -->
    <el-select
        v-if="this.getAppTypeUserLogin == 'plus'"
        class="button-left-status"
        style="width: 140px"
        :clearable="true"
        v-model="dataSearch.idGrade"
        @change="searchDataMethod()"
        placeholder="Chọn khối"
    >
      <el-option
          v-for="item in gradeOfSchoolList"
          :key="item.id"
          :value="item.id"
          :label="item.gradeName"
      ></el-option>
    </el-select>

    <!-- chọn lớp -->
    <el-select
        class="button-left-status"
        style="width: 140px"
        filterable
        :clearable="this.getAppTypeUserLogin == 'plus'"
        v-model="dataSearch.idClass"
        placeholder="Chọn lớp"
        @change="searchByProperties()"
    >
      <el-option
          v-for="item in classOfGradeList"
          :key="item.id"
          :value="item.id"
          :label="item.className"
      ></el-option>
    </el-select>
    <!-- chọn trạng thái -->
    <el-select
        style="width: 140px"
        class="button-left-status"
        v-model="dataSearch.type"
        @change="searchByProperties()"
        placeholder="Kiểu xem"
    >
      <el-option
          v-for="item in dateListSelect"
          :key="item.key"
          :value="item.key"
          :label="item.value"
      ></el-option>
    </el-select>
    <span>
      <el-date-picker
          v-if="dataSearch.type == 'date'"
          :clearable="false"
          class="button-left-status"
          style="width: 265px"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataSearch.dateList"
          type="daterange"
          unlink-panels
          range-separator="-"
          @change="searchByProperties()"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
    </span>
    <el-date-picker
        :clearable="false"
        v-if="dataSearch.type == 'week'"
        class="button-left-status"
        style="width: 215px"
        value-format="yyyy-MM-dd"
        format="Tuần WW(từ dd-MM-yyyy)"
        v-model="dataSearch.week"
        type="week"
        @change="searchByProperties()"
        placeholder="Chọn tuần"
    >
    </el-date-picker>
    <el-date-picker
        :clearable="false"
        v-else-if="dataSearch.type == 'month'"
        class="button-left-status"
        style="width: 130px"
        value-format="yyyy-MM-dd"
        v-model="dataSearch.month"
        type="month"
        @change="searchByProperties()"
        placeholder="Chọn tháng"
    >
    </el-date-picker>
    <el-date-picker
        :clearable="false"
        v-if="dataSearch.type == 'year'"
        class="button-left-status"
        style="width: 130px"
        value-format="yyyy-MM-dd"
        v-model="dataSearch.year"
        type="year"
        @change="searchByProperties()"
        placeholder="Chọn năm"
    >
    </el-date-picker>

    <!-- style="background-color: #eff8ff" -->
    <div style="margin-top: 20px">
      <el-row :gutter="50" style="margin-bottom: 10px">
        <el-col :span="6" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Đi học: {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div>
        </el-col
        >
        <el-col :span="6" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Nghỉ có phép: {{ this.loda.sumBy(this.dataList2) }}
            </div>
          </div>
        </el-col
        >
        <el-col :span="6" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-chat-line-square"></i>
              Nghỉ không phép: {{ this.loda.sumBy(this.dataList3) }}
            </div>
          </div>
        </el-col
        >
        <el-col :span="6" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-4">
              <i class="el-icon-edit-outline"></i>
              Chưa điểm danh: {{ this.loda.sumBy(this.dataList4) }}
            </div>
          </div>
        </el-col
        >
      </el-row>
      <spinner-custom v-if="loadChart"/>
      <div v-else>
        <ChartLine
            v-if="loaded"
            :chartData="dataConllection.chartData"
            :options="dataConllection.options"
        ></ChartLine>
      </div>
    </div>
  </div>
</template>

<script>
import ChartStatisticalService from "@/services/ChartStatisticalService";
import TeacherService from "@/services/TeacherService";
import ChartLine from "./chart/ChartLine.vue";
import {mapState, mapActions} from "vuex";

export default {
  components: {ChartLine},
  data() {
    return {
      dataConllection: null,
      loaded: false,
      loadChart: false,
      dateListSelect: [
        {key: "date", value: "Theo ngày"},
        {key: "week", value: "Theo tuần"},
        {key: "month", value: "Theo tháng"},
        {key: "year", value: "Theo năm"},
      ],
      gradeOfSchoolList: [],
      classOfGradeList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        type: "date",
        dateList: [
          this.moment().subtract(9, "days").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
        week: this.moment().startOf("isoWeek").format("YYYY-MM-DD"),
        month: this.moment().startOf("month").format("YYYY-MM-DD"),
        year: this.moment().startOf("year").format("YYYY-MM-DD"),
      },
      dataLabels: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      dataList1: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
      dataList2: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      dataList3: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
      dataList4: [300, 700, 2000, 5500, 6000, 3000, 2000, 1000, 200, 100],
    };
  },
  async mounted() {
    this.fillData();
    this.loaded = false;
    // await this.searchByProperties();
    await this.fetchDataMany();
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    fillData() {

      this.dataConllection = {
        chartData: {
          labels: this.dataLabels,
          datasets: [
            {
              label: "Đi học",
              data: this.dataList1,
              borderColor: "#6aa5e3",
              fill: false,
            },
            {
              label: "Nghỉ có phép",
              data: this.dataList2,
              borderColor: "orange",
              fill: false,
            },
            {
              label: "Nghỉ không phép",
              data: this.dataList3,
              borderColor: "#ef5b5b",
              fill: false,
            },
            {
              label: "Chưa điểm danh",
              data: this.dataList4,
              borderColor: "black",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Tình trạng điểm danh",
            fontSize: 20,
            fontColor: "#000",
          },
          plugins: {
            zoom: {
              zoom: {
                enabled: true,
                mode: "x",
                speed: 1,
                modifierKey: "ctrl",
              },
              pan: {
                enabled: true,
                mode: "x",
              },
            },
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  min: 0,
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
    },
    async searchDataMethod() {
      await this.getClassInGrade();
      this.searchByProperties();
    },
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {

      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])
    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
          .then((resp) => {
            this.classOfGradeList = resp.data.data;
            this.dataSearch.idClass = this.classOfGradeList.filter(
                (x) => x.checked
            )[0].id;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    checkDateList() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = "";
      }
      if (this.dataSearch.week == null) {
        this.dataSearch.week = "";
      }
      if (this.dataSearch.month == null) {
        this.dataSearch.month = "";
      }
      if (this.dataSearch.year == null) {
        this.dataSearch.year = "";
      }
    },

    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.checkDateList();
      this.loadChart = true;
      ChartStatisticalService.findAttendanceKids(
          this.dataSearch.idGrade,
          this.dataSearch.idClass,
          this.dataSearch.type,
          this.dataSearch.dateList,
          this.dataSearch.week,
          this.dataSearch.month,
          this.dataSearch.year
      )
          .then((resp) => {
            let results = null;
            if (this.getAppTypeUserLogin == "teacher") {
              results = this.dataSearch.idClass != "" ? resp.data.data : [];
            } else {
              results = resp.data.data;
            }
            let dataLabels = [];
            let attendance = [];
            let attendanceYes = [];
            let attendanceNo = [];
            var attendanceUn = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              dataLabels.push(e.name);
              attendance.push(e.attendance);
              attendanceYes.push(e.attendanceYes);
              attendanceNo.push(e.attendanceNo);
              attendanceUn.push(e.attendanceUn);
            }
            this.dataLabels = dataLabels;
            this.dataList1 = attendance;
            this.dataList2 = attendanceYes;
            this.dataList3 = attendanceNo;
            this.dataList4 = attendanceUn;
            this.loaded = true;
            this.fillData();
          })
          .catch(() => {
            this.$message({
              message: "Failed to get the data",
              type: "error",
            });
            this.loadChart = false;
          })
          .finally(() => {
            setTimeout(() => {
              this.loadChart = false;
            }, 500);
          });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await Promise.all([this.getClassListTeacher()]);
      }
      this.searchByProperties();
    },
  },
  // beforeMount() {
  //   this.fetchDataMany();
  // },
};
</script>
<style lang="scss" scoped>
.button-left-status {
  margin-right: 5px;
}

.content-line {
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.content-line-1 {
  padding: 6px;
  margin-bottom: 5px;
  border-radius: 5px;
}

.color-1 {
  background: #6aa5e3;
}

.color-2 {
  background: orange;
}

.color-3 {
  background: #ef5b5b;
}

.color-4 {
  background: #191717e8;
}
</style>
