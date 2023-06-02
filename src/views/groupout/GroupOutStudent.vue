<template>
  <div class="content">
    <div style="margin-top: 5px" class="row-data">
      <div class="button-click-left">
        <!-- chọn trạng thái -->
        <el-select
          style="width: 150px"
          class="button-left-status"
          v-model="dataSearch.idGroupOut"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in kidStatusList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="button-left-status"
          :clearable="false"
          @change="searchHeaderMethod()"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
        <el-date-picker
          class="button-left-status"
          style="width: 250px"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataSearch.birthdayList"
          type="daterange"
          unlink-panels
          range-separator="-"
          @change="searchHeaderMethod()"
          start-placeholder="Ngày sinh"
          end-placeholder="Ngày kết thúc"
        >
        </el-date-picker>
        <el-date-picker
          class="button-left-status"
          style="width: 250px"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataSearch.dateInList"
          type="daterange"
          unlink-panels
          range-separator="-"
          @change="searchHeaderMethod()"
          start-placeholder="Ngày nhập học"
          end-placeholder="Ngày kết thúc"
        >
        </el-date-picker>
        <el-input
          class="button-left-class"
          style="width: 250px"
          placeholder="Nhập họ tên"
          clearable
          v-model="dataSearch.fullName"
          @clear="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>
      <div class="button-click">
        <el-dropdown @command="handleCommandAction">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item command="excelKids">Xuất File Excel</el-dropdown-item>
            <el-dropdown-item command="excelProviso"
              >Xuất Excel chọn lọc</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- nội dung thông tin chính -->
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="studentList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="selection"
          fixed
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          type="index"
          fixed
          align="center"
          label="STT"
          width="50"
        ></el-table-column>
        <el-table-column
          fixed
          align="center"
          label="Mã HS"
          prop="kidCode"
          width="100"
        ></el-table-column>
        <el-table-column min-width="170" fixed label="Họ tên">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="maClass.className"
          min-width="110"
          label="Lớp"
        ></el-table-column>
        <el-table-column align="center" min-width="130" label="Ngày nhập học">
          <template slot-scope="scope">
            <span>{{ scope.row.dateStart | formatDate }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="120" label="Ngày sinh">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          min-width="80"
          label="Giới tính"
          align="center"
        ></el-table-column>
        <el-table-column align="center" min-width="120" label="Ngày ra trường">
          <template slot-scope="scope">
            <span>{{ scope.row.outDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Tác vụ" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showDetailKids(scope.row)"
              >Xem</el-button
            >
            <el-button size="mini" type="success" @click="restoreMethod(scope.row)"
              >Khôi phục</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data">
      <el-pagination
        background
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultUser"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <DetailStudentGroupOut
      :formAllTabStudent="formAllTabStudent"
      :dialogVisible="showDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="DetailStudentGroupOut"
    />
    <ExcelProvisoDialog
      :dialogVisible="showDialogExcelProviso"
      @dialog-close="dialogCloseExcelProviso()"
      ref="ExcelProvisoDialog"
    />
    <RestoreStudentDialog
      :dialogVisible="showRestoreDialog"
      @dialog-close="closeRestoreDialog()"
      ref="RestoreStudentDialog"
    />
  </div>
</template>

<script>
// import moment from "moment";
import GroupOutService from "@/services/GroupOutService";
import DetailStudentGroupOut from "./DetailStudentGroupOut.vue";
import ExcelProvisoDialog from "./ExcelProvisoDialog.vue";
import RestoreStudentDialog from "./RestoreStudentDialog.vue";
export default {
  components: {
    DetailStudentGroupOut,
    ExcelProvisoDialog,
    RestoreStudentDialog,
  },
  data() {
    return {
      detailId: "",
      loadingData: true,
      showDetailDialog: false,
      showRestoreDialog: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      studentList: [],
      multipleSelection: [],
      kidStatusList: [],
      loadingButton: false,
      dataSearch: {
        idGroupOut: "",
        name: "",
        year: this.moment().format("YYYY-MM-DD"),
        dateInList: "",
        birthdayList: "",
        fullName: "",
      },
      formAllTabStudent: "",
      showDialogExcelProviso: false,
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    // select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogCloseDetailMethod() {
      this.showDetailDialog = false;
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
    checkSelectRowList(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    dialogCloseExcelProviso() {
      this.showDialogExcelProviso = false;
      this.searchByProperties();
    },
    closeRestoreDialog() {
      this.showRestoreDialog = false;
      this.searchByProperties();
    },
    handleExcelProviso() {
      this.showDialogExcelProviso = true;
    },
    restoreMethod(row) {
      this.showRestoreDialog = true;
      this.$refs.RestoreStudentDialog.getDataRestoreInitial(row);
    },
    handleCommandAction(command) {
      if (command == "excelProviso") {
        this.handleExcelProviso();
      } else {
        let kidList = this.multipleSelection;
        this.checkSelectRowList(kidList);
        if (command == "excelKids") {
          this.exportExcelKids();
        }
      }
    },
    changeDateMethod() {
      if (this.dataSearch.birthdayList == null) {
        this.dataSearch.birthdayList = "";
      }
      if (this.dataSearch.dateInList == null) {
        this.dataSearch.dateInList = "";
      }
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.changeDateMethod();
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      GroupOutService.getAllStudentGroupOut(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idGroupOut,
        this.dataSearch.year,
        this.dataSearch.dateInList,
        this.dataSearch.birthdayList,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.studentList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.studentList = [];
          console.log(err);
        })
        .finally(() => {
          if (this.studentList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    showDetailKids(row) {
      this.$refs.DetailStudentGroupOut.getDataInitial(row.id);
      setTimeout(() => {
        this.showDetailDialog = true;
      }, 100);
    },
    //export kids group out
    exportExcelKids() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.getStyleExcel();
      GroupOutService.getExportExcelKidsGroupOut(selectRowList)
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "DANH_SACH_HOC_SINH_NGHI_HOC";
              const tHeader = [
                "STT",
                "Mã HS",
                "Họ và tên",
                "Lớp",
                "Ngày sinh",
                "Giới tính",
                "Địa chỉ",
                "Ngày nhập học",
                "Ngày ra trường",
              ];
              const filterVal = [
                "pro1",
                "pro2",
                "pro3",
                "pro4",
                "pro5",
                "pro6",
                "pro7",
                "pro8",
                "pro9",
              ];
              let columnList = [
                { col: 5 },
                { col: 10 },
                { col: 25 },
                { col: 15 },
                { col: 15 },
                { col: 10 },
                { col: 25 },
                { col: 15 },
                { col: 15 },
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
              this.downloadLoading = false;
            })
            .finally(() => {
              this.styleCols1 = [];
              this.styleCols2 = [];
            });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    //Css Excel kids group out
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: ["A2", "A3", "A4"],
        style: { font: { bold: true } },
      };
      let styleCol2 = {
        name: ["A1"],
        style: { font: { bold: true, color: { rgb: "ff0000" }, sz: 18 } },
      };
      let style1 = {
        name: "A5:I5",
        style: {
          fill: { fgColor: { rgb: "00b0f0" } },
          font,
          alignment,
          border,
        },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
      this.styleCols2.push(style1);
    },
    async getAllGroupOutKidsName() {
      await GroupOutService.getAllGroupOutKidsName()
        .then((resp) => {
          this.kidStatusList = resp.data.data;
          if (this.kidStatusList.length > 0) {
            this.dataSearch.name = this.kidStatusList[0].name;
            this.dataSearch.idGroupOut = this.kidStatusList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async fetchDataOne() {
      await this.getAllGroupOutKidsName()
        .then(() => {
          this.searchByProperties();
        })
        .catch((err) => {
          throw err;
        });
    },
  },

  beforeMount() {
    this.fetchDataOne();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-pagination .el-select .el-input {
  width: 75px;
}

/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
/deep/.el-table th > .cell {
  text-align: center !important;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
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
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-fullname {
  border: none;
  padding: 0;
  color: blue;
}
.click-fullname:hover {
  color: blue;
  background: none;
}
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .button-left-status {
    margin-right: 5px;
  }
  .button-left-class {
    margin-right: 5px;
    width: 120px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
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
.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}
.click-in-row:hover {
  color: #fa03d9;
  // background: none;
}
.handle-account {
  border: none;
  padding: 0;
  color: red;
}
.handle-account:hover {
  color: #fa03d9;
}
</style>
