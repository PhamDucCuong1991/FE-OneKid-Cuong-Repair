<template>
  <div>
    <el-date-picker
      :clearable="false"
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
      <div>
        <el-row :gutter="50" style="margin-bottom: 10px">
          <el-col :span="8" style="color: white"
            ><div class="grid-content bg-purple">
              <div class="content-line-1 color-4">
                <i class="el-icon-edit-outline"></i>
                Đã thu:
                {{ this.loda.sumBy(this.dataListIn) | formatCurrencyNew }}
              </div>
            </div></el-col
          >
          <el-col :span="8" style="color: white"
            ><div class="grid-content bg-purple">
              <div class="content-line-1 color-5">
                <i class="el-icon-edit-outline"></i>
                Đã chi:
                {{ this.loda.sumBy(this.dataListOut) | formatCurrencyNew }}
              </div>
            </div></el-col
          >
          <el-col :span="8" style="color: white"
            ><div class="grid-content bg-purple">
              <div class="content-line-1 color-6">
                <i class="el-icon-edit-outline"></i>
                Đã thu - Đã chi:
                {{ this.loda.sumBy(this.dataListOutIn) | formatCurrencyNew }}
              </div>
            </div></el-col
          >
        </el-row>
        <spinner-custom v-if="loadChart" />
        <div v-else>
          <ChartBar
            v-if="loaded"
            :checkLable="true"
            :chartData="dataConllection.chartData"
            :options="dataConllection.options"
          ></ChartBar>
        </div>
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

      dataSearch: {
        year: this.moment().format("YYYY-MM-DD"),
      },
      dataLabels: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      dataListIn: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      dataListOut: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
      dataListOutIn: [
        1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000,
      ],
    };
  },
  async mounted() {
    this.fillData();
    this.loaded = false;
    await this.searchByProperties();
  },
  methods: {
    fillData() {
      this.dataConllection = {
        chartData: {
          labels: this.dataLabels,
          datasets: [
            {
              type: "line",
              label: "Đã thu - Đã chi",
              data: this.dataListOutIn,
              borderColor: "black",
              fill: false,
            },
            {
              label: "Đã thu",
              data: this.dataListIn,
              backgroundColor: "#6aa5e3",
            },
            {
              label: "Đã chi",
              data: this.dataListOut,
              backgroundColor: "#fd4803",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Thống kê thu chi nội bộ",
            fontSize: 20,
            fontColor: "#000",
          },

          plugins: {
            datalabels: {
              color: "black",
              anchor: "end",
              align: "end",
              formatter: (value, ctx) => {
                if (ctx.datasetIndex == 0) {
                  return "";
                }
                return value != 0 ? value.toLocaleString("vi") + " đ" : "";
              },
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: (value) => {
                    return ` ${value.toLocaleString("vi")} đ`;
                  },
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
    searchByProperties() {
      this.loadChart = true;
      ChartStatisticalService.findCashInternalPayMoney(
        this.moment(this.dataSearch.year).get("year")
      )
        .then((resp) => {
          let results = resp.data.data;
          let dataLabels = [];
          let moneyIn = [];
          let moneyOut = [];
          let moneyOutIn = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            dataLabels.push(e.name);
            moneyIn.push(e.moneyIn);
            moneyOut.push(e.moneyOut);
            moneyOutIn.push(e.moneyIn - e.moneyOut);
          }
          this.dataLabels = dataLabels;
          this.dataListIn = moneyIn;
          this.dataListOut = moneyOut;
          this.dataListOutIn = moneyOutIn;
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
  // background: #c694f9;
  background: #6aa5e3;
}
.color-2 {
  // background: #6aa5e3;
  background: #fd4803;
}
.color-3 {
  background: #fb9a00;
}
.color-4 {
  background: #6aa5e3;
}
.color-5 {
  background: #fd4803;
}
.color-6 {
  background: black;
}
</style>
