<template>
  <div class="content">
    <!-- add -->
    <div class="hasagi">
      <el-date-picker
        class="button-left-class1"
        v-model="dataSearch.date"
        type="date"
        @change="searchHeaderMethod()"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        placeholder="Chọn ngày"
      ></el-date-picker>

      <!-- chọn khối -->
      <el-select
        v-if="this.getAppTypeUserLogin == 'plus'"
        class="button-left-class"
        v-model="dataSearch.idGrade"
        clearable
        @change="changeGradeMethod()"
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
        class="button-left-class"
        filterable
        v-model="dataSearch.idClass"
        placeholder="Chọn lớp"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in classOfGradeList"
          :key="item.id"
          :value="item.id"
          :label="item.className"
        ></el-option>
      </el-select>

      <el-select
        class="button-left-class"
        v-model="dataSearch.confirmStatus"
        @change="searchHeaderMethod()"
        placeholder="Trạng thái"
        clearable
      >
        <el-option
          v-for="item in confirmStatus"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-select
        class="button-left-class"
        v-model="dataSearch.dateSick"
        @change="searchHeaderMethod()"
        placeholder="Tình trạng"
        clearable
      >
        <el-option
          v-for="item in dateSick"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-input
        class="button-left-class"
        style="width: 260px"
        placeholder="Nhập nội dung tìm kiếm"
        clearable
        v-model="dataSearch.name"
        @change="searchHeaderMethod()"
        @keyup.enter.native="searchHeaderMethod()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethod()"
        ></el-button>
      </el-input>

      <div
        v-if="checkPermission(['parentDiary_medicine_update'])"
        class="buttondropdown"
      >
        <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="handleRead"
              >Duyệt đã đọc</el-dropdown-item
            >
            <el-dropdown-item command="handleConfirm"
              >Xác nhận</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="medicinelist"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          prop="kidName"
          label="Họ và tên"
          width="180"
          fixed
        ></el-table-column>
        <el-table-column
          prop="clasName"
          label="Lớp"
          width="180"
        ></el-table-column>

        <el-table-column label="Ngày gửi đơn" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="schoolFeedback"
          label="Phản hồi"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="medicineContent"
          label="Nội dung"
          min-width="300"
        ></el-table-column>
        <el-table-column label="Ngày uống" width="220" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fromDate | formatDate }}</span>
            <span> đến </span>
            <span>{{ scope.row.toDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="numberFile"
          label="Số file"
          width="80"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          label="Trạng thái"
          width="140"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.confirmStatus">Đã xác nhận</span>
            <span v-else style="color: #f56c6c">Chưa xác nhận</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Chi tiết</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="paging-click row-data"
      style="float: right; margin-bottom: 10px"
    >
      <el-pagination
        background
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <ViewMedicationAdvice
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewMedicationAdvice"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import MedicineService from "@/services/MedicineService";
import ViewMedicationAdvice from "./ViewMedicationAdvice";
import TeacherService from "@/services/TeacherService";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  components: {
    ViewMedicationAdvice,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      multipleSelection: [],
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      confirmStatus: [
        { status: true, label: "Đã xác nhận" },
        { status: false, label: "Chưa xác nhận" },
      ],
      dateSick: [{ status: "medicines", label: "Đang uống thuốc" }],

      showCreateDialog: false,
      medicinelist: [],
      gradeOfSchoolList: [],
      maClassList: [],
      classOfGradeList: [],
      classOfGradeFilterList: [],
      checkDisable: false,

      value: "",
      date: "",
      dataSearch: {
        date: "",
        idGrade: "",
        idClass: "",
        confirmStatus: "",
        dateSick: "",
        name: "",
      },
    };
    // ----
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
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
    handleViewDetail(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewMedicationAdvice.getDetailMessageInitial(row.id);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCommandActionDetailDate(command) {
      if (command == "approvedTrue") {
        this.handleApprovedDetailDate(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedDetailDate(false);
      }
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

    getBeforeSearch() {
      if (this.dataSearch.idGrade == "") {
        this.classOfGradeFilterList = this.classOfGradeList;
      } else {
        console.log(this.gradeOfSchoolList);
        console.log(this.classOfGradeFilterList);

        let grade = this.gradeOfSchoolList.filter(
          (x) => x.id == this.dataSearch.idGrade
        );
        console.log("hihi" + this.grade);

        this.classOfGradeFilterList = grade[0].maClassListResponse;
      }
    },
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllMessage();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllMessage();
    },
    // duyet doc
    handleCommand(command) {
      if (command == "handleRead") {
        this.approveSchoolUnread();
      } else if (command == "handleConfirm") {
        this.approveSchoolConfirm();
      }
    },

    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
    },

    /**
     * lấy danh sách lớp trong khối, nếu idGrade=null thì lấy tất cả lớp
     */
    async getAllClass() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])
    },
    async changeGradeMethod() {
      await this.getAllClass();
      this.searchHeaderMethod();
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
    async fetchDataMany() {
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade(), this.getAllClass()]);
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }

      this.getAllMessage();
    },

    /**
     * clear grade
     */
    clearGrade() {
      this.changeGrade();
    },
    changeGrade() {
      this.dataSearch.idClass = "";
    },
    checkBeforeMany(manyRow, text) {
      if (manyRow.length == 0) {
        this.$message({
          message: "Không có đơn thuốc nào được chọn ở trạng thái chưa " + text,
          type: "error",
        });
        throw null;
      }
    },
    approveSchoolUnread() {
      let manyRow = this.multipleSelection.filter((x) => !x.teacherUnread);
      this.checkBeforeMany(manyRow, "đọc");
      this.$confirm(
        "Bạn có chắc chắn muốn thực hiện cho " +
          manyRow.length +
          " đơn thuốc không?",
        "Xác nhận đơn thuốc!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        MedicineService.updateRead(manyRow)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getAllMessage();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    approveSchoolConfirm() {
      let manyRow = this.multipleSelection.filter((x) => !x.confirmStatus);
      this.checkBeforeMany(manyRow, "xác nhận");
      this.$confirm(
        "Bạn có chắc chắn muốn thực hiện cho " +
          manyRow.length +
          " đơn thuốc không?",
        "Xác nhận đơn thuốc!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        MedicineService.updateConfirm(manyRow)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getAllMessage();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.getAllMessage();
    },
    changeDate() {
      this.messageParentResponses.forEach((element) => {
        element.timeHeight = this.dataSearch.date;
        element.timeWeight = this.dataSearch.date;
      });
    },
    tableRowStyle({ row }) {
      if (!row.teacherUnread) {
        return "color: #409EFF";
      }
    },
    clearRowMethod(index, row) {
      console.log(row);
      this.weight = "";
      this.height = "";
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.getAllMessage();
    },
    getAllMessage() {
      if (this.dataSearch.date == null) {
        this.dataSearch.date = "";
      }
      this.loadingData = true;
      this.textTable = "";
      MedicineService.searchMedicine(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.date,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.confirmStatus,
        this.dataSearch.dateSick,
        this.dataSearch.name
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          if (this.getAppTypeUserLogin == "teacher") {
            this.medicinelist =
              this.dataSearch.idClass != ""
                ? resp.data.data.medicineResponses
                : [];
          } else {
            this.medicinelist = resp.data.data.medicineResponses;
          }
          // this.medicinelist = resp.data.data.medicineResponses;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.medicinelist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.medicinelist == null || this.medicinelist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    getCurrentDate() {
      let a = (this.dataSearch.date = moment(String(new Date())).format(
        "YYYY-MM-DD"
      ));
      console.log(a);
    },
  },

  beforeMount() {
    this.fetchDataMany();
    this.getAllMessage();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}
.buttondropdown {
  float: right;
  border-radius: 0;
  margin-left: 3px;
  margin-top: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
  float: right;
}
/deep/.el-dialog__headerbtn .el-dialog__close {
  color: #ffffff !important;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
// /deep/.el-table .cell {
//   box-sizing: border-box;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: pre-line;
//   word-break: break-all;
//   line-height: 17px;
//   padding-right: 10px;
//   max-height: 50px;
//   text-overflow: ellipsis;
//   word-break: break-word;
// }
.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}
.button-select {
  margin-right: 5px;
  width: 150px;
}
.hasagi {
  // margin-top:-20px
  margin-bottom: 20px;
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
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
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
  width: 135px;
  // border: 1px solid #dcdfe6;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
  // border: 1px solid #dcdfe6;
}
.button-left-class1 {
  margin-right: 5px;
  width: 135px;
  // border: 1px solid #dcdfe6;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}
// /deep/.el-input__inner {
//   // border: 1px solid #d;
// }
.button-left-class9 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class2 {
  margin-right: -50px;
  width: 140px;
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

s .button-left-class3 {
  margin-left: -10px;
  width: 140px;
}
// .el-dropdown-menu li {
//   color: white;
//   border-top: 1px solid white;
//   font-family: Arial, Helvetica, sans-serif;
// // }
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
/deep/.paging-click .el-pagination {
  text-align: right;
  margin: 0px 0 !important;
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
  // border: 1px solid #dad6d6;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
</style>
