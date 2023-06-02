<template>
  <div class="content">
    <div style="margin-top: 5px" class="row-data">
      <div class="button-click-left">
        <!-- chọn trạng thái -->
        <el-select
          class="button-left-status"
          v-model="dataSearch.idGroupOut"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in employeeStatusList"
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
          style="width: 265px"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          v-model="dataSearch.dateInList"
          type="daterange"
          unlink-panels
          range-separator="-"
          @change="searchHeaderMethod()"
          start-placeholder="Ngày vào"
          end-placeholder="Ngày kết thúc"
        >
        </el-date-picker>
      </div>
      <div class="button-click">
        <el-dropdown @command="handleCommandAction">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item command="excelEmplyee">Xuất File Excel</el-dropdown-item>
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
        :data="employeeList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          fixed
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column fixed prop="fullName" min-width="170" label="Họ tên">
        </el-table-column>
        <el-table-column label="Phòng ban" min-width="120">
          <template slot-scope="scope">
            <el-span
              v-for="item in scope.row.departmentEmployeeList"
              :key="item.department.id"
              >- {{ item.department.departmentName }}<br />
            </el-span>
          </template>
        </el-table-column>
        <el-table-column label="Lớp" min-width="110">
          <template slot-scope="scope">
            <el-span v-for="item in scope.row.exEmployeeClassList" :key="item.maClass.id"
              >- {{ item.maClass.className }} <span v-if="item.master"> - CN</span><br />
            </el-span>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="Ngày sinh" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="Giới tính"
          min-width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="SĐT"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column prop="startDate" label="Ngày vào" align="center" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="outDate"
          label="Ngày ra trường"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.outDate | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Tác vụ" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showDetailEmployee(scope.row)"
              >Xem</el-button
            >
            <el-button size="mini" type="success" @click="handleRestore(scope.row)"
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
    <DetailEmployeeGroupOut
      :formAllTabEmployee="formAllTabEmployee"
      :dialogVisible="showDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="DetailEmployeeGroupOut"
    />
    <ExcelEmplyeeProvisoDialog
      :dialogVisible="showDialogExcelProviso"
      @dialog-close="dialogCloseExcelProviso()"
      ref="ExcelEmplyeeProvisoDialog"
    />
  </div>
</template>

<script>
// import moment from "moment";
import GroupOutService from "@/services/GroupOutService";
import DetailEmployeeGroupOut from "./DetailEmployeeGroupOut.vue";
import ExcelEmplyeeProvisoDialog from "./ExcelEmplyeeProvisoDialog.vue";
export default {
  components: { DetailEmployeeGroupOut, ExcelEmplyeeProvisoDialog },
  data() {
    return {
      detailId: "",
      loadingData: true,
      showDetailDialog: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      employeeList: [],
      multipleSelection: [],
      employeetatusList: [],
      loadingButton: false,
      dataSearch: {
        idGroupOut: "",
        name: "",
        year: this.moment().format("YYYY-MM-DD"),
        dateInList: "",
      },
      formAllTabEmployee: "",
      showDialogExcelProviso: false,
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
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
    dialogCloseExcelProviso() {
      this.showDialogExcelProviso = false;
      this.searchByProperties();
    },
    handleExcelProviso() {
      this.showDialogExcelProviso = true;
    },
    checkSelectRowList(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Không có nhân sự nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    handleCommandAction(command) {
      if (command == "excelProviso") {
        this.handleExcelProviso();
      } else {
        let kidList = this.multipleSelection;
        this.checkSelectRowList(kidList);
        if (command == "excelEmplyee") {
          this.exportExcelEmployee();
        }
      }
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      if (this.dataSearch.dateInList == null) {
        this.dataSearch.dateInList = "";
      }
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      GroupOutService.getAllEmployeeGroupOut(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idGroupOut,
        this.dataSearch.year,
        this.dataSearch.dateInList
      )
        .then((resp) => {
          this.employeeList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.employeeList = [];
          console.log(err);
        })
        .finally(() => {
          if (this.employeeList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    showDetailEmployee(row) {
      this.$refs.DetailEmployeeGroupOut.getDataInitial(row.id);
      this.$refs.DetailEmployeeGroupOut.getAllAccountType();
      setTimeout(() => {
        this.showDetailDialog = true;
      }, 100);
    },
    handleRestore(row) {
      this.loadingButton = true;
      this.$confirm("Bạn có chắc chắn muốn khôi phục nhân sự đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          GroupOutService.restoreEmployeeGroupOut(row.id)
            .then((response) => {
              this.$message({
                message: response.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.searchByProperties();
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
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    async getAllGroupOutEmployeeName() {
      await GroupOutService.getAllGroupOutEmployeeName()
        .then((resp) => {
          this.employeeStatusList = resp.data.data;
          if (this.employeeStatusList.length > 0) {
            this.dataSearch.name = this.employeeStatusList[0].name;
            this.dataSearch.idGroupOut = this.employeeStatusList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //export employee group out
    exportExcelEmployee() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.getStyleExcel();
      GroupOutService.getExportExcelEployeeGroupOut(selectRowList)
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "DANH_SACH_NHAN_SU_RA_TRUONG";
              const tHeader = [
                "STT",
                "Mã Nhân sự",
                "Họ và tên",
                "Phòng ban",
                "Ngày sinh",
                "Giới tính",
                "SĐT",
                "Ngày vào",
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
                { col: 25 },
                { col: 15 },
                { col: 10 },
                { col: 15 },
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
    //Css Excel employee group out
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
    async fetchDataOne() {
      await this.getAllGroupOutEmployeeName()
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
