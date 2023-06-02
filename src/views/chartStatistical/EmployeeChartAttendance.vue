<template>
  <div>
    <!-- chọn phòng ban -->
    <el-select
      class="button-left"
      style="width: 140px; margin-right: 5px"
      v-model="dataSearch.idDepartment"
      @change="searchByProperties()"
      placeholder="Phòng ban"
      clearable
    >
      <el-option
        v-for="item in departmentList"
        :key="item.id"
        :label="item.departmentName"
        :value="item.id"
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
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Đi làm: {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Nghỉ có phép: {{ this.loda.sumBy(this.dataList2) }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-chat-line-square"></i>
              Nghỉ không phép: {{ this.loda.sumBy(this.dataList3) }}
            </div>
          </div></el-col
        >
      </el-row>
      <spinner-custom v-if="loadChart" />
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
import DepartmentDataService from "@/services/DepartmentDataService";
import ChartLine from "./chart/ChartLine.vue";

export default {
  components: { ChartLine },
  data() {
    return {
      dataConllection: null,
      loaded: false,
      loadChart: false,
      dateListSelect: [
        { key: "date", value: "Theo ngày" },
        { key: "week", value: "Theo tuần" },
        { key: "month", value: "Theo tháng" },
        { key: "year", value: "Theo năm" },
      ],
      departmentList: [],
      dataSearch: {
        idDepartment: "",
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
    };
  },
  async mounted() {
    this.fillData();
    this.loaded = false;
    await this.fetchDataMany();
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    fillData() {
      this.dataConllection = {
        chartData: {
          labels: this.dataLabels,
          datasets: [
            {
              label: "Đi làm",
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
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Trạng thái chấm công",
            fontSize: 20,
            fontColor: "#000",
          },
          plugins: {
            zoom: {
              zoom: {
                enabled: true,
                mode: "x",
                speed: 1,
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
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
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
      ChartStatisticalService.findAttendanceEmployee(
        this.dataSearch.idDepartment,
        this.dataSearch.type,
        this.dataSearch.dateList,
        this.dataSearch.week,
        this.dataSearch.month,
        this.dataSearch.year
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataLabels = [];
          let attendance = [];
          let attendanceYes = [];
          let attendanceNo = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            dataLabels.push(e.name);
            attendance.push(e.attendance);
            attendanceYes.push(e.attendanceYes);
            attendanceNo.push(e.attendanceNo);
          }
          this.dataLabels = dataLabels;
          this.dataList1 = attendance;
          this.dataList2 = attendanceYes;
          this.dataList3 = attendanceNo;
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
      this.getDepartment();
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
