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
      style="width: 160px"
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
    <span class="week" v-if="dataSearch.type == 'week'">
      <el-date-picker
        :clearable="false"
        class="button-left-status"
        style="width: 230px"
        value-format="yyyy-MM-dd"
        v-model="startWeek"
        format="Tuần WW(từ dd-MM-yyyy)"
        type="week"
        placeholder="Chọn tuần bắt đầu"
      >
      </el-date-picker>
      <el-date-picker
        :clearable="false"
        v-model="endWeek"
        class="button-left-status"
        style="width: 230px"
        value-format="yyyy-MM-dd"
        format="Tuần WW(từ dd-MM-yyyy)"
        type="week"
        @change="searchByProperties()"
        placeholder="Chọn tuần kết thúc"
      >
      </el-date-picker>
    </span>
    <el-date-picker
      v-else-if="dataSearch.type == 'month'"
      :clearable="false"
      class="button-left-status"
      style="width: 200px"
      value-format="yyyy-MM-dd"
      v-model="dataSearch.monthList"
      type="monthrange"
      range-separator="-"
      @change="searchByProperties()"
      start-placeholder="Tháng bắt đầu"
      end-placeholder="Tháng kết thúc"
    >
    </el-date-picker>
    <!-- style="background-color: #eff8ff" -->
    <div style="margin-top: 20px">
      <el-row :gutter="50" style="margin-bottom: 10px">
        <el-col :span="12" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-1">
              <i class="el-icon-chat-line-square"></i>
              Có nhận xét: {{ this.loda.sumBy(this.dataList1) }}
            </div>
          </div></el-col
        >
        <el-col :span="12" style="color: white"
          ><div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-edit-outline"></i>
              Không có nhận xét: {{ this.loda.sumBy(this.dataList2) }}
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
import TeacherService from "@/services/TeacherService";
import ChartLine from "./chart/ChartLine.vue";
import {mapActions, mapState} from "vuex";

export default {
  components: { ChartLine },
  data() {
    return {
      dataConllection: null,
      loaded: false,
      loadChart: false,
      dateListSelect: [
        { key: "date", value: "Nhận xét ngày" },
        { key: "week", value: "Nhận xét tuần" },
        { key: "month", value: "Nhận xét tháng" },
      ],
      gradeOfSchoolList: [],
      classOfGradeList: [],
      startWeek: this.moment().subtract(3, "weeks").format("YYYY-MM-DD"),
      endWeek: this.moment().format("YYYY-MM-DD"),
      dataSearch: {
        idGrade: "",
        idClass: "",
        type: "date",
        dateList: [
          this.moment().subtract(9, "days").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
        weekList: [],
        monthList: [
          this.moment().subtract(5, "months").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
      },
      dataLabels: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      dataList1: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478],
      dataList2: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000],
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
              label: "Có nhận xét",
              data: this.dataList1,
              borderColor: "#6aa5e3",
              fill: false,
            },
            {
              label: "Không có nhận xét",
              data: this.dataList2,
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
            text: "Tình trạng nhận xét",
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
      this.searchByProperties();
      await this.getClassInGrade();
    },
    async getAllGrade() {
     this.gradeOfSchoolList = mapState(["serverDataGrade"])
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
      if (this.dataSearch.weekList == null) {
        this.dataSearch.weekList = "";
      }
      if (this.dataSearch.monthList == null) {
        this.dataSearch.monthList = "";
      }
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.loadChart = true;
      this.checkDateList();
      let weekList = [];
      weekList.push(this.startWeek);
      weekList.push(this.endWeek);
      this.dataSearch.weekList = weekList;
      ChartStatisticalService.findEvaluateKids(
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.type,
        this.dataSearch.dateList,
        this.dataSearch.weekList,
        this.dataSearch.monthList
      )
        .then((resp) => {
          let results = null;
          if (this.getAppTypeUserLogin == "teacher") {
            results = this.dataSearch.idClass != "" ? resp.data.data : [];
          } else {
            results = resp.data.data;
          }
          let dataLabels = [];
          let evaluateYes = [];
          let evaluateNo = [];
          for (let i = 0; i < results.length; i++) {
            const e = results[i];
            dataLabels.push(e.name);
            evaluateYes.push(e.evaluateYes);
            evaluateNo.push(e.evaluateNo);
          }
          this.dataLabels = dataLabels;
          this.dataList1 = evaluateYes;
          this.dataList2 = evaluateNo;
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
  // background: #c694f9;
  background: #6aa5e3;
}
.color-2 {
  // background: #6aa5e3;
  background: #ef5b5b;
}
.color-3 {
  background: #feb683;
}
.color-4 {
  background: #ef5b5b;
}
</style>
