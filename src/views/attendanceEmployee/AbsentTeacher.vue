<template>
  <div class="content">
    <div class="hasagi">
      <el-date-picker
        class="button-left-class1"
        v-model="dataSearch.createdDate"
        @change="searchHeaderMethod()"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        placeholder="Chọn ngày"
      ></el-date-picker>

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
        v-model="dataSearch.date"
        @change="searchHeaderMethod()"
        placeholder="Tình trạng"
        clearable
      >
        <el-option
          v-for="item in dateAbsent"
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
        v-model="dataSearch.content"
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
        v-if="checkPermission(['attendanceEmployee_absentTeacher_update'])"
        class="buttondropdown"
      >
        <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="handleRead"
              >Đánh dấu đã đọc</el-dropdown-item
            >
            <el-dropdown-item command="handleConfirm"
              >Xác nhận xin nghỉ</el-dropdown-item
            >
            <!-- <el-dropdown-item command="handleExport"
              >Xuất danh sách được chọn</el-dropdown-item
            > -->
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
        :data="responseList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdBy"
          label="Họ và tên"
          width="200"
        ></el-table-column>

        <el-table-column label="Ngày gửi đơn" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đối tượng phản hồi" width="160" align="center"
          ><template slot-scope="scope">
            <span v-if="scope.row.idSchoolReply !== null">Nhà trường</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="Nội dung"
          min-width="300"
          align="left "
        ></el-table-column>

        <el-table-column label="Ngày nghỉ" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fromDate | formatDate }}</span>
            <span> đến </span>
            <span style="margin-right: 10px">{{
              scope.row.toDate | formatDate
            }}</span>
            <el-button type="text" @click="handleViewDayLeave(scope.row)">
              Xem chi tiết</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="numberFile"
          label="Số file"
          width="70"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          label="Trạng thái"
          width="130"
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
              @click="handleViewDetail(scope.row)"
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
    <AbsentTeacherViewDetail
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="AbsentTeacherViewDetail"
    />
    <AbsentTeacherViewDetailDayAbsent
      :dialogVisible="showViewDetailDayLeave"
      @dialog-close="showViewDetailDayLeave = false"
      ref="AbsentTeacherViewDetailDayAbsent"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import AbsentTeacherViewDetail from "./AbsentTeacherViewDetail";
import AbsentTeacherViewDetailDayAbsent from "./AbsentTeacherViewDetailDayAbsent";
import AbsentTeacherService from "@/services/AbsentTeacherService";
export default {
  components: {
    AbsentTeacherViewDetail,
    AbsentTeacherViewDetailDayAbsent,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      confirmStatus: [
        { status: true, label: "Đã xác nhận" },
        { status: false, label: "Chưa xác nhận" },
      ],
      dateAbsent: [
        {
          status: this.moment().format("YYYY-MM-DD"),
          label: "Đang nghỉ",
        },
      ],

      showCreateDialog: false,
      showViewDetailDayLeave: false,

      responseList: [],
      value: "",
      date: "",
      dataSearch: {
        createdDate: "",
        confirmStatus: "",
        date: "",
        content: "",
      },
      multipleSelection: [],
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleViewDetail(row) {
      this.showCreateDialog = true;
      this.$refs.AbsentTeacherViewDetail.getDetailMessageInitial(row.id);
    },

    handleViewDayLeave(row) {
      this.showViewDetailDayLeave = true;
      this.$refs.AbsentTeacherViewDetailDayAbsent.getDetailMethod(row);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleCommand(command) {
      if (command == "handleRead") {
        this.approveSchoolRead();
      } else if (command == "handleConfirm") {
        this.approveSchoolConfirm();
      }
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
    },

    tableRowStyle({ row }) {
      if (!row.schoolRead) {
        return "color: #409EFF";
      }
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      if (this.dataSearch.date == null) {
        this.dataSearch.date = "";
      }
      if (this.dataSearch.createdDate == null) {
        this.dataSearch.createdDate = "";
      }
      this.loadingData = true;
      this.textTable = "";
      AbsentTeacherService.searchMessageTeacher(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.createdDate,
        this.dataSearch.confirmStatus,
        this.dataSearch.date,
        this.dataSearch.content
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.responseList = resp.data.data.absentList;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.responseList = [];
          console.log(err.response.data.message);
        })

        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
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
    approveSchoolRead() {
      let manyRow = this.multipleSelection.filter((x) => !x.schoolRead);
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
        AbsentTeacherService.updateReadOfTeacher(manyRow.map((x) => x.id))
          .then((resp) => {
            console.log(resp);
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    //Xác nhận all
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
        AbsentTeacherService.updateConfirmOfTeacher(manyRow.map((x) => x.id))
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
  },

  beforeMount() {
    this.searchByProperties();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
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
  width: 170px;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
.button-left-class1 {
  margin-right: 5px;
  width: 150px;
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
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
</style>
