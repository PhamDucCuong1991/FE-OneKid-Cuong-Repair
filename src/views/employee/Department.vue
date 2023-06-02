<template>
  <div class="content">
    <div class="button-click row-data">
      <el-button
        v-if="checkPermission(['infoEmployee_department_update'])"
        class="button-over"
        type="success"
        @click="createDepartmentDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-button
        v-if="checkPermission(['infoEmployee_list_app'])"
        class="button-over"
        type="success"
        @click="createNotifyDialog()"
        >Gửi qua App</el-button
      >

      <el-button
        class="button-over"
        type="success"
        :loading="loadingExcel"
        @click="handleExport()"
        >Xuất file excel</el-button
      >
    </div>
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="departmentList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="departmentName"
          label="Tên phòng ban"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="departmentDescription"
          label="Mô tả phòng ban"
          align="left"
        >
          <template slot-scope="scope">
            {{ scope.row.departmentDescription }}
          </template>
        </el-table-column>
        <el-table-column
          prop="employeeNumber"
          label="Số lượng"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="checkPermission(['infoEmployee_department_update'])"
          label="Tác vụ"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              @click="handleTransfer(scope.$index, scope.row)"
              >Thêm</el-button
            > -->
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <CreateDepartment
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseButton"
    />
    <UpdateDepartment
      :dialogVisible="showUpdateDialog"
      :editDepartment="updateDepartment"
      @dialog-close="dialogCloseUpdateButton"
    />
    <DepartmentEmployeeTransfer
      :dialogVisible="showTransferDialog"
      @dialog-close="dialogCloseTransferButton"
      ref="DepartmentEmployeeTransfer"
    />
    <CreateEmployeeNotify
      v-bind:dataDepartmentNotifyList="dataDepartmentNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />
    <CreateEmployeeNotifySms
      v-bind:dataDepartmentNotifySmsList="dataDepartmentNotifySmsList"
      :dialogVisibleSms="showCreateNotifySmsDialog"
      @dialog-close="dialogCloseCreateNotifySmsMethod()"
      ref="CreateEmployeeNotifySms"
    />
    <CreateSmsDialog
      :dialogVisible="showCreateSms"
      @dialog-close="closeCreateSmsMethod()"
      ref="CreateSmsDialog"
    />
  </div>
</template>

<script>
// import http from "../../http-download";
import moment from "moment";
import checkPermission from "@/utils/permission.js";
import DepartmentDataService from "../../services/DepartmentDataService";
import EmployeeDataService from "../../services/EmployeeDataService";
import CreateDepartment from "./CreateDepartment.vue";
import UpdateDepartment from "./UpdateDepartment.vue";
import DepartmentEmployeeTransfer from "./DepartmentEmployeeTransfer.vue";
import CreateEmployeeNotify from "./CreateEmployeeNotify.vue";
import CreateEmployeeNotifySms from "./CreateEmployeeNotifySms.vue";
import CreateSmsDialog from "../common/CreateSmsDialog.vue";

