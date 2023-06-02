<template>
  <div>
    <div>
      <el-radio-group v-model="dataSearch.type" @change="searchByProperties()">
        <el-radio-button label="all">Toàn trường</el-radio-button>
        <el-radio-button label="class">Lớp</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-if="dataSearch.type == 'all'"
        :clearable="false"
        class="button-left-status"
        style="width: 130px; margin-left: 50px"
        value-format="yyyy-MM-dd"
        v-model="dataSearch.year"
        type="year"
        @change="changeYearMethod()"
        placeholder="Chọn năm"
      >
      </el-date-picker>
      <el-button
        v-if="dataSearch.type == 'all'"
        style="float: right"
        class="button-bottom"
        type="success"
        @click="exportExcelStatusEmployee()"
        >Xuất excel</el-button
      >
    </div>

    <!-- all - detail -->
    <div style="margin-top: 20px">
      <!-- <el-row
        :gutter="50"
        style="margin-bottom: 10px"
        v-if="this.dataSearch.type == 'all'"
      >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Đang làm:
              {{
                dataSearch.type == "all"
                  ? dataList[0]
                  : this.loda.sumBy(this.dataList1)
              }}
            </div>
          </div></el-col
        >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Tạm nghỉ:
              {{
                dataSearch.type == "all"
                  ? dataList[1]
                  : this.loda.sumBy(this.dataList2)
              }}
            </div>
          </div></el-col
        >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-user-solid"></i>
              Nghỉ làm:
              {{
                dataSearch.type == "all"
                  ? dataList[2]
                  : this.loda.sumBy(this.dataList3)
              }}
            </div>
          </div></el-col
        >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Đang làm
              <span style="font-size: 12px; text-decoration: underline"
                >(phòng ban)</span
              >
              {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div></el-col
        >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Tạm nghỉ
              <span style="font-size: 12px; text-decoration: underline"
                >(phòng ban)</span
              >
              {{ this.loda.sumBy(this.dataList2) }}
            </div>
          </div></el-col
        >
        <el-col :span="4" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-user-solid"></i>
              Nghỉ làm
              <span style="font-size: 12px; text-decoration: underline"
                >(phòng ban)</span
              >
              {{ this.loda.sumBy(this.dataList3) }}
            </div>
          </div></el-col
        >
      </el-row>
      <el-row :gutter="50" style="margin-bottom: 10px" v-else>
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Đang làm:
              {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Tạm nghỉ:
              {{ this.loda.sumBy(this.dataList2) }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-user-solid"></i>
              Nghỉ làm:
              {{ this.loda.sumBy(this.dataList3) }}
            </div>
          </div></el-col
        >
      </el-row> -->
      <spinner-custom v-if="loadChart" />
      <div v-else>
        <!-- <span v-if="dataSearch.type == 'all'" class="chartViewAll">
          <div class="statusAll">
            <ChartPie
              v-if="loaded"
              :chartData="dataConllection.chartData"
              :options="dataConllection.options"
              :checkLable="true"
            ></ChartPie>
          </div>
          <div class="statusDepartment">
            <ChartBar
              v-if="loaded"
              :chartData="dataConllection1.chartData"
              :options="dataConllection1.options"
              :checkLable="true"
            ></ChartBar>
          </div>
        </span> -->
        <span v-if="dataSearch.type == 'all'" class="chartViewAll">
          <!-- <div class="statusAll">
            <ChartPie
              v-if="loaded"
              :chartData="dataConllection.chartData"
              :options="dataConllection.options"
              :checkLable="true"
            ></ChartPie>
          </div> -->
          <spinner-custom v-if="loadChartAll" />
          <!-- <div class="statusStudding" v-else>
            <ChartLine
              v-if="loaded"
              :chartData="dataConllection1.chartData"
              :options="dataConllection1.options"
              :checkLable="true"
            ></ChartLine>
            
          </div> -->
          <div class="statusFive statusStudding" v-else>
            <ChartBar
              v-if="loaded"
              :chartData="dataConllection2.chartData"
              :options="dataConllection2.options"
              :checkLable="true"
            ></ChartBar>
          </div>
        </span>
        <span v-if="dataSearch.type == 'class'">
          <ChartBar
            v-if="loaded"
            :chartData="dataConllection.chartData"
            :options="dataConllection.options"
            :checkLable="true"
          ></ChartBar>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import ChartStatisticalService from "@/services/ChartStatisticalService";
import ChartBar from "./chart/ChartBar.vue";

export default {
  components: { ChartBar },
  data() {
    return {
      dataConllection: null,
      dataConllection1: null,
      dataConllection2: null,
      loaded: false,
      loadChart: false,
      loadChartAll: false,
      dataSearch: {
        type: "all",
        year: this.moment().format("YYYY-MM-DD"),
      },
      dataLabels: [],
      dataLabelsDepartment: [],
      dataDepartment: [],
      dataList: [1, 2, 3, 4],
      dataList1: [1, 2, 3, 4],
      dataList2: [1, 2, 3, 4],
      dataList3: [1, 2, 3, 4],
      dataLabelsFour: [1, 2, 7, 4],
      dataFour1: [1, 2, 3, 4],
      dataFour2: [1, 2, 3, 4],
      dataFour3: [1, 2, 3, 4],
      dataFour4: [1, 2, 3, 4],
      //css xlsx
      styleCols1: [],
      styleCols2: [],
    };
  },
  async mounted() {
    this.fillData();
    this.fillDataDepartment();
    this.fillDataFour();
    this.loaded = false;
    await this.searchByProperties();
    await this.searchByPropertiesFour();
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    datasets1() {
      if (this.dataSearch.type == "all") {
        return [
          {
            backgroundColor: ["#c694f9", "#6aa5e3", "#feb683"],
            data: this.dataList,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
        ];
      } else {
        return [
          {
            label: "Đang làm",
            backgroundColor: "#c694f9",
            data: this.dataList1,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Tạm nghỉ",
            backgroundColor: "#6aa5e3",
            data: this.dataList2,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Nghỉ làm",
            backgroundColor: "#feb683",
            data: this.dataList3,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
        ];
      }
    },
    dataLabels1() {
      if (this.dataSearch.type == "all") {
        return ["Đang làm", "Tạm nghỉ", "Nghỉ làm"];
      } else {
        return this.dataLabels;
      }
    },
    titleText() {
      if (this.dataSearch.type == "all") {
        return "Trạng thái nhân sự toàn trường";
      } else {
        return "Trạng thái nhân sự theo lớp";
      }
    },
    setDataLabel() {
      if (this.dataSearch.type == "all") {
        return {
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
              size: 14,
              weight: "bold",
            },
            formatter: (value, ctx) => {
              let sum = this.loda.sumBy(ctx.dataset.data);
              let percentage = ((value * 100) / sum).toFixed(1) + "%";
              return percentage;
            },
          },
        };
      } else {
        return {
          datalabels: {
            color: "#000",
            anchor: "end",
            align: "end",
            offset: 5,
            formatter: (value) => {
              return value > 0 ? value : "";
            },
            // borderRadius: 5,
            // borderWidth: 1,
            // backgroundColor: (ctx) => {
            //   return ctx.dataset.backgroundColor;
            // },
            // formatter: (value, ctx) => {
            //   return ctx.dataset.label + " : " + value;
            // },
          },
        };
      }
    },
  },
  methods: {
    changeTypeMethod() {
      if (this.dataSearch.type == "all") {
        // this.searchByProperties();
        this.searchByPropertiesFour();
        // this.searchByPropertiesStudding();
      } else {
        this.searchByPropertiesDetail();
      }
    },
    changeYearMethod() {
      this.searchByPropertiesFour();
      // this.searchByPropertiesStudding();
    },
    fillData() {
      this.dataConllection = {
        chartData: {
          labels: this.dataLabels1,
          datasets: this.datasets1,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: this.titleText,
            fontSize: 20,
            fontColor: "#000",
          },
          plugins: this.setDataLabel,
        },
      };
    },
    fillDataDepartment() {
      this.dataConllection1 = {
        chartData: {
          labels: this.dataLabelsDepartment,
          datasets: [
            {
              label: "Đang làm",
              backgroundColor: "#c694f9",
              data: this.dataList1,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Tạm nghỉ",
              backgroundColor: "#6aa5e3",
              data: this.dataList2,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Nghỉ làm",
              backgroundColor: "#feb683",
              data: this.dataList3,
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
            text: "Trạng thái nhân sự phòng ban",
            fontSize: 20,
            fontColor: "#000",
          },
          plugins: {
            datalabels: {
              color: "#000",
              anchor: "end",
              align: "end",
              offset: 5,
              formatter: (value) => {
                return value > 0 ? value : "";
              },
            },
          },
        },
      };
    },
    fillDataFour() {
      this.dataConllection2 = {
        chartData: {
          labels: this.dataLabelsFour,
          datasets: [
            {
              label: "Đang làm",
              backgroundColor: "#c694f9",
              data: this.dataFour1,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Tạm nghỉ",
              backgroundColor: "#6aa5e3",
              data: this.dataFour2,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Nghỉ làm",
              backgroundColor: "#feb683",
              data: this.dataFour3,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Ra trường",
              backgroundColor: "#000",
              data: this.dataFour4,
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
            text: "Trạng thái nhân sự",
            fontSize: 20,
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
    exportExcelStatusEmployee() {
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcel();
        ChartStatisticalService.exportExcelStatusEmployee(
          this.moment(this.dataSearch.year).get("year")
        )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `TRANG_THAI_NHAN_SU_NAM_${this.moment(
                  this.dataSearch.year
                ).get("year")}`;
                const tHeader = [
                  "Tháng",
                  "Đang làm",
                  "Tạm nghỉ",
                  "Nghỉ làm",
                  "Ra trường",
                ];
                const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
                let columnList = [
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                  { col: 10 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  data: dataList,
                  title: filterVal,
                  filename: fileName,
                  columnsWidth: columnList,
                  styleCols1: this.styleCols1,
                  styleCols2: this.styleCols2,
                });
              })
              .finally(() => {
                this.styleCols1 = [];
                this.styleCols2 = [];
              });
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Thất bại",
              type: "error",
            });
          });
      });
    },

    //Css Excel
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let style1 = {
        name: "A3:E3",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: font,
          alignment,
          border,
        },
      };
      let styleCol2 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      this.styleCols2.push(style1);
      this.styleCols1.push(styleCol2);
    },

    searchByPropertiesFour() {
      this.loadChartAll = true;
      ChartStatisticalService.findFourChartEmployeeStatus(
        this.moment(this.dataSearch.year).get("year")
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataFour1 = [];
          let dataFour2 = [];
          let dataFour3 = [];
          let dataFour4 = [];
          let data1 = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            data1.push(e.name);
            dataFour1.push(e.working);
            dataFour2.push(e.retain);
            dataFour3.push(e.leave);
            dataFour4.push(e.outSchool);
          }
          this.dataLabelsFour = data1;
          this.dataFour1 = dataFour1;
          this.dataFour2 = dataFour2;
          this.dataFour3 = dataFour3;
          this.dataFour4 = dataFour4;
          this.loaded = true;
          this.fillDataFour();
        })
        .catch(() => {
          this.$message({
            message: "Failed to get the data",
            type: "error",
          });
          this.loadChartAll = false;
        })
        .finally(() => {
          setTimeout(() => {
            this.loadChartAll = false;
          }, 500);
        });
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.loadChart = true;
      ChartStatisticalService.findAllChartEmployeeStatus(this.dataSearch.type)
        .then((resp) => {
          if (this.dataSearch.type == "all") {
            this.dataList = resp.data.data.statusAll;
            let results = resp.data.data.dataList;
            let data1 = [];
            let working = [];
            let retain = [];
            let leave = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              data1.push(e.name);
              working.push(e.statusWorking);
              retain.push(e.statusRetain);
              leave.push(e.statusLeave);
            }
            this.dataLabelsDepartment = data1;
            this.dataList1 = working;
            this.dataList2 = retain;
            this.dataList3 = leave;
          } else {
            let results = resp.data.data;
            let data1 = [];
            let working = [];
            let retain = [];
            let leave = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              data1.push(e.name);
              working.push(e.statusWorking);
              retain.push(e.statusRetain);
              leave.push(e.statusLeave);
            }
            this.dataLabels = data1;
            this.dataList1 = working;
            this.dataList2 = retain;
            this.dataList3 = leave;
          }
          this.loaded = true;
          this.fillData();
          this.fillDataDepartment();
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
  },
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
// .chartViewAll {
//   margin-top: 30px;
//   display: flex;
//   flex-direction: row;
// }
// .statusAll {
//   width: 30%;
// }
// .statusDepartment {
//   width: 70%;
// }
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
</style>
