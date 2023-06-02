<template>
  <div>
    <div>
      <el-radio-group v-model="dataSearch.type" @change="changeTypeMethod()">
        <el-radio-button label="all">Toàn trường</el-radio-button>
        <el-radio-button label="detail">Chi tiết</el-radio-button>
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
      <span
        class="detail-name"
        v-if="dataSearch.type == 'detail'"
        style="margin-left: 50px"
      >
        <el-radio-group
          v-model="dataSearch.typeSchool"
          @change="searchByPropertiesDetail()"
        >
          <el-radio label="grade">Xem theo khối</el-radio>
          <el-radio label="class">Xem theo lớp</el-radio>
        </el-radio-group>
      </span>
      <el-button
        v-if="dataSearch.type == 'all'"
        style="float: right"
        class="button-bottom"
        type="success"
        @click="exportExcelStatusKids()"
        >Xuất excel</el-button
      >
    </div>

    <div style="margin-top: 20px">
      <spinner-custom v-if="loadChart" />
      <div v-else>
        <span v-if="dataSearch.type == 'all'" class="chartViewAll">
          <spinner-custom v-if="loadChartAll" />
          <div class="statusFive statusStudding" v-else>
            <ChartBar
              v-if="loaded"
              :chartData="dataConllection2.chartData"
              :options="dataConllection2.options"
              :checkLable="true"
            ></ChartBar>

            <br />
            <ChartBar
              v-if="loaded"
              :chartData="dataConllection3.chartData"
              :options="dataConllection3.options"
              :checkLable="true"
            ></ChartBar>
          </div>
        </span>
        <span v-if="dataSearch.type == 'detail'">
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
// import ChartPie from "./chart/ChartPie.vue";
import ChartBar from "./chart/ChartBar.vue";
// import ChartLine from "./chart/ChartLine.vue";

