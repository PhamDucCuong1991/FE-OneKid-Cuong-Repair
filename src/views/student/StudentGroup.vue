<template>
  <div class="content">
    <div class="button-click row-data" style="margin-top: 5px">
      <el-button
        v-if="checkPermission(['kids_group_update'])"
        class="button-over"
        type="success"
        @click="createGradeDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-dropdown v-if="checkPermission(['kids_list_app'])" @command="handleSendNotify">
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
          <!-- bổ sung gửi qua sms -->
          <!-- <el-dropdown-item command="createNotifySms">Gửi qua SMS</el-dropdown-item>   //ko dùng -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        class="button-over"
        type="success"
        @click="exportExcel()"
        :loading="loaddingExcel"
        >Xuất File Excel</el-button
      >
    </div>
    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="tableDataFilter"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="groupName" label="Tên nhóm"></el-table-column>
        <el-table-column prop="description" label="Mô tả nhóm"></el-table-column>
        <el-table-column
          prop="kidsNumber"
          label="Số lượng"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="checkPermission(['kids_group_update'])"
          label="Tác vụ"
          width="220"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleTransfer(scope.$index, scope.row)"
              >Thêm</el-button
            >
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

    <CreateStudentGroup
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateStudentGroup"
    />
    <UpdateStudentGroup
      :dialogVisible="showUpdateDialog"
      :editKidsGroup="updateKidsGroup"
      @dialog-close="dialogCloseUpdateMethod()"
    />
    <StudentGroupTransfer
      :dialogVisible="showTransferDialog"
      @dialog-close="dialogCloseTranferMethod()"
      ref="StudentGroupTransfer"
    />
    <CreateStudentNotify
      v-bind:dataGroupNotifyList="dataGroupNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />
    <CreateStudentNotifySms
      v-bind:dataGroupNotifySmsList="dataGroupNotifySmsList"
      :dialogVisibleSms="showCreateNotifySmsDialog"
      @dialog-close="dialogCloseCreateNotifySmsMethod()"
      ref="CreateStudentNotifySms"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import KidsGroupService from "@/services/KidsGroupService";
import CreateStudentGroup from "./CreateStudentGroup.vue";
import UpdateStudentGroup from "./UpdateStudentGroup.vue";
import StudentGroupTransfer from "./StudentGroupTransfer.vue";
import CreateStudentNotify from "./CreateStudentNotify.vue";
import CreateStudentNotifySms from "./CreateStudentNotifySms.vue";
// import http from "../../http-download";
import moment from "moment";

export default {
  components: {
    CreateStudentGroup,
    UpdateStudentGroup,
    StudentGroupTransfer,
    CreateStudentNotify,
    CreateStudentNotifySms,
  },

  data() {
    return {
      dir: "C:/export",
      files: [],
      file: "",
      loadingData: true,
      loaddingExcel: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      tableDataFilter: [],
      kidsGroupList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showTransferDialog: false,
      showCreateNotifySmsDialog: false,
      showCreateNotifyDialog: false,
      multipleSelection: [],
      dataListNotify: [],
      listIdKid: [],
      dataListNotifySms: [],
      dataGroupNotifySmsList: {
        listId: [],
        listNoActive: [],
      },
      dataGroupNotifyList: [],
      updateKidsGroup: {
        id: "",
        groupName: "",
        description: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    checkPermission,
    dialogCloseCreateNotifySmsMethod() {
      this.multipleSelection = [];
      this.showCreateNotifySmsDialog = false;
      this.dataGroupNotifySmsList = [];
      this.dataGroupNotifySmsList.listId = [];
      this.dataGroupNotifySmsList.listNoActive = [];
    },
    exportExcel() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có nhóm nào được chọn",
          type: "error",
        });
        return;
      }
      if (selectRowList.length > 1) {
        this.$message({
          message: "Chỉ được phép chọn một nhóm",
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
            this.getStyleExcelGroup();
            let id = selectRowList[0].id;
            let name = selectRowList[0].groupName;
            let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
            KidsGroupService.exportExcelGroupNew(id)
              .then((resp) => {
                import("@/services/ExportExcel")
                  .then((excel) => {
                    let dataList = resp.data.data;
                    let fileName = `QUAN_LY_NHOM_HOC_SINH_${name}_${myDate}`;
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
    //Style css Excel Group
    getStyleExcelGroup() {
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
    // CREATE NOTIFY
    handleSendNotify(command) {
      let kidClass = this.multipleSelection;
      if (kidClass.length == 0) {
        this.$message({
          message: "Không có khối nào được chọn",
          type: "error",
        });
        return;
      }
      if (command == "createNotifyApp") {
        this.createNotifyDialog(kidClass);
      } else if (command == "createNotifySms") {
        this.createNotifySmsDialog(kidClass);
      }
    },
    createNotifyDialog(data) {
      this.dataListNotify = data;
      this.dataListNotify.forEach((value) => {
        this.dataGroupNotifyList.push(value.id);
      });
      this.showCreateNotifyDialog = true;
    },
    createNotifySmsDialog(data) {
      if (data.length > 1) {
        this.$message({
          message: "Bạn chỉ được chọn 1 nhóm.",
          type: "error",
        });
        return;
      }
      console.log(data);
      let dataList;
      data.forEach((val) => {
        dataList.push(val.id);
      });
      KidsGroupService.getById(dataList)
        .then((resp) => {
          console.log(resp);
          this.dataListNotifySms = resp.data.data.kidsList;
          this.dataListNotifySms.forEach((value) => {
            if (value.delActive == true) {
              this.dataGroupNotifySmsList.listId.push(value.id);
              if (value.smsReceive == false) {
                this.dataGroupNotifySmsList.listNoActive.push(value.id);
              }
            }
          });
          console.log(this.dataGroupNotifySmsList);
          this.showCreateNotifySmsDialog = true;
          this.$refs.CreateStudentNotifySms.getNumber();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
      this.dataGroupNotifyList = [];
    },
    // select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },

    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllKidsGroup();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllKidsGroup();
    },

    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.updateKidsGroup.id = row.id;
      this.updateKidsGroup.groupName = row.groupName;
      this.updateKidsGroup.description = row.description;
    },
    createGradeDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateStudentGroup.resetFormData();
    },
    dialogCloseCreateMethod() {
      this.getAllKidsGroup();
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.getAllKidsGroup();
      this.showUpdateDialog = false;
    },
    dialogCloseTranferMethod() {
      this.getAllKidsGroup();
      this.showTransferDialog = false;
    },
    handleTransfer(index, row) {
      setTimeout(() => {
        this.showTransferDialog = true;
      }, 500);
      this.$refs.StudentGroupTransfer.getDataInitial(row.id);
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa nhóm đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        KidsGroupService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa nhóm thành công",
              type: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.getAllKidsGroup();
            }, 500);
          });
      });
    },

    getAllKidsGroup() {
      this.loadingData = true;
      this.textTable = "";
      KidsGroupService.getAll(this.pageNumber, this.maxPageItem)
        .then((resp) => {
          this.tableDataFilter = resp.data.data.kidsGroupResponseList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (this.tableDataFilter.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.getAllKidsGroup();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
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
/deep/.el-table th > .cell {
  text-align: center !important;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-pagination .el-select .el-input {
  width: 75px;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
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
}
</style>
