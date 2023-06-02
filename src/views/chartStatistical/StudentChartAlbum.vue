<template>
  <div>
    <div>
      <el-radio-group v-model="type" @change="handleChangeAction">
        <el-radio-button label="class">Lớp</el-radio-button>
        <el-radio-button label="all">Trường</el-radio-button>
      </el-radio-group>
      <span
          class="detail-name"
          v-if="type == 'class'"
          style="margin-left: 50px; margin-top: 20px"
      >
        <el-radio-group
            v-model="dataSearch.typeSchool"
            @change="searchByProperties()"
        >
          <el-radio label="grade">Xem theo khối</el-radio>
          <el-radio label="class">Xem theo lớp</el-radio>
        </el-radio-group>

        <span
        ><el-date-picker
            style="margin-left: 25px; width: 140px"
            :clearable="false"
            class="button-left-status"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="dataSearch.date"
            type="date"
            @change="searchByProperties()"
            placeholder="Chọn ngày"
        >
          </el-date-picker
          ></span>
      </span>

      <span
          class="detail-name"
          v-if="type == 'all'"
          style="margin-left: 50px; margin-top: 20px"
      >
        <el-date-picker
            :clearable="false"
            class="button-left-status"
            style="width: 265px"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="dataSearchSchoolDate.dateList"
            type="daterange"
            unlink-panels
            range-separator="-"
            @change="searchByPropertiesSchoolDate()"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
        >
        </el-date-picker>
      </span>
    </div>
    <!-- all - detail -->
    <div style="margin-top: 20px">
      <el-row :gutter="50" style="margin-bottom: 10px">
        <el-col :span="12" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-2">
              <i class="el-icon-chat-line-square"></i>
              Đã duyệt:
              {{
                this.type == "class"
                    ? this.loda.sumBy(this.dataAlbumYes)
                    : this.loda.sumBy(this.dataDateSchoolAlbumYes)
              }}
            </div>
          </div>
        </el-col
        >
        <el-col :span="12" style="color: white"
        >
          <div class="grid-content bg-purple">
            <div class="content-line-1 color-4">
              <i class="el-icon-edit-outline"></i>
              Chưa duyệt:
              {{
                this.type == "class"
                    ? this.loda.sumBy(this.dataAlbumNo)
                    : this.loda.sumBy(this.dataDateSchoolAlbumNo)
              }}
            </div>
          </div>
        </el-col
        >
      </el-row>
      <spinner-custom v-if="loadChart"/>
      <div v-else>
        <span v-if="type == 'class'">
          <ChartBar
              style="height: 350px"
              v-if="loaded"
              :chartData="dataConllection.chartData"
              :options="dataConllection.options"
              :checkLable="true"
          ></ChartBar>
        </span>
        <span v-if="type == 'all'">
          <ChartBar
              v-if="loaded"
              :chartData="dataConllection2.chartData"
              :options="dataConllection2.options"
              :checkLable="true"
          ></ChartBar>
        </span>
      </div>
    </div>
    <div class="album-date">
      <span
          class="detail-name"
          v-if="type == 'class'"
          style="margin-left: 50px"
      >
        <!-- chọn khối -->
        <el-select
            v-if="this.getAppTypeUserLogin == 'plus'"
            class="button-left-status"
            style="width: 140px"
            :clearable="true"
            v-model="dataSearchDate.idGrade"
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
            v-model="dataSearchDate.idClass"
            placeholder="Chọn lớp"
            @change="searchByPropertiesDate()"
        >
          <el-option
              v-for="item in classOfGradeList"
              :key="item.id"
              :value="item.id"
              :label="item.className"
          ></el-option>
        </el-select>

        <el-date-picker
            :clearable="false"
            class="button-left-status"
            style="width: 265px"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="dataSearchDate.dateList"
            type="daterange"
            unlink-panels
            range-separator="-"
            @change="searchByPropertiesDate()"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
        >
        </el-date-picker>

        <div style="margin-top: 20px">
          <el-row :gutter="50" style="margin-bottom: 10px">
            <el-col :span="12" style="color: white"
            ><div class="grid-content bg-purple">
                <div class="content-line-1 color-2">
                  <i class="el-icon-chat-line-square"></i>
                  Đã duyệt:
                  {{ this.loda.sumBy(this.dataDateAlbumYes) }}
                </div>
              </div></el-col
            >
            <el-col :span="12" style="color: white"
            ><div class="grid-content bg-purple">
                <div class="content-line-1 color-4">
                  <i class="el-icon-edit-outline"></i>
                  Chưa duyệt:
                  {{ this.loda.sumBy(this.dataDateAlbumNo) }}
                </div>
              </div></el-col
            >
          </el-row>
          <spinner-custom v-if="loadChart1"/>
          <div v-else>
            <span v-if="type == 'class'">
              <ChartBar
                  style="height: 350px"
                  v-if="loaded"
                  :chartData="dataConllection1.chartData"
                  :options="dataConllection1.options"
                  :checkLable="true"
              ></ChartBar>
            </span>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import ChartStatisticalService from "@/services/ChartStatisticalService";
