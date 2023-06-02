<template>
  <div>
    <el-row :gutter="50">
      <el-col :span="6">
        <div class="grid-content-over bg-over-1">
          <div class="content-line-1 color-1">
            <i class="el-icon-user-solid"></i>
            Tổng số học sinh: {{ statisticalData.kidsTotal.total }}
          </div>
          <div class="content-line-1 color-1">
            <i class="el-icon-user-solid"></i>
            Số học sinh đang học: {{ statisticalData.kidsTotal.study }}
          </div>
          <div class="content-line-1 color-1">
            <i class="el-icon-user-solid"></i>
            Số học sinh bảo lưu: {{ statisticalData.kidsTotal.reserve }}
          </div>
          <div class="content-line-1 color-1">
            <i class="el-icon-user-solid"></i>
            Số học sinh chờ học: {{ statisticalData.kidsTotal.wait }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content-over bg-over-2">
          <div class="content-line-1 color-2">
            <i class="el-icon-document-checked"></i>
            Đã điểm danh: {{ statisticalData.attendanceTotal.attendaceYes }}
          </div>
          <div class="content-line-1 color-2">
            <i class="el-icon-document-delete"></i>
            Chưa điểm danh: {{ statisticalData.attendanceTotal.attendaceNo }}
          </div>
          <div class="content-line-1 color-2">
            <i class="el-icon-tableware"></i>
            Đã điểm danh ăn:
            {{ statisticalData.attendanceTotal.attendanceEatYes }}
          </div>
          <div class="content-line-1 color-2">
            <i class="el-icon-tableware"></i>
            Chưa điểm danh ăn:
            {{ statisticalData.attendanceTotal.attendanceEatNo }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content-over bg-over-3">
          <div class="content-line-1 color-3">
            <i class="el-icon-user-solid"></i>
            Số học sinh đi học: {{ statisticalData.leaveTotal.goSchool }}
          </div>
          <div class="content-line-1 color-3">
            <i class="el-icon-user-solid"></i>
            Số học sinh đã về: {{ statisticalData.leaveTotal.leaveYes }}
          </div>
          <div class="content-line-1 color-3">
            <i class="el-icon-user-solid"></i>
            Số học sinh chưa về: {{ statisticalData.leaveTotal.leaveNo }}
          </div>
          <div class="content-line-1 color-3">
            <i class="el-icon-user-solid"></i>
            Số học sinh đón muộn: {{ statisticalData.leaveTotal.pickupLater }}
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content-over bg-over-4">
          <div class="content-line-1 color-4">
            <i class="el-icon-chat-line-square"></i>
            Số lời nhắn: {{ statisticalData.otherTotal.message }}
          </div>
          <div class="content-line-1 color-4">
            <i class="el-icon-edit-outline"></i>
            Số dặn thuốc: {{ statisticalData.otherTotal.medicine }}
          </div>
          <div class="content-line-1 color-4">
            <i class="el-icon-user-solid"></i>
            Số học sinh nghỉ học: {{ statisticalData.otherTotal.absent }}
          </div>
          <div class="content-line-1 color-4">
            <i class="el-icon-document-remove"></i>
            Đơn xin nghỉ chưa duyệt:
            {{ statisticalData.otherTotal.absentLetterNoConfirm }}
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="chartView">
      <div class="chartPie">
        <ChartPie
          v-if="loaded"
          :chartData="dataConllection.chartData"
          :options="dataConllection.options"
          :checkLable="true"
          :height="250"
        ></ChartPie>
      </div>
      <div class="chartAttendace">
        <ChartLine
          v-if="loaded"
          :chartData="dataConllection1.chartData"
          :options="dataConllection1.options"
          :height="250"
        ></ChartLine>
      </div>
    </div>
    <div class="chartFees">
      <ChartBar
        v-if="loaded"
        :checkLable="true"
        :chartData="dataConllection2.chartData"
        :options="dataConllection2.options"
        :height="250"
      ></ChartBar>
    </div>
    <span
      @click="showTableData"
      style="
        color: #6aa5e3;
        margin-bottom: 5px;
        text-decoration: underline;
        float: right;
        cursor: pointer;
      "
      >{{ !this.showTable ? "Xem thêm >>" : "Ẩn chi tiết >>" }}</span
    >
    <br />
    <el-row v-if="showTable">
      <el-col>
        <el-table
          :data="responseDataList"
          highlight-current-row
          :row-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="120px"
            prop="className"
            label="Lớp"
          ></el-table-column>
          <el-table-column
            min-width="110px"
            prop="gradeName"
            label="Khối"
          ></el-table-column>

          <el-table-column
            width="130px"
            prop="kidsTotalNumber"
            label="Tổng số HS"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attendanceYes"
            label="Đã điểm danh"
            min-width="130px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attendanceNo"
            label="Chưa điểm danh"
            min-width="130px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="goSchoolNumber"
            label="Đi học"
            min-width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="absentNumber"
            label="Nghỉ học"
            min-width="100px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="leaveYes"
            min-width="100px"
            label="Đã về"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="leaveNo"
            min-width="100px"
            label="Chưa về"
            align="center"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DashboardService from "@/services/DashboardService";
import CommonOnekidsService from "@/services/CommonOnekidsService";
import ChartStatisticalService from "@/services/ChartStatisticalService";
import ChartPie from "../chartStatistical/chart/ChartPie.vue";
import ChartLine from "../chartStatistical/chart/ChartLine.vue";
import ChartBar from "../chartStatistical/chart/ChartBar.vue";
export default {
  components: { ChartPie, ChartLine, ChartBar },
  data() {
    return {
      showTable: false,
      dataConllection: null,
      dataConllection1: null,
      dataConllection2: null,
      loaded: false,
      loadChart: false,
      dataSearch: {
        type: "date",
        dateList: [
          this.moment().subtract(29, "days").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
      },
      dataLabels: [],
      dataFeesLabels: [],
      dataList: [1, 2, 3, 4],
      dataList1: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
      dataList2: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      dataList3: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100],
      dataList4: [300, 700, 2000, 5500, 6000, 3000, 2000, 1000, 200, 100],
      dataFeesList1: [],
      dataFeesList2: [],
      dataFeesList3: [],
      tableDataFilter: [],
      statisticalData: {},
      responseDataList: [],
    };
  },
  async mounted() {
    this.fillDataAll();
    this.fillData();
    this.fillDataFees();
    this.loaded = false;
    await this.searchByProperties();
    await this.searchByPropertiesAttendance();
    await this.searchByPropertiesFees();
  },
  created() {
    sessionStorage.removeItem("breadcrumbList");
    this.$store.dispatch("layout/setBreadcrumbActions", []);
    let appTypeUser = this.$store.state.auth.user.appType;
    // if (appTypeUser == "teacher") {
    //   this.$alert("Tính năng giành cho giáo viên đang được cập nhật", "Thông báo!", {
    //     confirmButtonText: "OK",
    //   });
    //   localStorage.removeItem("user");
    //   this.$router.push("/login");
    // }
    if (appTypeUser == "parent") {
      this.$alert(
        "Tính năng giành cho Phụ huynh đang được cập nhật",
        "Thông báo!",
        {
          confirmButtonText: "OK",
        }
      );
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    // set for hearder table
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    // tableRowStyle({ row }) {
    //   console.log(row);
    // },

    showTableData() {
      this.showTable = !this.showTable;
    },

    getDataInitialInSchool() {
      DashboardService.getStatisticalInSchool()
        .then((resp) => {
          this.statisticalData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          // this.$message({
          //   message: err.response.data.message,
          //   type: "error",
          // });
        });
    },
    fillDataAll() {
      this.dataConllection = {
        chartData: {
          labels: ["Đang học", "Chờ học", "Bảo lưu", "Nghỉ học"],
          datasets: [
            {
              backgroundColor: ["#c694f9", "#6aa5e3", "#feb683", "#ef5b5b"],
              data: this.dataList,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Trạng thái học sinh",
            fontSize: 15,
            fontColor: "#000",
          },
          plugins: {
            datalabels: {
              color: "#fff",
              anchor: "end",
              align: "start",
              borderRadius: 25,
              borderColor: "#fff",
              borderWidth: 2,
              backgroundColor: (ctx) => {
                return ctx.dataset.backgroundColor;
              },
              font: {
                size: 11,
                weight: "bold",
              },
              formatter: (value, ctx) => {
                let sum = this.loda.sumBy(ctx.dataset.data);
                let percentage = ((value * 100) / sum).toFixed(1) + "%";
                return percentage;
              },
            },
          },
        },
      };
    },
    fillData() {
      this.dataConllection1 = {
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
          fontSize: 11,
          title: {
            display: true,
            text: `Tình trạng điểm danh (${this.moment(
              String(this.dataSearch.dateList[0])
            ).format("DD/MM/YYYY")} - ${this.moment(
              String(this.dataSearch.dateList[1])
            ).format("DD/MM/YYYY")})`,
            fontSize: 15,
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
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
    },
    fillDataFees() {
      this.dataConllection2 = {
        chartData: {
          labels: this.dataFeesLabels,
          datasets: [
            {
              label: "Đã hoàn thành",
              data: this.dataFeesList1,
              backgroundColor: "#6aa5e3",
            },
            {
              label: "Chưa hoàn thành",
              data: this.dataFeesList2,
              backgroundColor: "#fd4803",
            },
            {
              label: "Chưa có khoản",
              data: this.dataFeesList3,
              backgroundColor: "#fb9a00",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Hóa đơn học phí",
            fontSize: 15,
            fontColor: "#000",
          },
          plugins: {
            datalabels: {
              color: "black",
              anchor: "end",
              align: "end",
              formatter: (value) => {
                return value > 0 ? value : "";
              },
            },
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      };
    },
    searchByProperties() {
      this.loadChart = true;
      ChartStatisticalService.findAllChartKidsStatus()
        .then((resp) => {
          this.dataList = resp.data.data;
          this.loaded = true;
          this.fillDataAll();
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
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByPropertiesAttendance() {
      this.loadChart = true;
      ChartStatisticalService.findAttendanceKids(
        "",
        "",
        this.dataSearch.type,
        this.dataSearch.dateList,
        "",
        "",
        ""
      )
        .then((resp) => {
          let results = resp.data.data;
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
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByPropertiesFees() {
      this.loadChart = true;
      ChartStatisticalService.findFeesKids(this.moment().get("year"))
        .then((resp) => {
          let results = resp.data.data;
          let dataLabels = [];
          let feesYes = [];
          let feesNo = [];
          let feesUn = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            dataLabels.push(e.name);
            feesYes.push(e.feesYes);
            feesNo.push(e.feesNo);
            feesUn.push(e.feesUn);
          }
          this.dataFeesLabels = dataLabels;
          this.dataFeesList1 = feesYes;
          this.dataFeesList2 = feesNo;
          this.dataFeesList3 = feesUn;
          this.loaded = true;
          this.fillDataFees();
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
    getDataInitialInClass() {
      DashboardService.getStatisticalInClass()
        .then((resp) => {
          this.responseDataList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          // this.$message({
          //   message: err.response.data.message,
          //   type: "error",
          // });
        });
    },
    getApiMethod() {
      CommonOnekidsService.getApiAgain()
        .then((resp) => {
          let user = JSON.parse(localStorage.getItem("user"));
          user.apiSet = resp.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.$store.dispatch("auth/setUserActions", user);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    fetchData() {
      this.getDataInitialInSchool();
      this.getDataInitialInClass();
      this.getApiMethod();
      // this.searchByProperties();
      // this.searchByPropertiesAttendance();
      // this.searchByPropertiesFees();
    },
  },
  beforeMount() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.class-flex {
  display: flex;
  flex-direction: row;
}
/deep/.el-table td {
  padding: 6px 0;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    .grid-content-over {
      font-size: 17px;
      border-radius: 10px;
      height: 150px;
      color: white;
    }
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
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
  background: #c694f9;
}
.color-2 {
  background: #6aa5e3;
}
.color-3 {
  background: #feb683;
}
.color-4 {
  background: #ef5b5b;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-pagination {
  text-align: right;
  margin: 30px 0;
}
/deep/.el-pagination .el-select .el-input {
  width: 50px;
}
.chartView {
  display: flex;
  flex-direction: row;
}
.chartPie {
  width: 30%;
}
.chartAttendace {
  width: 70%;
}
.chartFees {
  margin-bottom: 20px;
  margin-top: 10px;
}
</style>