export default {
  components: { ChartBar },
  data() {
    return {
      dataConllection: null,
      dataConllection1: null,
      dataConllection2: null,
      dataConllection3: null,
      loaded: false,
      loadChart: false,
      loadChartAll: false,
      dataSearch: {
        type: "all",
        year: this.moment().format("YYYY-MM-DD"),
        typeSchool: "grade",
      },
      dataLabels: [],
      // dataLabelsStudding: [1, 2, 7, 4],
      dataLabelsFive: [1, 2, 7, 4],
      dataLabelsFistMonth: [1, 2, 7, 5],
      dataList: [1, 2, 3, 4],
      dataList1: [1, 2, 3, 4],
      dataList2: [1, 2, 3, 4],
      dataList3: [1, 2, 3, 4],
      dataList4: [1, 2, 3, 4],
      dataStudding: [100, 200, 400, 100],
      dataFive1: [100, 200, 400, 100],
      dataFive2: [100, 200, 400, 100],
      dataFive3: [100, 200, 400, 100],
      dataFive4: [100, 200, 400, 100],
      dataFive5: [100, 200, 400, 100],
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  async mounted() {
    this.fillData();
    // this.fillDataStudding();
    this.fillDataFive();
    this.fistMonthDataFive();
    this.loaded = false;
    // await this.searchByProperties();
    await this.searchByPropertiesDetail();
    // await this.searchByPropertiesStudding();
    await this.searchByPropertiesFive();
    await this.searchByPropertiesFistMonth();
  },
  computed: {
    datasets1() {
      if (this.dataSearch.type == "all") {
        return [
          {
            backgroundColor: ["#c694f9", "#6aa5e3", "#feb683", "#ef5b5b"],
            data: this.dataList,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
        ];
      } else {
        return [
          {
            label: "Đang học",
            backgroundColor: "#c694f9",
            data: this.dataList1,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Chờ học",
            backgroundColor: "#6aa5e3",
            data: this.dataList2,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Bảo lưu",
            backgroundColor: "#feb683",
            data: this.dataList3,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Nghỉ học",
            backgroundColor: "#ef5b5b",
            data: this.dataList4,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
        ];
      }
    },
    dataLabels1() {
      if (this.dataSearch.type == "all") {
        return ["Đang học", "Chờ học", "Bảo lưu", "Nghỉ học"];
      } else {
        return this.dataLabels;
      }
    },
    titleText() {
      if (this.dataSearch.type == "all") {
        return "Trạng thái học sinh hiện tại";
      } else {
        return "Trạng thái học sinh hiện tại";
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
          },
        };
      }
    },
  },
  methods: {
    changeTypeMethod() {
      if (this.dataSearch.type == "all") {
        // this.searchByProperties();
        this.searchByPropertiesFive();
        this.searchByPropertiesFistMonth();
        // this.searchByPropertiesStudding();
      } else {
        this.searchByPropertiesDetail();
      }
    },
    changeYearMethod() {
      this.searchByPropertiesFive();
      this.searchByPropertiesFistMonth();
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
    fillDataFive() {
      this.dataConllection2 = {
        chartData: {
          labels: this.dataLabelsFive,
          datasets: [
            {
              label: "Đang học",
              backgroundColor: "#c694f9",
              data: this.dataFive1,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Chờ học",
              backgroundColor: "#6aa5e3",
              data: this.dataFive2,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Bảo lưu",
              backgroundColor: "#feb683",
              data: this.dataFive3,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Nghỉ học",
              backgroundColor: "#ef5b5b",
              data: this.dataFive4,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            {
              label: "Ra trường",
              backgroundColor: "#000",
              data: this.dataFive5,
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

    fistMonthDataFive() {
      this.dataConllection3 = {
        chartData: {
          labels: this.dataLabelsFistMonth,
          datasets: [
            {
              label: "Đang học",
              backgroundColor: "#c694f9",
              data: this.dataFive1,
              hoverBorderWidth: 2,
              hoverBorderColor: "#6f6f6f",
            },
            // {
            //   label: "Chờ học",
            //   backgroundColor: "#6aa5e3",
            //   data: this.dataFive2,
            //   hoverBorderWidth: 2,
            //   hoverBorderColor: "#6f6f6f",
            // },
            // {
            //   label: "Bảo lưu",
            //   backgroundColor: "#feb683",
            //   data: this.dataFive3,
            //   hoverBorderWidth: 2,
            //   hoverBorderColor: "#6f6f6f",
            // },
            // {
            //   label: "Nghỉ học",
            //   backgroundColor: "#ef5b5b",
            //   data: this.dataFive4,
            //   hoverBorderWidth: 2,
            //   hoverBorderColor: "#6f6f6f",
            // },
            // {
            //   label: "Ra trường",
            //   backgroundColor: "#000",
            //   data: this.dataFive5,
            //   hoverBorderWidth: 2,
            //   hoverBorderColor: "#6f6f6f",
            // },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Trạng thái học sinh ngày đầu tháng",
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

    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    // searchByProperties() {
    //   this.loadChart = true;
    //   ChartStatisticalService.findAllChartKidsStatus()
    //     .then((resp) => {
    //       this.dataList = resp.data.data;
    //       this.loaded = true;
    //       this.fillData();
    //     })
    //     .catch(() => {
    //       this.$message({
    //         message: "Failed to get the data",
    //         type: "error",
    //       });
    //       this.loadChart = false;
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.loadChart = false;
    //       }, 500);
    //     });
    // },
    searchByPropertiesFive() {
      this.loadChartAll = true;
      ChartStatisticalService.findFiveChartKidsStatus(
        this.moment(this.dataSearch.year).get("year")
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataFive1 = [];
          let dataFive2 = [];
          let dataFive3 = [];
          let dataFive4 = [];
          let dataFive5 = [];
          let data1 = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            data1.push(e.name);
            dataFive1.push(e.studying);
            dataFive2.push(e.studyWait);
            dataFive3.push(e.reserve);
            dataFive4.push(e.leaveSchool);
            dataFive5.push(e.outSchool);
          }
          this.dataLabelsFive = data1;
          this.dataFive1 = dataFive1;
          this.dataFive2 = dataFive2;
          this.dataFive3 = dataFive3;
          this.dataFive4 = dataFive4;
          this.dataFive5 = dataFive5;
          this.loaded = true;
          this.fillDataFive();
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

    searchByPropertiesFistMonth() {
      this.loadChartAll = true;
      ChartStatisticalService.findFistMonthChartKidsStatus(
        this.moment(this.dataSearch.year).get("year")
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataFive1 = [];
          let dataFive2 = [];
          let dataFive3 = [];
          let dataFive4 = [];
          let dataFive5 = [];
          let data1 = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            data1.push(e.name);
            dataFive1.push(e.studying);
            dataFive2.push(e.studyWait);
            dataFive3.push(e.reserve);
            dataFive4.push(e.leaveSchool);
            dataFive5.push(e.outSchool);
          }
          this.dataLabelsFistMonth = data1;
          this.dataFive1 = dataFive1;
          this.dataFive2 = dataFive2;
          this.dataFive3 = dataFive3;
          this.dataFive4 = dataFive4;
          this.dataFive5 = dataFive5;
          this.loaded = true;
          this.fistMonthDataFive();
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

    // searchByPropertiesStudding() {
    //   this.loadChartAll = true;
    //   ChartStatisticalService.findStuddingChartKidsStatus(this.dataSearch.year)
    //     .then((resp) => {
    //       let results = resp.data.data;
    //       let countStudding = [];
    //       let data1 = [];
    //       for (let i = 0; i < results.length; i++) {
    //         const e = results[i];
    //         data1.push(e.name);
    //         countStudding.push(e.countStudding);
    //       }
    //       this.dataLabelsStudding = data1;
    //       this.dataStudding = countStudding;
    //       this.loaded = true;
    //       this.fillDataStudding();
    //     })
    //     .catch(() => {
    //       this.$message({
    //         message: "Failed to get the data",
    //         type: "error",
    //       });
    //       this.loadChartAll = false;
    //     })
    //     .finally(() => {
    //       setTimeout(() => {
    //         this.loadChartAll = false;
    //       }, 500);
    //     });
    // },

    searchByPropertiesDetail() {
      this.loadChart = true;
      ChartStatisticalService.findDetailChartKidsStatus(
        this.dataSearch.typeSchool
      )
        .then((resp) => {
          let results = resp.data.data;
          let data1 = [];
          let studying = [];
          let studyWait = [];
          let leaveSchool = [];
          let reserve = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            data1.push(e.name);
            studying.push(e.studying);
            studyWait.push(e.studyWait);
            leaveSchool.push(e.leaveSchool);
            reserve.push(e.reserve);
          }
          this.dataLabels = data1;
          this.dataList1 = studying;
          this.dataList2 = studyWait;
          this.dataList3 = reserve;
          this.dataList4 = leaveSchool;
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
    exportExcelStatusKids() {
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcel();
        ChartStatisticalService.exportExcelStatusKids(
          this.moment(this.dataSearch.year).get("year")
        )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `TRANG_THAI_HOC_SINH_NAM_${this.moment(
                  this.dataSearch.year
                ).get("year")}`;
                const tHeader = [
                  "Tháng",
                  "Đang học",
                  "Chờ học",
                  "Bảo lưu",
                  "Nghỉ học",
                  "Ra trường",
                ];
                const filterVal = [
                  "pro1",
                  "pro2",
                  "pro3",
                  "pro4",
                  "pro5",
                  "pro6",
                ];
                let columnList = [
                  { col: 10 },
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
        name: "A3:F3",
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
.color-5 {
  background: #000;
}
// .chartViewAll {
//   margin-top: 30px;
//   display: flex;
//   flex-direction: row;
// }
// .statusAll {
//   width: 30%;
// }
// .statusStudding {
//   width: 70%;
// }
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
</style>
