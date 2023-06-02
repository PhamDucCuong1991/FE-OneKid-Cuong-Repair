<template>
  <div>
    <div>
      <el-radio-group v-model="type" @change="searchByProperties()">
        <el-radio-button label="money">Tiền</el-radio-button>
        <el-radio-button label="status">Trạng thái</el-radio-button>
      </el-radio-group>
      <el-date-picker
        :clearable="false"
        style="margin-left: 50px; width: 130px"
        class="button-left-status"
        value-format="yyyy-MM-dd"
        v-model="dataSearch.year"
        type="year"
        @change="searchByProperties()"
        placeholder="Chọn năm"
      >
      </el-date-picker>
    </div>

    <!-- all - detail -->
    <div style="margin-top: 20px">
      <el-row :gutter="50" style="margin-bottom: 10px" v-if="type == 'money'">
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-chat-line-square"></i>
              Tiền nạp:
              {{ this.loda.sumBy(this.dataList1) | formatCurrencyNew }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-edit-outline"></i>
              Tiền rút:
              {{ this.loda.sumBy(this.dataList2) | formatCurrencyNew }}
            </div>
          </div></el-col
        >
        <el-col :span="8" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-4">
              <i class="el-icon-edit-outline"></i>
              Số dư:
              {{ this.loda.sumBy(this.dataTT) | formatCurrencyNew }}
            </div>
          </div></el-col
        >
      </el-row>
      <el-row :gutter="50" style="margin-bottom: 10px" v-else>
        <el-col :span="12" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-chat-line-square"></i>
              Đã xác nhận:
              {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div></el-col
        >
        <el-col :span="12" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-3">
              <i class="el-icon-edit-outline"></i>
              Chưa xác nhận:
              {{ this.loda.sumBy(this.dataList2) }}
            </div>
          </div></el-col
        >
      </el-row>
      <spinner-custom v-if="loadChart" />
      <div v-else>
        <ChartBar
          v-if="loaded"
          :chartData="dataConllection.chartData"
          :options="dataConllection.options"
          :checkLable="true"
        ></ChartBar>
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
      loaded: false,
      loadChart: false,
      type: "money",
      dataSearch: {
        year: this.moment().format("YYYY-MM-DD"),
      },
      dataLabels: [],
      dataList1: [],
      dataList2: [],
      dataTT: [],
    };
  },
  async mounted() {
    this.fillData();
    this.loaded = false;
    await this.searchByProperties();
  },
  computed: {
    datasets1() {
      if (this.type == "money") {
        return [
          {
            type: "line",
            label: "Số dư ví",
            borderColor: "black",
            fill: false,
            data: this.dataTT,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Tiền nạp",
            backgroundColor: "#6aa5e3",
            data: this.dataList1,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Tiền rút",
            backgroundColor: "#ef5b5b",
            data: this.dataList2,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
        ];
      } else {
        return [
          {
            label: "Đã xác nhận",
            backgroundColor: "#6aa5e3",
            data: this.dataList1,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            label: "Chưa xác nhận",
            backgroundColor: "#ef5b5b",
            data: this.dataList2,
            hoverBorderWidth: 2,
            hoverBorderColor: "#6f6f6f",
          },
          {
            type: "scatter",
            label: "",
            data: this.dataTT,
            backgroundColor: "rgba(255, 255, 255, 0.01)",
            borderColor: "rgba(255, 255, 255, 0.01)",
          },
        ];
      }
    },
    titleText() {
      if (this.type == "money") {
        return "Thống kê tiền trong ví";
      } else {
        return "Trạng thái giao dịch";
      }
    },
    setDataLabel() {
      if (this.type == "money") {
        return {
          datalabels: {
            color: "#000",
            anchor: "end",
            align: "end",
            offset: 5,
            formatter: (value, ctx) => {
              if (ctx.datasetIndex == 0) {
                return "";
              }
              return value != 0 ? value.toLocaleString("vi") + " đ" : "";
            },
          },
          zoom: {
            zoom: {
              onZoomComplete(c) {
                setTimeout(() => {
                  c.chart.resetZoom();
                }, 10000);
              },
              enabled: true,
              mode: "x",
              speed: 1,
            },
            pan: {
              enabled: true,
              mode: "x",
            },
          },
        };
      } else {
        return {
          datalabels: {
            color: "#000",
            anchor: function (ctx) {
              return ctx.dataset.type == "scatter" ? "end" : "center";
            },
            align: function (ctx) {
              return ctx.dataset.type == "scatter" ? "end" : "center";
            },
            offset: function (ctx) {
              return ctx.dataset.type == "scatter" ? -5 : 0;
            },
            formatter: (value) => {
              return value > 0 ? value : "";
            },
          },
        };
      }
    },
    setScales() {
      if (this.type == "money") {
        return {
          yAxes: [
            {
              ticks: {
                callback: (value) => {
                  return ` ${value.toLocaleString("vi")} đ`;
                },
              },
            },
          ],
        };
      } else {
        return {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              display: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        };
      }
    },
  },
  methods: {
    fillData() {
      this.dataConllection = {
        chartData: {
          labels: this.dataLabels,
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
          scales: this.setScales,
          plugins: this.setDataLabel,
        },
      };
    },

    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.loadChart = true;
      ChartStatisticalService.findWalletParent(
        this.moment(this.dataSearch.year).get("year"),
        this.type
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataList1 = [];
          let dataList2 = [];
          let dataTT = [];
          let data1 = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            data1.push(e.name);
            if (this.type == "money") {
              dataList1.push(e.moneyIn);
              dataList2.push(e.moneyOut);
              dataTT.push(e.moneyIn - e.moneyOut);
            } else {
              dataList1.push(e.feesYes);
              dataList2.push(e.feesNo);
              dataTT.push(e.feesNo * e.feesYes != 0 ? e.feesNo + e.feesYes : 0);
            }
          }
          this.dataLabels = data1;
          this.dataList1 = dataList1;
          this.dataList2 = dataList2;
          this.dataTT = dataTT;
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
  background: #ef5b5b;
}
.color-4 {
  background: #000;
}
.chartViewAll {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
}
.statusAll {
  width: 30%;
}
.statusStudding {
  width: 70%;
}
</style>