export default {
  components: {
    CreateDepartment,
    UpdateDepartment,
    DepartmentEmployeeTransfer,
    CreateEmployeeNotify,
    CreateEmployeeNotifySms,
    CreateSmsDialog,
  },
  data() {
    return {
      loadingData: true,
      loadingExcel: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      multipleSelection: [],
      showTransferDialog: false,
      showCreateNotifySmsDialog: false,
      departmentList: [],
      dataListNotify: [],
      dataListNotifySms: [],
      dataDepartmentNotifyList: [],
      dataDepartmentNotifySmsList: {
        listId: [],
        listNoActive: [],
      },
      showCreateDialog: false,
      showUpdateDialog: false,
      showExportDialog: false,
      showCreateNotifyDialog: false,
      showCreateSms: false,
      checkDeleteDepartment: "",
      updateDepartment: {
        id: "",
        departmentName: "",
        departmentDescription: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      this.dataDepartmentNotifySmsList = [];
      this.dataDepartmentNotifySmsList.listId = [];
      this.dataDepartmentNotifySmsList.listNoActive = [];
    },
    createSmsMethod() {
      this.showCreateSms = true;
      let idList = this.multipleSelection.map((x) => x.id);
      this.$refs.CreateSmsDialog.getDataCreateSmsInitial(
        idList,
        "department",
        "employee"
      );
    },
    closeCreateSmsMethod() {
      this.showCreateSms = false;
    },
    //xuất file excel
    handleExport() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có phòng ban nào được chọn",
          type: "error",
        });
        return;
      }
      if (selectRowList.length > 1) {
        this.$message({
          message: "Chỉ được phép chọn  một phòng ban",
          type: "error",
        });
        return;
      }
      (this.loadingExcel = true),
        this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
          .then(() => {
            this.getStyleExcelDepartment();
            let id = selectRowList[0].id;
            let name = selectRowList[0].departmentName;
            let myDate = moment(new Date()).format("DD-MM-YYYY");
            // return http
            //   .get(`employees/export-excel/employee?idDepartment=` + id)
            //   .then((response) => {
            //     const url = window.URL.createObjectURL(
            //       new Blob([response.data])
            //     );
            //     const link = document.createElement("a");
            //     link.href = url;
            //     link.setAttribute(
            //       "download",
            //       "QUAN_LY_NHAN_SU_" + name + "_" + myDate + ".xlsx"
            //     );
            //     document.body.appendChild(link);
            //     link.click();
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //     this.$message({
            //       message: "Thất bại",
            //       type: "error",
            //     });
            //   })
            //   .finally(() => {
            //     setTimeout(() => {
            //       this.loadingExcel = false;
            //     }, 500);
            //   });
            EmployeeDataService.exportExcelDepartmentNew(id)
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `QUAN_LY_NHAN_SU_${name}_${myDate}`;
                    const tHeader = [
                      "STT",
                      "Tình trạng",
                      "Họ và tên",
                      "Ngày sinh",
                      "Giới tính",
                      "TK/SĐT",
                      "Ngày vào",
                      "Ngày ký HĐ",
                      "Ngày hết hạn HĐ",
                      "Email",
                      "Số CMND",
                      "Ngày cấp",
                      "Địa chỉ thường chú",
                      "Chỗ ở hiện tại",
                      "Hôn nhân",
                      "Số con",
                      "Trình độ",
                      "Chuyên môn",
                      "Phòng ban",
                      "Đối tượng",
                      "Ghi chú",
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
                      "pro10",
                      "pro11",
                      "pro12",
                      "pro13",
                      "pro14",
                      "pro15",
                      "pro16",
                      "pro17",
                      "pro18",
                      "pro19",
                      "pro20",
                      "pro21",
                    ];
                    let columnList = [
                      { col: 5 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 10 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 15 },
                      { col: 30 },
                      { col: 30 },
                      { col: 10 },
                      { col: 5 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
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
              })
              .finally(() => {
                setTimeout(() => {
                  this.loadingExcel = false;
                }, 500);
              });
          })
          .catch(() => {
            this.loadingExcel = false;
          });
    },
    getStyleExcelDepartment() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: "A5:U5",
        style: {
          fill: { fgColor: { rgb: "ffff00" } },
          font,
          alignment,
          border,
        },
      };
      //style1
      let styleCol2 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol3 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true },
        },
      };
      this.styleCols2.push(styleCol1);

      this.styleCols1.push(styleCol2);
      this.styleCols1.push(styleCol3);
    },
    createNotifyDialog() {
      let employeeList = this.multipleSelection;
      if (employeeList.length == 0) {
        this.$message({
          message: "Không có phòng ban nào được chọn",
          type: "error",
        });
        return;
      }
      if (employeeList.length > 1) {
        this.$message({
          message: "Chỉ được phép chọn  một phòng ban.",
          type: "error",
        });
        return;
      }
      this.dataListNotify = employeeList;
      this.dataListNotify.forEach((value) => {
        this.dataDepartmentNotifyList.push(value.id);
      });
      this.showCreateNotifyDialog = true;
    },
    createNotifySmsDialog(data) {
      let dataListInfo = [];

      EmployeeDataService.search("", data[0].id, "", "teacher")
        .then((response) => {
          console.log(response);
          dataListInfo = response.data.data.infoEmployeeSchoolDTOList;
          dataListInfo.forEach((info) => {
            this.dataDepartmentNotifySmsList.listId.push(info.id);
            if (info.smsReceive == false) {
              this.dataDepartmentNotifySmsList.listNoActive.push(info.id);
            }
          });
          this.showCreateNotifySmsDialog = true;
          this.$refs.CreateEmployeeNotifySms.getNumber();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa phòng ban thất bại",
            type: "error",
          });
        });
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
      this.dataDepartmentNotifyList = [];
    },
    dialogCloseButton() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateButton() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    dialogCloseTransferButton() {
      this.showTransferDialog = false;
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
    createDepartmentDialog() {
      this.showCreateDialog = true;
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.updateDepartment.id = row.id;
      this.updateDepartment.departmentName = row.departmentName;
      this.updateDepartment.departmentDescription = row.departmentDescription;
    },
    handleTransfer(index, row) {
      this.showTransferDialog = true;
      this.$refs.DepartmentEmployeeTransfer.getDepartmentById(row.id);
      this.$refs.DepartmentEmployeeTransfer.getAllEmployee();
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa phòng ban đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        DepartmentDataService.delete(row.id)
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

    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      DepartmentDataService.getDepartment(this.pageNumber, this.maxPageItem)
        .then((response) => {
          this.departmentList = response.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.departmentList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
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
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click {
    text-align: right;
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

  // /deep/.el-table td,
  // /deep/.el-table th {
  //   padding: 6px 0;
  // }
  /deep/.el-table th > .cell {
    text-align: center !important;
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
  /deep/.el-checkbox__inner {
    border: 1px solid gray;
  }
}
</style>
