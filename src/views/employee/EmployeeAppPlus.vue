<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left">
        <!-- trạng thái xóa -->
        <el-select
          class="button-left button-click-cl"
          v-model="dataSearch.deleteStatus"
          placeholder="Chọn trạng thái"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in deleteList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <!-- trạng thái làm -->
        <el-select
          class="button-left button-click-cl"
          v-model="dataSearch.statusEmployeee"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in statusEmployeeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <!-- phòng ban -->
        <el-select
          class="button-left"
          v-model="dataSearch.idDepartment"
          @change="searchHeaderMethod()"
          placeholder="Phòng ban"
          clearable
        >
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- tên hoặc số điện thoại -->
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc SĐT Plus"
          v-model="dataSearch.employeeNameOrPhone"
          @keyup.enter.native="searchHeaderMethod()"
          clearable
          @clear="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>
      <div class="button-click row-data">
        <el-button class="button-over" type="success" @click="createEmployeeDialog()">
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>
        <!-- <el-dropdown @command="handleSendNotify">
          <el-button class="button-over" type="success">
            Gửi tin
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="createNotifyApp">Gửi qua App</el-dropdown-item>
            <el-dropdown-item command="createNotifySms">Gửi qua SMS</el-dropdown-item>
            <el-dropdown-item command="sendAccount">Gửi tài khoản</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

        <!-- <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="activeAccount">Kích hoạt App</el-dropdown-item>
            <el-dropdown-item command="unactiveAccount"
              >Hủy kích hoạt App</el-dropdown-item
            >
            <el-dropdown-item command="activeSMS">Kích hoạt SMS</el-dropdown-item>
            <el-dropdown-item command="unactiveSMS">Hủy kích hoạt SMS</el-dropdown-item>

            <el-dropdown-item>Nhập File Excel</el-dropdown-item>
            <el-dropdown-item command="exportExcel">Xuất File Excel</el-dropdown-item>
            <el-dropdown-item command="deleteMultiEmployee">Xóa nhân sự</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="employeeDataList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          fixed
          type="selection"
          label="STT"
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
        <el-table-column
          fixed
          prop="fullName"
          min-width="170"
          label="Họ tên"
          align="left"
        >
          <template slot-scope="scope">
            <el-button
              class="click-fullname"
              @click="clickFullName(scope.$index, scope.row)"
              >{{ scope.row.fullName }}</el-button
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="phone"
          label="SĐT"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column label="SĐT-SMS" align="center" width="100">
          <template slot-scope="scope">
            <el-tooltip content="Đổi số điện thoại nhận SMS" placement="top">
              <el-button
                class="click-in-row"
                @click="changePhoneSMSDialogMethod(scope.row)"
                type="text"
                size="mini"
              >
                <span>{{ scope.row.phoneSMS }}</span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Tài khoản" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.username == ''">
              <el-button
                class="handle-account"
                @click="accountHanedleDialogMethod(scope.row)"
                type="text"
                size="mini"
              >
                <span>&#8810;Xử lý&#8811;</span>
              </el-button>
            </span>
            <span v-else>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="password"
          width="120"
          label="Mật khẩu"
          align="center"
        ></el-table-column>

        <el-table-column prop="activated" label="Kích hoạt" align="center" width="110">
          <template slot-scope="scope">
            <el-checkbox
              @change="activeOneMethod(scope.row)"
              v-model="scope.row.activated"
            ></el-checkbox>
            <el-tooltip
              v-if="scope.row.login"
              effect="dark"
              content="Đang đăng nhập"
              placement="top"
            >
              <i class="el-icon-circle-check" style="margin-left: 10px; color: #409eff" />
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="Chưa đăng nhập" placement="top">
              <i class="el-icon-circle-check" style="margin-left: 10px; color: red" />
            </el-tooltip>
          </template>
          <i style="color: #78a5e7; margin-left: 10px" class="el-icon-success" />
        </el-table-column>
        <el-table-column label="Nhận SMS" align="center" width="90">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="
                scope.row.smsReceive ? 'Hủy kích hoạt nhận SMS' : 'Kích hoạt nhận SMS'
              "
              placement="top"
            >
              <el-checkbox
                @change="activeOneSMSMethod(scope.row)"
                v-model="scope.row.smsReceive"
              ></el-checkbox>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Gửi SMS" align="center" width="90">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="scope.row.smsSend ? 'Hủy kích hoạt gửi SMS' : 'Kích hoạt gửi SMS'"
              placement="top"
            >
              <el-checkbox
                @change="activeOneSendSMSMethod(scope.row)"
                v-model="scope.row.smsSend"
              ></el-checkbox>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="Ngày sinh" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="email" label="Email"></el-table-column>
        <el-table-column label="Tác vụ" fixed="right" align="center" width="140">
          <template slot-scope="scope">
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
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultUser"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>
    <CreateEmployeePlus
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateEmployeePlus"
    />
    <UpdateEmployeePlus
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateEmployeePlus"
    />
    <AccountHandle
      :dialogVisible="showAccountHandeDialog"
      @dialog-close="dialogCloseAccountHandleMethod()"
      ref="AccountHandle"
    />
    <ChangePhoneSMS
      :dialogVisible="showChangePhoneSMSDialog"
      @dialog-close="dialogCloseChangePhoneSMSMethod()"
      ref="ChangePhoneSMS"
    />
    <CreateEmployeeNotify
      v-bind:dataEmployeeNotifyList="dataEmployeeNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />
  </div>
