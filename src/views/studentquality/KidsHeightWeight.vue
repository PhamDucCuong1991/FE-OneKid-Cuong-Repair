<template>
  <div class="content">
    <!-- add -->
    <div style="margin-bottom: -20px; position: relative; z-index: 1">
      <div v-if="showAdd">
        <el-date-picker
          class="button-left-class1"
          v-model="dataAddSearch.date"
          type="date"
          :clearable="false"
          format="dd-MM-yyyy"
          @change="getAllKidHeightWeight('date')"
          :disabled="checkDisable"
          value-format="yyyy-MM-dd"
          placeholder="Chọn ngày"
          :picker-options="pickerOptions"
        ></el-date-picker>

        <el-select
          class="button-left-status"
          v-model="dataAddSearch.status"
          @change="getAllKidHeightWeight()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in kidStatusList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>

        <!-- chọn khối -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataAddSearch.idGrade"
          @change="changeGradeDetail()"
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
          class="input-common input-class"
          style="width: 140px; margin-left: 5px; margin-right: 5px"
          v-model="dataAddSearch.idClass"
          placeholder="Chọn lớp"
          @change="getAllKidHeightWeight('date')"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <el-input
          class="button-left-class"
          style="width: 220px"
          placeholder="Nhập tên"
          clearable
          v-model="dataAddSearch.codeOrName"
          @change="getAllKidHeightWeight()"
          @keyup.enter.native="getAllKidHeightWeight()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getAllKidHeightWeight()"
          ></el-button>
        </el-input>
      </div>
      <!-- history -->
      <div
        v-else-if="showHistory"
        style="margin-bottom: -20px; position: relative; z-index: 1"
      >
        <el-date-picker
          class="button-left-class1"
          v-model="selectDate"
          type="date"
          :disabled="checkDisable"
          placeholder="Chọn ngày"
          :picker-options="pickerOptions"
        >
          ></el-date-picker
        >

        <el-select
          class="button-left-status"
          v-model="dataSearch.status"
          @change="getAllKidHeightWeightHistory()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in kidStatusList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>

        <!-- chọn khối -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="input-common input-grade"
          style="width: 140px"
          v-model="dataSearch.idGrade"
          @change="changeGradeDetailH()"
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
          class="input-common input-class"
          style="width: 140px; margin-left: 5px; margin-right: 5px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="getAllKidHeightWeightHistory()"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <el-input
          class="button-left-clas"
          style="width: 220px"
          placeholder="Nhập mã hoặc tên"
          clearable
          v-model="dataSearch.codeOrName"
          @change="getAllKidHeightWeightHistory()"
          @keyup.enter.native="getAllKidHeightWeightHistory()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getAllKidHeightWeightHistory()"
          ></el-button>
        </el-input>
      </div>
    </div>

    <div class="lblthemlichsu">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Thêm cân đo" name="AddHeightWeight">
          <!-- table -->
          <div class="table-content row-data">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="AddHeightWeightList"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChange"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                align="center"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fullName"
                label="Họ và tên"
                align="left"
              ></el-table-column>
              <el-table-column label="Ngày sinh" width="140" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.birthDay | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="weight" label="Cân nặng " align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.weight"
                    style="width: 60px; border: 1px solid #ffffff !important"
                    placeholder="......."
                    value
                  ></el-input
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Kg
                </template>
              </el-table-column>

              <el-table-column label="Ngày cân " align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    class="button-left-class3"
                    v-model="scope.row.timeWeight"
                    type="date"
                    align="center"
                    placeholder="Chọn ngày"
                    value-format="yyyy-MM-dd"
                    format="dd-MM-yyyy"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </template>
              </el-table-column>

              <el-table-column prop="height" label="Chiều cao" align="center">
                <template slot-scope="scope">
                  <el-input
                    class="button-left-class0"
                    v-model="scope.row.height"
                    style="width: 60px"
                    placeholder="......."
                  ></el-input
                  >Cm
                </template>
              </el-table-column>
              <el-table-column label="Ngày đo " align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    class="button-left-class9"
                    v-model="scope.row.timeHeight"
                    type="date"
                    placeholder="Chọn ngày"
                    value-format="yyyy-MM-dd"
                    format="dd-MM-yyyy"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </template>
              </el-table-column>

              <el-table-column
                label="Tác vụ"
                width="160"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="
                      checkPermission(['studentQuality_heightWeight_update'])
                    "
                    size="mini"
                    type="success"
                    @click="handleSave(scope.row)"
                    >Lưu</el-button
                  >

                  <!-- <el-button size="mini" type="warning" @click="setCurrent()">Làm mới</el-button> -->
                  <el-button
                    size="mini"
                    @click="handleViewDetail(scope.$index, scope.row)"
                    type="primary"
                    >Chi tiết</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="btt">
              <el-dropdown @command="handleCommand">
                <el-button class="button-over" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu class="el-dropdown-menu-container">
                  <el-dropdown-item command="exportExcelAll"
                    >Xuất các học sinh</el-dropdown-item
                  >
                  <el-dropdown-item command="exportExcelNew"
                    >Xuất mới nhất trong tháng</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <!-- -- -->
        </el-tab-pane>

        <!-- lich su -->
        <el-tab-pane label="Lịch sử cân đo" name="HistoryHeightWeight">
          <div class="table-content row-data">
            <el-table
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="kidsHeightWeightHistoryList"
              @selection-change="handleSelectionChange"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                align="center"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="fullName"
                label="Họ và tên"
                align="left"
              ></el-table-column>

              <el-table-column
                prop="weight"
                label="Cân nặng (Kg)"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="timeWeight"
                label="Ngày cân mới nhất"
                width="160"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="height"
                label="Chiều cao (Cm)"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="timeHeight"
                label="Ngày đo mới nhất"
                width="160"
                align="center"
              ></el-table-column>

              <el-table-column
                label="Tác vụ"
                width="150"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    class="buttonxemchitiet"
                    size="mini"
                    type="primary"
                    @click="handleViewDetail(scope.$index, scope.row)"
                    >Chi tiết</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="btt">
              <el-button
                class="button-over"
                type="success"
                @click="exportExcelKidsHeightWeightNew()"
                >Xuất file Excel</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <KidsHeightWeightDetail
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="KidsHeightWeightDetail"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import KidsHeightWeightDetail from "./KidsHeightWeightDetail.vue";
import KidsHeightWeightService from "@/services/KidsHeightWeightService";
import TeacherService from "@/services/TeacherService";
// import http from "../../http-download";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  components: {
    KidsHeightWeightDetail,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      kidStatusList: [
        { key: "STUDYING", value: "Đang học" },
        { key: "STUDY_WAIT", value: "Chờ học" },
        { key: "RESERVE", value: "Bảo lưu" },
        { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
      ],

      activeName: "AddHeightWeight",
      showAdd: true,
      showHistory: false,
      pageTotal: this.$pageTotalDefault,
      pageSize: this.$pageSizeDefault,
      showCreateDialog: false,
      multipleSelection: [],
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidsHeightWeightHistoryList: [],
      AddHeightWeightList: [],
      checkDisable: false,
      value2: "",
      selectDate: "",
      value3: "",
      value4: "",
      value5: "",
      position: "",
      position1: "",
      newBrandCreated: null,
      newFeedbackUpdate: null,
      // -------
      value: "",
      dataAddSearch: {
        date: "",
        status: "STUDYING",
        idGrade: "",
        idClass: "",
        codeOrName: "",
      },

      dataSearch: {
        status: "STUDYING",
        idGrade: "",
        idClass: "",
        codeOrName: "",
      },
      maClassList: [],
      newHeightWeight: {
        weight: "",
        timeWeight: "",
        height: "",
        timeHeight: "",
      },

      newHeightWeightCreated: null,
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
    // ----
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
    checkPermission,
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCommand(command) {
      if (command == "exportExcelNew") {
        this.exportExcelKidsHeightWeightNew();
      } else if (command == "exportExcelAll") {
        this.exportExcelKidsHeightWeightAll();
      }
    },
    exportExcelKidsHeightWeightNew() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelNew();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        // let nowDate = moment().format("YYYY-MM-DD");
        KidsHeightWeightService.getExportExcelNew(list, this.dataAddSearch.idClass, this.dataAddSearch.date )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `BANG_KE_SO_ĐO_CHIEU_CAO_CAN_NANG_MOI_NHAT_${myDate}`;
                const merges = ["A5:F5"];
                const tHeader = [
                  "STT",
                  "Họ tên",
                  "Ngày cân",
                  "Cân nặng (Kg)",
                  "Ngày đo",
                  "Chiều cao (Cm)",
                ];
                const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5", "pro6" ];
                let columnList = [
                  { col: 5 },
                  { col: 25 },
                  { col: 20 },
                  { col: 25 },
                  { col: 20 },
                  { col: 25 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
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
    exportExcelKidsHeightWeightAll() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));

      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelAll();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        KidsHeightWeightService.getExportExcelWeightHeight(list)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `BANG_KE_SO_ĐO_CHIEU_CAO_CAN_NANG_${myDate}`;
                const merges = ["A5:D5"];
                const tHeader = [
                  "STT",
                  "Ngày thực hiện",
                  "Cân nặng (Kg)",
                  "Chiều cao (Cm)",
                ];
                const filterVal = ["pro1", "pro2", "pro3", "pro4", ];
                let columnList = [
                  { col: 5 },
                  { col: 20 },
                  { col: 25 },
                  { col: 25 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
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
    //Style css ExcelAll
    getStyleExcelAll() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();

      let style1 = {
        name: "A5:E5",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A6:E6",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font,
          alignment,
          border,
        },
      };
      let style3 = {
        name: "A7:E50",
        style: {
          fill: { fgColor: { rgb: "ffff74" } },
          alignment,
          font: { sz: "11" },
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };

      this.styleCols2.push(style1);
      this.styleCols2.push(style3);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);

      this.styleCols2.push(style2);
    },
    //Style css ExcelNew
    getStyleExcelNew() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();

      let style1 = {
        name: "A5:B5",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font: { bold: true, sz: "11", color: { rgb: "ff0000" } },
          alignment,
          border,
        },
      };
      let style2 = {
        name: "A6:F6",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font,
          alignment,
          border,
        },
      };
      let style3 = {
        name: "C5:F5",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };

      this.styleCols2.push(style1);
      this.styleCols2.push(style3);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);

      this.styleCols2.push(style2);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.studentList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.pageTotal = this.studentList.length;
    },

    changeDate() {
      this.AddHeightWeightList.forEach((element) => {
        element.timeHeight = this.dataAddSearch.date;
        element.timeWeight = this.dataAddSearch.date;
      });
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "AddHeightWeight") {
        this.showAdd = true;
        this.showHistory = false;
        this.checkDisable = false;
      } else if (tabNameClick == "HistoryHeightWeight") {
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      }
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.getAllKidHeightWeightHistory();
    },
    // search history
    getAllKidHeightWeightHistory() {
      this.loadingData = true;
      this.textTable = "";
      KidsHeightWeightService.searchWeightHeight(
        "",
        this.dataSearch.status,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.codeOrName
      )
        .then((resp) => {
          if (this.getAppTypeUserLogin == "teacher") {
            this.kidsHeightWeightHistoryList =
              this.dataSearch.idClass != ""
                ? resp.data.data.kidsHeightWeightResponse
                : [];
          } else {
            this.kidsHeightWeightHistoryList =
              resp.data.data.kidsHeightWeightResponse;
          }
          // this.kidsHeightWeightHistoryList =
          //   resp.data.data.kidsHeightWeightResponse;
        })
        .catch((err) => {
          this.kidsHeightWeightHistoryList = null;
          console.log(err);
        })
        .finally(() => {
          if (this.kidsHeightWeightHistoryList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    // search add
    getAllKidHeightWeight(searchType) {
      this.loadingData = true;
      this.textTable = "";
      KidsHeightWeightService.searchWeightHeight(
        this.dataAddSearch.date,
        this.dataAddSearch.status,
        this.dataAddSearch.idGrade,
        this.dataAddSearch.idClass,
        this.dataAddSearch.codeOrName
      )
        .then((resp) => {
          if (this.getAppTypeUserLogin == "teacher") {
            this.AddHeightWeightList =
              this.dataAddSearch.idClass != ""
                ? resp.data.data.kidsHeightWeightResponse
                : [];
          } else {
            this.AddHeightWeightList = resp.data.data.kidsHeightWeightResponse;
          }
          // this.AddHeightWeightList = resp.data.data.kidsHeightWeightResponse;
        })
        .catch((err) => {
          this.AddHeightWeightList = null;
          console.log(err);
        })
        .finally(() => {
          if (searchType == "date" || searchType == "first") {
            this.changeDate();
          }
          if (this.AddHeightWeightList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    //click save
    handleSave(row) {
      let a = this.AddHeightWeightList;
      console.log(a);
      this.loadingButton = true;
      KidsHeightWeightService.create(row)

        .then((response) => {
          this.newBrandCreated = response.data.data;
          this.$message({
            message: "Lưu số đo thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },

    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilter = this.studentList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    // click xem chi tiet
    handleViewDetail(index, row) {
      this.showCreateDialog = true;
      this.$refs.KidsHeightWeightDetail.getDetailKidsMethod(row.id);
    },

    async changeGradeDetail() {
      await this.getClassInGrade();
      this.getAllKidHeightWeight();
    },

    async changeGradeDetailH() {
      await this.getClassInGradeH();
      this.getAllKidHeightWeightHistory();
    },

    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeOfSchoolList.length > 0) {
            this.dataAddSearch.idGrade = this.gradeOfSchoolList[0].id;
          }
    },
    async getAllGradeH() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);

          if (this.gradeOfSchoolList.length > 0) {
            this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
          }
    },

    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

      if (this.classOfGradeList.length > 0) {
            this.dataAddSearch.idClass = this.classOfGradeList[0].id;
          } else {
            this.dataAddSearch.idClass = "";
          }
    },
    async getClassInGradeH() {

          this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

          if (this.classOfGradeList.length > 0) {
            this.dataSearch.idClass = this.classOfGradeList[0].id;
          } else {
            this.dataSearch.idClass = "";
          }

    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.classOfGradeList = resp.data.data;
          this.dataAddSearch.idClass = this.classOfGradeList.filter(
            (x) => x.checked
          )[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //get class for teacher
    async getClassListTeacherH() {
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

    getCurrentDate() {
      this.dataAddSearch.date = moment().format("YYYY-MM-DD");
    },
    async fetchDataMany() {
      this.getCurrentDate();
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }
      this.getAllKidHeightWeight("first");
    },
    async fetchDataManyH() {
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGradeH()]);
        await this.getClassInGradeH();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacherH();
      }
      this.getAllKidHeightWeightHistory();
    },
  },

  beforeMount() {
    this.fetchDataMany();
    this.fetchDataManyH();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}

.button-select {
  margin-right: 5px;
  width: 150px;
}

/deep/.el-table th {
  padding: 10px 0;
}

.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-icon-loading:before {
  content: "\e6cf";
}
/deep/.el-loading-spinner .el-loading-text {
  color: #606266;
  font-size: 15px;
}
/deep/.el-loading-spinner {
  top: 67%;
  width: 100%;
  text-align: center;
  position: absolute;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
  border-radius: 0;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}

.button-left-class {
  margin-right: 5px;
  width: 150px;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
.button-left-class1 {
  margin-right: 5px;
  width: 133px;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}

.button-left-class9 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class2 {
  margin-right: -50px;
  width: 140px;
}
.button-left-class3 {
  margin-left: -10px;
  width: 140px;
}
.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  // border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}
// .el-dropdown-menu li {
//   color: white;
//   border-top: 1px solid white;
//   font-family: Arial, Helvetica, sans-serif;
// }
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
/deep/.el-input__inner1998 {
  border: 1px solid #ffffff;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* border: red; */
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
