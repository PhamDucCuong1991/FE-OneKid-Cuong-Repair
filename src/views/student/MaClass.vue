<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- button left -->
      <div class="button-click-left">
        <el-input
          style="width: 280px"
          placeholder="Nhập tên lớp"
          clearable
          v-model="dataSearch.classNameSearch"
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

      <!-- button action -->
      <div class="button-click-right row-data">
        <el-button
          v-if="checkPermission(['kids_class_update'])"
          class="button-over"
          type="success"
          @click="createGradeDialog()"
        >
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>
        <el-dropdown
          v-if="checkPermission(['kids_list_app']) || checkPermission(['kids_list_sms'])"
          @command="handleSendNotify"
        >
          <el-button class="button-over" type="success">
            Gửi tin
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item
              v-if="checkPermission(['kids_list_app'])"
              command="createNotifyApp"
              >Gửi qua App</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['kids_list_sms'])"
              command="createNotifySms"
              >Gửi qua SMS</el-dropdown-item
            >
            <!-- <el-dropdown-item>Gửi tài khoản</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          class="button-over"
          type="success"
          @click="handleExport()"
          :loading="loaddingExcel"
          >Xuất File Excel</el-button
        >
      </div>
    </div>

    <!-- nội dung thông tin chính -->
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
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          align="center"
          type="index"
          fixed
          label="STT"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="className"
          min-width="120"
          fixed
          label="Tên lớp"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="grade.gradeName"
          label="Tên khối học"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="classDescription"
          label="Mô tả"
        ></el-table-column>
        <el-table-column width="150" label="Giáo viên chủ nhiệm">
          <template slot-scope="scope">
            <span v-for="item in scope.row.masterNameList" :key="item"
              >- {{ item }}<br />
            </span>
          </template>
        </el-table-column>

        <el-table-column width="110" label="Số giáo viên" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.teacherNumber > 0"
              effect="dark"
              content="Xem"
              placement="top"
            >
              <el-button
                class="click-number-teacher"
                @click="clickNumberTeacher(scope.$index, scope.row)"
                >{{ scope.row.teacherNumber }}</el-button
              >
            </el-tooltip>
            <span v-else>{{ scope.row.teacherNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column width="110" label="Số nhân viên" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.employeeNumber > 0"
              effect="dark"
              content="Xem"
              placement="top"
            >
              <el-button
                class="click-number-teacher"
                @click="clickNumberEmployee(scope.$index, scope.row)"
                >{{ scope.row.employeeNumber }}</el-button
              >
            </el-tooltip>
            <span v-else>{{ scope.row.employeeNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="studentStudyNumber"
          width="120"
          label="Số HS đang học"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="studentTotalNumber"
          width="120"
          label="Tổng số HS"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="checkPermission(['kids_class_update'])"
          label="Tác vụ"
          fixed="right"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
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
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>

    <CreateMaClass
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateMaClass"
    />
    <UpdateMaClass
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateMaClass"
    />

    <ShowMaClass
      :dialogVisible="showShowMaclassDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ShowMaClass"
    />
    <ShowEmployeeInClass
      :dialogVisible="showEmployeeInClassDialog"
      @dialog-close="dialogCloseShowEmployeeMethod()"
      ref="ShowEmployeeInClass"
    />
    <CreateStudentNotify
      v-bind:dataClassNotifyList="dataClassNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />

    <CreateStudentNotifySms
      v-bind:dataClassNotifySmsList="dataClassNotifySmsList"
      :dialogVisibleSms="showCreateNotifySmsDialog"
      @dialog-close="dialogCloseCreateNotifySmsMethod()"
      ref="CreateStudentNotifySms"
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
import MaClassService from "@/services/MaClassService";
import SmsSendService from "@/services/SmsSendService";
import CreateMaClass from "./CreateMaClass.vue";
import UpdateMaClass from "./UpdateMaClass.vue";
import ShowMaClass from "./ShowMaClass.vue";
import ShowEmployeeInClass from "./ShowEmployeeInClass.vue";
import CreateStudentNotify from "./CreateStudentNotify.vue";
import CreateStudentNotifySms from "./CreateStudentNotifySms.vue";
import CreateSmsDialog from "../common/CreateSmsDialog.vue";

export default {
  components: {
    CreateMaClass,
    UpdateMaClass,
    ShowMaClass,
    ShowEmployeeInClass,
    CreateStudentNotify,
    CreateStudentNotifySms,
    CreateSmsDialog,
  },
  data() {
    return {
      loadingData: true,
      loaddingExcel: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      responseList: [],
      classListInitial: [],
      grade: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showShowMaclassDialog: false,
      showEmployeeInClassDialog: false,
      showCreateNotifyDialog: false,
      showCreateNotifySmsDialog: false,
      showCreateSms: false,
      multipleSelection: [],
      dataListNotify: [],
      dataListNotifySms: [],
      dataClassNotifyList: [],
      dataClassNotifySmsList: {
        listId: [],
        listNoActive: [],
      },
      dataSearch: {
        pageNumber: "",
        maxPageItem: "",
        classNameSearch: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    checkPermission,
    handleExport() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có lớp nào được chọn",
          type: "error",
        });
        return;
      }
      if (selectRowList.length > 1) {
        this.$message({
          message: "Chỉ được phép chọn một lớp",
          type: "error",
        });
        return;
      }
      (this.loaddingExcel = true),
        this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        })
          .then(() => {
            this.getStyleExcelClass();
            let id = selectRowList[0].id;
            let name = selectRowList[0].className;
            let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
            let status = "STUDYING";
            MaClassService.exportExcelClassNew(status, id)
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `QUAN_LY_HOC_SINH_THEO_LOP_${name}_${myDate}`;
                    const tHeader = [
                      "STT",
                      "Tình trạng",
                      "Khối học",
                      "Lớp học",
                      "Tên nhóm",
                      "Họ và tên",
                      "Ngày sinh",
                      "Giới tính",
                      "Biệt danh",
                      "Địa chỉ",
                      "Địa chỉ thường trú",
                      "Dân tộc",
                      "Người đại diện",
                      "Ngày nhập học",
                      "Ngày bảo lưu",
                      "Ngày nghỉ",
                      "Họ tên mẹ",
                      "Ngày sinh",
                      "Số điện thoại",
                      "Email",
                      "Nghề nghiệp",
                      "Họ tên bố",
                      "Ngày sinh",
                      "Số điện thoại",
                      "Email",
                      "Nghề nghiệp",
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
                      "pro22",
                      "pro23",
                      "pro24",
                      "pro25",
                      "pro26",
                      "pro27",
                    ];
                    let columnList = [
                      { col: 5 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 10 },
                      { col: 20 },
                      { col: 25 },
                      { col: 25 },
                      { col: 10 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 15 },
                      { col: 25 },
                      { col: 15 },
                      { col: 30 },
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
                    setTimeout(() => {
                      this.loaddingExcel = false;
                    }, 500);
                  });
              })
              .catch((err) => {
                console.log(err);
                this.$message({
                  message: "Thất bại",
                  type: "error",
                });
                setTimeout(() => {
                  this.loaddingExcel = false;
                }, 500);
              });
          })
          .catch(() => {
            setTimeout(() => {
              this.loaddingExcel = false;
            }, 500);
          });
    },
    //Style css Excel Class
    getStyleExcelClass() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: "A5:P5",
        style: {
          fill: { fgColor: { rgb: "ffff00" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol2 = {
        name: "Q5:U5",
        style: {
          fill: { fgColor: { rgb: "ffb2bd" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol3 = {
        name: "V5:AA5",
        style: {
          fill: { fgColor: { rgb: "78f388" } },
          font,
          alignment,
          border,
        },
      };
      //style1
      let styleCol4 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol5 = {
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };
      this.styleCols2.push(styleCol1);
      this.styleCols2.push(styleCol2);
      this.styleCols2.push(styleCol3);

      this.styleCols1.push(styleCol4);
      this.styleCols1.push(styleCol5);
    },
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      this.dataClassNotifySmsList = [];
      this.dataClassNotifySmsList.listId = [];
      this.dataClassNotifySmsList.listNoActive = [];
    },
    createSmsMethod() {
      this.showCreateSms = true;
      let idList = this.multipleSelection.map((x) => x.id);
      this.$refs.CreateSmsDialog.getDataCreateSmsInitial(idList, "class", "student");
    },
    closeCreateSmsMethod() {
      this.showCreateSms = false;
    },
    // CREATE NOTIFY
    handleSendNotify(command) {
      let kidClass = this.multipleSelection;
      if (kidClass.length == 0) {
        this.$message({
          message: "Không có lớp nào được chọn",
          type: "error",
        });
        return;
      }
      if (command == "createNotifyApp") {
        this.createNotifyDialog(kidClass);
      } else if (command == "createNotifySms") {
        this.createSmsMethod();
      }
    },
    createNotifyDialog(data) {
      this.dataListNotify = data;
      this.dataListNotify.forEach((value) => {
        this.dataClassNotifyList.push(value.id);
      });
      // console.log(this.dataClassNotifyList);
      this.showCreateNotifyDialog = true;
    },
    createNotifySmsDialog(data) {
      this.showCreateNotifySmsDialog = true;
      this.$refs.CreateStudentNotifySms.showLoading();
      let dataList = [];
      data.forEach((val) => {
        dataList.push(val.id);
      });
      SmsSendService.getKidsByIdClass(dataList)
        .then((resp) => {
          console.log(resp);
          this.dataListNotifySms = resp.data.data;
          if (this.dataListNotifySms != null) {
            this.dataListNotifySms.forEach((value) => {
              this.dataClassNotifySmsList.listId.push(value.id);
              if (value.smsReceive == false) {
                this.dataClassNotifySmsList.listNoActive.push(value.id);
              }
            });
            // this.showCreateNotifySmsDialog = true;
            this.$refs.CreateStudentNotifySms.getNumber();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    dialogCloseCreateMethod() {
      this.searchByProperties();
      this.dataSearch.classNameSearch = "";
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },
    dialogCloseShowMethod() {
      this.showShowMaclassDialog = false;
    },
    dialogCloseShowEmployeeMethod() {
      this.showEmployeeInClassDialog = false;
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
      this.dataClassNotifyList = [];
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
    //click edit at row
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateMaClass.getDataInitial(row.id);
    },
    //click edit at row
    handleView(index, row) {
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 200);
      this.$refs.UpdateMaClass.getDataInitial(row.id);
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      MaClassService.searchClassNew(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.classNameSearch
      )
        .then((resp) => {
          this.responseList = resp.data.data.responseList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.pageTotal = 1;
          this.responseList = [];
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa lớp đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        MaClassService.delete(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
            }, 100);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    createGradeDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateMaClass.getAllGradeInitial();
      this.$refs.CreateMaClass.resetFormData();
    },
    clickNumberTeacher(index, row) {
      this.showShowMaclassDialog = true;
      this.$refs.ShowMaClass.getDetailInitial(row.id);
    },
    clickNumberEmployee(index, row) {
      this.showEmployeeInClassDialog = true;
      this.$refs.ShowEmployeeInClass.getDetailInitial(row.id);
    },
  },
  beforeMount() {
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-pagination .el-select .el-input {
  width: 75px;
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
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
/deep/.el-table .cell {
  white-space: pre-line;
  word-break: break-word;
  line-height: 23px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-number-teacher {
  border: none;
  padding: 0;
  color: blue;
}
.click-number-teacher:hover {
  color: blue;
  background: none;
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
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click-right {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  /deep/.el-table th > .cell {
    text-align: center !important;
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
}
</style>
