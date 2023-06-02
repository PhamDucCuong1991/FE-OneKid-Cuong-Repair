<template>
  <div class="content">
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
        v-if="checkPermission(['parentDiary_absenLetter_update'])"
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
        :data="absentlist"
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
        ></el-table-column>
        <el-table-column
          prop="kidName"
          label="Họ và tên"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="className"
          label="Lớp"
          width="120"
        ></el-table-column>

        <el-table-column label="Ngày gửi" width="135" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="schoolFeedback"
          label="Phản hồi"
          width="140"
          align="center "
        ></el-table-column>
        <el-table-column
          prop="absentContent"
          label="Nội dung"
          min-width="250"
          align="left "
        ></el-table-column>

        <el-table-column label="Ngày nghỉ" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fromDate | formatDate }}</span>
            <span> đến </span>
            <span style="margin-right: 10px">{{
              scope.row.toDate | formatDate
            }}</span>
            <el-button
              type="text"
              @click="handleViewDayLeave(scope.$index, scope.row)"
            >
              Xem chi tiết</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Quá hạn"
          width="80"
          align="center"
        >
        <template slot-scope="scope">
          <span v-if="scope.row.expired">Có</span>
          <span v-else>Không</span>
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
    <ViewTakeLeave
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewTakeLeave"
    />
    <ViewDetailDayLeave
      :dialogVisible="showViewDetailDayLeave"
      @dialog-close="showViewDetailDayLeave = false"
      ref="ViewDetailDayLeave"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import TakeLeaveService from "@/services/TakeLeaveService";
import ViewTakeLeave from "./ViewTakeLeave";
import ViewDetailDayLeave from "./ViewDetailDayLeave";
import TeacherService from "@/services/TeacherService";

import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  components: {
    ViewTakeLeave,
    ViewDetailDayLeave,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      multipleSelection: [],
      confirmStatus: [
        { status: true, label: "Đã xác nhận" },
        { status: false, label: "Chưa xác nhận" },
      ],
      dateSick: [{ status: "leave", label: "Đang nghỉ" }],

      checkDisable: false,
      showCreateDialog: false,
      showViewDetailDayLeave: false,

      kidStatusList: [],
      gradeOfSchoolList: [],
      maClassList: [],
      classOfGradeList: [],
      classOfGradeFilterList: [],
      absentlist: [],
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
      this.$refs.ViewTakeLeave.getDetailMessageInitial(row.id);
    },

    handleViewDayLeave(index, row) {
      this.showViewDetailDayLeave = true;
      this.$refs.ViewDetailDayLeave.getDetailMethod(row);
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
    handleCommand(command) {
      if (command == "handleRead") {
        this.approveSchoolUnread();
      } else if (command == "handleConfirm") {
        this.approveSchoolConfirm();
      }
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.getAllMessage();
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllMessage();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllMessage();
    },
    checkBeforeMany(manyRow, text) {
      if (manyRow.length == 0) {
        this.$message({
          message:
            "Không có đơn xin nghỉ nào được chọn ở trạng thái chưa " + text,
          type: "error",
        });
        throw null;
      }
    },
    // duyet doc
    approveSchoolUnread() {
      let manyRow = this.multipleSelection.filter((x) => !x.teacherUnread);
      this.checkBeforeMany(manyRow, "đọc");
      this.$confirm(
        "Bạn có chắc chắn muốn thực hiện cho " +
          manyRow.length +
          " đơn xin nghỉ không?",
        "Duyệt đã đọc!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        TakeLeaveService.updateRead(manyRow)
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
          " đơn xin nghỉ không?",
        "Xác nhận đơn xin nghỉ!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        TakeLeaveService.updateConfirm(manyRow)
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
    // chon khoi trong truong
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
      TakeLeaveService.searchMessageParent(
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
            this.absentlist =
              this.dataSearch.idClass != ""
                ? resp.data.data.absentLetterResponses
                : [];
          } else {
            this.absentlist = resp.data.data.absentLetterResponses;
          }
          // this.absentlist = resp.data.data.absentLetterResponses;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.absentlist = null;
          console.log(err);
        })

        .finally(() => {
          if (this.absentlist == null || this.absentlist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
      // this.showCreateDialog = false;
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
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}

/deep/.el-dialog__headerbtn .el-dialog__close {
  color: #847777 !important;
}

/deep/[data-v-4824703a] .el-dialog__headerbtn .el-dialog__close {
  color: #828282 !important;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
.el-input-group {
  // line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}
.buttondropdown {
  float: right;
  border-radius: 0;
  margin-left: 3px;
  margin-top: 4px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
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
// /deep/.el-table .cell {
//   box-sizing: border-box;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: pre-line;
//   line-height: 18px;
//   padding-right: 10px;
//   max-height: 75px;
//   text-overflow: ellipsis;
//   display: inline-block;
//   word-break: break-word;
//   width: 100%;
// }

.button-select {
  margin-right: 5px;
  width: 150px;
}
.hasagi {
  // margin-top:-20px
  margin-bottom: 20px;
}
// /deep/.el-table th {
//   padding: 10px 0;
// }

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
  margin-top: 1px;
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
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
.button-left-class1 {
  margin-right: 5px;
  width: 135px;
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

/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  // line-height: normal;
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
/deep/.paging-click .el-pagination {
  text-align: right;
  margin: 0px 0 !important;
}
/deep/.el-upload-list__item .el-icon-upload-success {
  color: #ffffff !important;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
/deep/.el-upload-list__item-name {
  color: #606266;
  display: block;
  /* margin-right: -214px; */
  overflow: hidden;
  padding-left: 3px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
  margin-right: -90px !important;
  width: 135px !important;
}
</style>
