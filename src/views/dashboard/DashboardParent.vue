<template>
  <div>
    <div class="chartView">
      <!-- <div class="chartPie"> -->
      <!-- <ChartPie
          v-if="loaded"
          :chartData="dataConllection.chartData"
          :options="dataConllection.options"
          :checkLable="true"
          :height="250"
        ></ChartPie>
      </div> -->
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
    <hr />
    <div>
      <div style="text-align: center; font-weight: bold; font-family: arial">
        Thông tin trường
      </div>
      <el-form
        label-width="150px"
        :model="schoolData"
        label-position="left"
        :rules="rules"
        ref="schoolData"
      >
        <!-- <el-form-item label="Tên trường" prop="schoolName">
          <el-input
            v-model="schoolData.schoolName"
            placeholder="Nhập tên trường"
          ></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" style="margin-top: 35px" prop="schoolDescription">
          <el-input
            :rows="7"
            type="textarea"
            v-model="schoolData.schoolDescription"
            placeholder="Nhập mô tả"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="Địa chỉ" prop="schoolAddress">
          <el-input
            v-model="schoolData.schoolAddress"
            placeholder="Nhập địa chỉ"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="Mã xử lý" style="display: inline-block; width: 33.5%">
          <span>{{ schoolData.verifyCode }}</span>
        </el-form-item>
        <el-form-item
          label="SMS đã dùng"
          prop="smsUsed"
          style="display: inline-block; width: 33.5%"
        >
          <span>{{ schoolData.smsUsed }}</span>
        </el-form-item>
        <el-form-item label="SMS còn lại" style="display: inline-block; width: 33%">
          <span>{{ schoolData.smsTotal - schoolData.smsUsed }}</span>
        </el-form-item> -->
        <div class="content-2" style="display: flex; flex-direction: row">
          <div class="avt-info" style="width: 80%">
            <el-form-item label="Điện thoại" prop="schoolPhone">
              <el-input
                v-model.trim="schoolData.schoolPhone"
                placeholder="Nhập số điện thoại"
              ></el-input>
            </el-form-item>
            <el-form-item label="Ảnh bìa">
              <el-image
                v-if="schoolData.schoolAvatar != null && showPicutreInitial"
                style="width: 150px; height: 150px"
                :src="schoolData.schoolAvatar"
                fit="fill"
              ></el-image>
              <el-upload
                class="avatar-uploader"
                :show-file-list="true"
                list-type="picture-card"
                :on-change="handleChangeUpload"
                :on-remove="handleRemove"
                :auto-upload="false"
                :class="{ hideUpload: !showUpload }"
                limit="1"
                ref="upload"
                style="position: absolute; top: 0%"
              >
                <span v-if="schoolData.schoolAvatar != null">
                  <i class="el-icon-plus avatar-uploader-icon" style="font-size: 20px"
                    >Cập nhật ảnh</i
                  >
                </span>
                <span v-else>
                  <i class="el-icon-plus avatar-uploader-icon" style="font-size: 20px"
                    >Thêm ảnh</i
                  >
                </span>
              </el-upload>
            </el-form-item>
          </div>
          <div class="concat-detail">
            <el-form-item label="Email" prop="schoolEmail" class="input-below">
              <el-input
                v-model.trim="schoolData.schoolEmail"
                placeholder="Nhập email"
              ></el-input>
            </el-form-item>
            <el-form-item label="Website" prop="schoolWebsite" class="input-below">
              <el-input
                v-model="schoolData.schoolWebsite"
                placeholder="Nhập website"
              ></el-input>
            </el-form-item>
            <el-form-item label="Liên hệ 1" prop="contactPhone1" class="input-below">
              <el-input
                v-model.trim="schoolData.contactPhone1"
                placeholder="Số điện thoại 1"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tên" prop="contactName1" class="input-below">
              <el-input
                v-model="schoolData.contactName1"
                placeholder="Nhập nội dung"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item class="input-below"></el-form-item> -->
            <el-form-item label="Liên hệ 2" prop="contactPhone2" class="input-below">
              <el-input
                v-model.trim="schoolData.contactPhone2"
                placeholder="Số điện thoại 2"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tên" prop="contactName2" class="input-below">
              <el-input
                v-model="schoolData.contactName2"
                placeholder="Nhập nội dung"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item prop="schoolAvatar" class="input-below"></el-form-item> -->
            <el-form-item label="Liên hệ 3" prop="contactPhone3" class="input-below">
              <el-input
                v-model.trim="schoolData.contactPhone3"
                placeholder="Số điện thoại 3"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tên" prop="contactName3" class="input-below">
              <el-input
                v-model="schoolData.contactName3"
                placeholder="Nhập nội dung"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ParentService from "@/services/ParentService";
// import ChartPie from "../chartStatistical/chart/ChartPie.vue";
import ChartLine from "../chartStatistical/chart/ChartLine.vue";
import ChartBar from "../chartStatistical/chart/ChartBar.vue";
export default {
  components: { ChartLine, ChartBar },
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
      schoolData: {},
    };
  },
  async mounted() {
    // this.fillDataAll();
    this.fillData();
    this.fillDataFees();
    this.loaded = false;
    // await this.searchByProperties();
    await this.searchByPropertiesAttendance();
    await this.searchByPropertiesFees();
  },
  created() {
    sessionStorage.removeItem("breadcrumbList");
    this.$store.dispatch("layout/setBreadcrumbActions", []);
    // let appTypeUser = this.$store.state.auth.user.appType;
    // if (appTypeUser == "teacher") {
    //   this.$alert("Tính năng giành cho giáo viên đang được cập nhật", "Thông báo!", {
    //     confirmButtonText: "OK",
    //   });
    //   localStorage.removeItem("user");
    //   this.$router.push("/login");
    // }
    // if (appTypeUser == "parent") {
    //   this.$alert(
    //     "Tính năng giành cho Phụ huynh đang được cập nhật",
    //     "Thông báo!",
    //     {
    //       confirmButtonText: "OK",
    //     }
    //   );
    //   localStorage.removeItem("user");
    //   this.$router.push("/login");
    // }
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
      ParentService.getStatisticalInSchool()
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
      ParentService.findAllChartKidsStatus()
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
      ParentService.chartdAttendanceParent()
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
      ParentService.chartFeesParent()
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
      ParentService.getStatisticalInClass()
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
    getSchoolInitial() {
      ParentService.schoolInforParent()
        .then((resp) => {
          this.schoolData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.getSchoolInitial();
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
  width: 100%;
}
.chartFees {
  margin-bottom: 20px;
  margin-top: 10px;
}

/deep/.el-input__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/label.el-form-item__label {
  padding-left: 40px;
}
.input-below {
  width: 50%;
  display: inline-block;
}
</style>