import TeacherService from "@/services/TeacherService";
import MaClassService from "@/services/MaClassService";
import ChartBar from "./chart/ChartBar.vue";
import {mapState, mapActions} from 'vuex';

export default {
  components: {ChartBar},
  data() {
    return {
      dataConllection: null,
      dataConllection1: null,
      dataConllection2: null,
      loaded: false,
      loadChart: false,
      loadChart1: false,
      loadChart3: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      type: "class",
      dataSearch: {
        typeSchool: "grade",
        date: this.moment().format("YYYY-MM-DD"),
      },
      dataSearchDate: {
        idGrade: "",
        idClass: "",
        dateList: [
          this.moment().subtract(29, "days").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
      },
      dataSearchSchoolDate: {
        dateList: [
          this.moment().subtract(29, "days").format("YYYY-MM-DD"),
          this.moment().format("YYYY-MM-DD"),
        ],
      },
      dataLabels: [],
      dataDateLabels: [],
      dataAlbumYes: [1, 2, 3, 4],
      dataAlbumNo: [1, 2, 3, 4],
      dataDateAlbumYes: [1, 2, 3, 4],
      dataDateAlbumNo: [1, 2, 3, 4],
      dataDateTotal: [1, 2, 3, 4],
      dataDateSchoolLabels: [],
      dataDateSchoolAlbumYes: [1, 2, 3, 4],
      dataDateSchoolAlbumNo: [1, 2, 3, 4],
      dataDateSchoolTotal: [1, 2, 3, 4],
    };
  },
  async mounted() {
    this.fillData();
    this.fillDataDate();
    this.fillDataSchoolDate();
    this.loaded = false;
    await this.searchByProperties();
    await this.searchByPropertiesSchoolDate();
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
    handleChangeAction() {
      if (this.type == "class") {
        this.searchByProperties();
        this.searchByPropertiesDate();
      } else {
        this.searchByPropertiesSchoolDate();
      }
    },
    fillData() {
      this.dataConllection = {
        chartData: {
          labels: this.dataLabels,
          datasets: [
            {
              label: "Đã duyệt",
              backgroundColor: "#6aa5e3",
              fill: false,
              data: this.dataAlbumYes,
            },
            {
              label: "Chưa duyệt",
              backgroundColor: "#ef5b5b",
              fill: false,
              data: this.dataAlbumNo,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: "Album ảnh theo khối, lớp",
            fontSize: 18,
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

    fillDataDate() {
      this.dataConllection1 = {
        chartData: {
          labels: this.dataDateLabels,
          datasets: [
            {
              label: "Đã duyệt",
              backgroundColor: "#6aa5e3",
              data: this.dataDateAlbumYes,
            },
            {
              label: "Chưa duyệt",
              backgroundColor: "#ef5b5b",
              data: this.dataDateAlbumNo,
            },
            {
              type: "scatter",
              label: "",
              data: this.dataDateTotal,
              backgroundColor: "rgba(255, 255, 255, 0.01)",
              borderColor: "rgba(255, 255, 255, 0.01)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,

          title: {
            display: true,
            text: "Album ảnh theo ngày",
            fontSize: 18,
            fontColor: "#000",
          },
          plugins: {
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
          },
          scales: {
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
          },
        },
      };
    },

    fillDataSchoolDate() {
      this.dataConllection2 = {
        chartData: {
          labels: this.dataDateSchoolLabels,
          datasets: [
            {
              label: "Đã duyệt",
              backgroundColor: "#6aa5e3",
              data: this.dataDateSchoolAlbumYes,
            },
            {
              label: "Chưa duyệt",
              backgroundColor: "#ef5b5b",
              data: this.dataDateSchoolAlbumNo,
            },
            {
              type: "scatter",
              label: "",
              data: this.dataDateSchoolTotal,
              backgroundColor: "rgba(255, 255, 255, 0.01)",
              borderColor: "rgba(255, 255, 255, 0.01)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,

          title: {
            display: true,
            text: "Album ảnh theo trường",
            fontSize: 20,
            fontColor: "#000",
          },
          plugins: {
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
          },
          scales: {
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
          },
        },
      };
    },

    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.loadChart = true;
      ChartStatisticalService.findAlbumKids(
          this.dataSearch.typeSchool,
          this.dataSearch.date
      )
          .then((resp) => {
            let results = resp.data.data;
            let albumYes = [];
            let albumNo = [];
            let data1 = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              data1.push(e.name);
              albumYes.push(e.albumYes);
              albumNo.push(e.albumNo);
            }
            this.dataLabels = data1;
            this.dataAlbumYes = albumYes;
            this.dataAlbumNo = albumNo;
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
    async searchDataMethod() {
      this.searchByPropertiesDate();
      await this.getClassInGrade();
    },
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {

        this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearchDate.idGrade])
    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
          .then((resp) => {
            this.classOfGradeList = resp.data.data;
            this.dataSearchDate.idClass = this.classOfGradeList.filter(
                (x) => x.checked
            )[0].id;
          })
          .catch((err) => {
            console.log(err);
          });
    },

    checkDateList() {
      if (this.dataSearchDate.dateList == null) {
        this.dataSearchDate.dateList = "";
      }
    },
    searchByPropertiesDate() {
      this.loadChart1 = true;
      this.checkDateList();
      ChartStatisticalService.findAlbumDateKids(
          this.dataSearchDate.idGrade,
          this.dataSearchDate.idClass,
          this.dataSearchDate.dateList
      )
          .then((resp) => {
            let results = null;
            if (this.getAppTypeUserLogin == "teacher") {
              results = this.dataSearchDate.idClass != "" ? resp.data.data : [];
            } else {
              results = resp.data.data;
            }
            let dataLabels = [];
            let albumYes = [];
            let albumNo = [];
            let total = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              dataLabels.push(e.name);
              albumYes.push(e.albumYes);
              albumNo.push(e.albumNo);
              total.push(
                  e.albumNo * e.albumYes != 0 ? e.albumNo + e.albumYes : 0
              );
            }
            this.dataDateLabels = dataLabels;
            this.dataDateAlbumYes = albumYes;
            this.dataDateAlbumNo = albumNo;
            this.dataDateTotal = total;
            this.loaded = true;
            this.fillDataDate();
          })
          .catch(() => {
            this.$message({
              message: "Failed to get the data",
              type: "error",
            });
            this.loadChart1 = false;
          })
          .finally(() => {
            setTimeout(() => {
              this.loadChart1 = false;
            }, 500);
          });
    },

    searchByPropertiesSchoolDate() {
      this.loadChart = true;
      this.checkDateList();
      ChartStatisticalService.findAlbumSchoolDateKids(
          this.dataSearchSchoolDate.dateList
      )
          .then((resp) => {
            let results = resp.data.data;
            let dataLabels = [];
            let albumYes = [];
            let albumNo = [];
            let total = [];
            for (let i = 0; i < results.length; i++) {
              const e = results[i];
              dataLabels.push(e.name);
              albumYes.push(e.albumYes);
              albumNo.push(e.albumNo);
              total.push(
                  e.albumYes * e.albumNo != 0 ? e.albumNo + e.albumYes : 0
              );
            }
            this.dataDateSchoolLabels = dataLabels;
            this.dataDateSchoolAlbumYes = albumYes;
            this.dataDateSchoolAlbumNo = albumNo;
            this.dataDateSchoolTotal = total;
            this.loaded = true;
            this.fillDataSchoolDate();
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
      this.searchByPropertiesDate();
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

.album-date {
  margin-top: 25px;
  // margin-left: 150px;
}
</style>