</template>

<script>
import EmployeeDataService from "@/services/EmployeeDataService";
import DepartmentDataService from "@/services/DepartmentDataService";
import SupperPlusService from "@/services/SupperPlusService";
import CreateEmployeePlus from "./CreateEmployeePlus.vue";
import UpdateEmployeePlus from "./UpdateEmployeePlus.vue";
import AccountHandle from "@/views/common/AccountHandle.vue";
import ChangePhoneSMS from "@/views/common/ChangePhoneSMS.vue";
import CreateEmployeeNotify from "./CreateEmployeeNotify.vue";
import http from "../../http-download";
import moment from "moment";

export default {
  components: {
    CreateEmployeePlus,
    UpdateEmployeePlus,
    AccountHandle,
    ChangePhoneSMS,
    CreateEmployeeNotify,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      employeeDataList: [],
      multipleSelection: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showAccountHandeDialog: false,
      showChangePhoneSMSDialog: false,
      showCreateNotifyDialog: false,
      employeeData: [],
      dataEmployeeNotifyList: [],
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      departmentList: [],
      idList: [],
      updateSelectedActivated: {
        UpdateEmployeePlusMainInfoRequest: {
          activated: "",
          id: "",
        },
      },
      dataSearch: {
        deleteStatus: true,
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
    };
  },
  methods: {
    // xuất file excel
    exportExcelEmployee() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn",
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
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        return http
          .get(`employees/export-excel/employee?list=` + list)
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "QUAN_LY_PLUS_" + myDate + ".xlsx");
            document.body.appendChild(link);
            link.click();
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
    //
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    // highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      if (row.phoneSMS == "") {
        return "color: red";
      }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // CREATE NOTIFY
    handleSendNotify(command) {
      let employeeList = this.multipleSelection;
      if (employeeList.length == 0) {
        this.$message({
          message: "Không có nhận sự nào được chọn",
          type: "error",
        });
        return;
      } else if (employeeList.length > 1000) {
        this.$message({
          message: "Bạn không thể gửi vượt quá 1000 nhân viên/lần gửi",
          type: "error",
        });
        return;
      }
      if (command == "createNotifyApp") {
        this.createNotifyDialog(employeeList);
      } else if (command == "createNotifySms") {
        this.createSmsMethod();
      } else if (command == "sendAccount") {
        this.sendAccount();
      }
    },
    createNotifyDialog(data) {
      this.dataListNotify = data;
      this.dataListNotify.forEach((value) => {
        this.dataEmployeeNotifyList.push(value.id);
      });
      this.showCreateNotifyDialog = true;
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
    },
    accountHanedleDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "plus",
        phone: row.phone,
      };
      this.showAccountHandeDialog = true;
      this.$refs.AccountHandle.getAccountHandelInitial(objectData);
    },
    changePhoneSMSDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "plus",
        oldPhone: row.phoneSMS,
      };
      this.showChangePhoneSMSDialog = true;
      this.$refs.ChangePhoneSMS.getChangePhoneSMSInitial(objectData);
    },
    dialogCloseAccountHandleMethod() {
      this.showAccountHandeDialog = false;
      this.searchByProperties();
    },
    dialogCloseChangePhoneSMSMethod() {
      this.showChangePhoneSMSDialog = false;
      this.searchByProperties();
    },
    handleCommand(command) {
      let dataList = this.multipleSelection;
      if (dataList.length == 0) {
        this.$message({
          message: "Chưa có nhân viên nào được chọn",
          type: "error",
        });
        return;
      }
      let idList = dataList.map((x) => x.id);
      if (command == "activeAccount") {
        this.updateMultiActivated(idList, true);
      } else if (command == "unactiveAccount") {
        this.updateMultiActivated(idList, false);
      } else if (command == "activeSMS") {
        this.updateMultiActivatedSMS(idList, true);
      } else if (command == "unactiveSMS") {
        this.updateMultiActivatedSMS(idList, false);
      } else if (command == "deleteMultiEmployee") {
        this.handleMultiDelelte();
      } else if (command == "exportExcel") {
        this.exportExcelEmployee();
      }
    },

    handleCurrentChangeAfter() {
      // this.employeeDataList = [];
      // this.handleCurrentChange(this.fixpage);
      // console.log(this.employeeDataList);
      // console.log("lêu lêu");
      this.employeeDataList = [];
    },
    //click edit at row
    handleEdit(index, row) {
      this.total = 1;
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployeePlus.clickNameInitial("noFullName");
      this.$refs.UpdateEmployeePlus.getEmployeeById(row.id);
      this.$refs.UpdateEmployeePlus.getAllAccountType();
      this.$refs.UpdateEmployeePlus.tabPlusIconMethod(row.id);
    },
    clickFullName(index, row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployeePlus.clickNameInitial("fullName");
      this.$refs.UpdateEmployeePlus.getEmployeeById(row.id);
      this.$refs.UpdateEmployeePlus.getAllAccountType();
      this.$refs.UpdateEmployeePlus.getTabDepartmentInEmployee();
      this.$refs.UpdateEmployeePlus.getTabProfessionalInEmployee();
      this.$refs.UpdateEmployeePlus.tabTeacherIconMethod(row.id);
      this.$refs.UpdateEmployeePlus.tabPlusIconMethod(row.id);
      // console.log("edit " + index, row);
    },
    //click delete at row
    handleDelete(index, row) {
      // console.log("delete " + index, row);
      this.$confirm("Bạn có chắc chắn muốn xóa plus đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        SupperPlusService.deletePlusById(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa nhân viên thành công",
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
    handleMultiDelelte() {
      console.log(this.multipleSelection);
      let idList = [];
      this.multipleSelection.forEach((x) => idList.push(x.id));

      this.$confirm("Bạn có chắc chắn muốn xóa tất cả nhân viên đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        EmployeeDataService.deleteMulti(idList)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa nhân viên thành công",
              type: "success",
            });
            // setTimeout(() => {
            this.searchByProperties();
            // }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa nhân viên thất bại",
              type: "error",
            });
          });
      });
    },
    createEmployeeDialog() {
      this.total = 1;
      this.showCreateDialog = true;
      this.$refs.CreateEmployeePlus.getAllAccountType();
      this.$refs.CreateEmployeePlus.tabPlusIconMethod();
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      SupperPlusService.searchEmployeeInSchoolPlus(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.statusEmployeee,
        this.dataSearch.idDepartment,
        this.dataSearch.employeeNameOrPhone
      )
        .then((resp) => {
          this.employeeDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.studentList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.employeeDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * lưu kích hoạt/hủy kích hoạt tài khoản 1 người
     */
    activeOneMethod(row) {
      SupperPlusService.updateActiveOne(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * lưu kích hoạt/hủy kích hoạt sms 1 người
     */
    activeOneSMSMethod(row) {
      SupperPlusService.updateActiveOneSMSReceive(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * lưu kích hoạt/hủy kích hoạt gửi sms 1 người
     */
    activeOneSendSMSMethod(row) {
      SupperPlusService.updateActiveOneSMSSend(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * lưu kích hoạt/hủy kích hoạt app nhiều người
     */
    updateMultiActivated(idList, status) {
      let inputData = {
        idList: idList,
        status: status,
      };
      EmployeeDataService.updateActiveMany(inputData)
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
    },
    /**
     * lưu kích hoạt/hủy kích hoạt sms nhiều người
     */
    updateMultiActivatedSMS(idList, status) {
      let inputData = {
        idList: idList,
        status: status,
      };
      EmployeeDataService.updateActiveManySMS(inputData)
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
    },
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectionActivated(index, row) {
      this.updateSelectedActivated.UpdateEmployeePlusMainInfoRequest = row;
      let checkActivated = row.activated;
      EmployeeDataService.update(row.id, this.updateSelectedActivated)
        .then((response) => {
          console.log(response.data.data);
          checkActivated
            ? this.$message({
                message: "Kích hoạt tài khoản thành công",
                type: "success",
              })
            : this.$message({
                message: "Hủy kích hoạt tài khoản thành công",
                type: "success",
              });
          //this.employeeDataList.push(this.offset);
        })
        .catch((err) => {
          this.$message({
            message: " Cập nhật Kích hoạt tài khoản thất bại",
            type: "error",
          });
          console.log(err);
        });
    },
  },

  beforeMount() {
    this.searchByProperties();
    this.getDepartment();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    width: 140px;
  }
  .button-click-cl {
    margin-right: 5px;
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
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  // /deep/.el-table .cell {
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: pre-line;
  //   word-break: break-all;
  //   line-height: 23px;
  //   padding-right: 10px;
  //   // max-height: 50px;
  //   text-overflow: ellipsis;
  // }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
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
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
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
h4.edit {
  color: red;
  position: absolute;
  bottom: -12px;
  right: 18px;
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
