<template>
  <div class="content">
    <div>
      <div class="button-click-left">
        <!-- chọn đại lý -->
        <el-select
          class="button-left-class"
          v-model="dataSearch.idAgent"
          @change="changeAgentMethod()"
          placeholder="Chọn đại lý"
        >
          <el-option
            v-for="item in agentList"
            :key="item.id"
            :value="item.id"
            :label="item.agentName"
          ></el-option>
        </el-select>
        <!-- chọn trường -->
        <el-select
          class="button-left-class"
          style="width: 200px"
          filterable
          clearable
          v-model="dataSearch.idSchool"
          placeholder="Chọn trường"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :value="item.id"
            :label="item.id + ' - ' + item.schoolName"
          >
            <span>{{ item.id }}</span> -
            <span>{{ item.schoolName }}</span>
          </el-option>
        </el-select>
        <!-- trạng thái xóa -->
        <el-select
          class="button-left-small"
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
        <!-- appType -->
        <el-select
          class="button-left-small"
          v-model="dataSearch.appType"
          placeholder="Chọn nhân sự"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in appTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="button-left-small"
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
        <el-input
          style="width: 260px"
          placeholder="Nhập tên hoặc SĐT"
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
        <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="changePasswordCommand"
              >Đổi mật khẩu
            </el-dropdown-item>
            <!-- <el-dropdown-item command="activeAccount">Kích hoạt App</el-dropdown-item>
            <el-dropdown-item command="unactiveAccount"
              >Hủy kích hoạt App</el-dropdown-item
            >
            <el-dropdown-item command="activeSMS">Kích hoạt SMS</el-dropdown-item>
            <el-dropdown-item command="unactiveSMS">Hủy kích hoạt SMS</el-dropdown-item>

            <el-dropdown-item command="importExcel">Nhập File Excel</el-dropdown-item>
            <el-dropdown-item command="exportExcel">Xuất File Excel</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
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
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
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
        <el-table-column
          fixed
          prop="fullName"
          min-width="170"
          sortable
          label="Họ tên"
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
          label="Trường"
          min-width="200"
        >
        <template slot-scope="scope">
            <span> {{ scope.row.school.id }} - {{ scope.row.school.schoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdDate"
          label="Thời gian tạo"
          align="center"
          width="135"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Phòng ban" width="120">
          <template slot-scope="scope">
            <el-span
              v-for="item in scope.row.departmentEmployeeList"
              :key="item.department.id"
              >- {{ item.department.departmentName }}<br />
            </el-span>
          </template>
        </el-table-column>
        <el-table-column label="Lớp" min-width="130">
          <template slot-scope="scope">
            <el-span
              v-for="item in scope.row.exEmployeeClassList"
              :key="item.maClass.id"
              >- {{ item.maClass.className }}
              <span v-if="item.master"> - CN</span><br />
            </el-span>
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
                disabled
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
        <el-table-column label="Kích hoạt" align="center" width="110" sortable>
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="
                scope.row.activated
                  ? 'Hủy kích hoạt tài khoản'
                  : 'Kích hoạt tài khoản'
              "
              placement="top"
            >
              <el-checkbox
                @change="activeOneMethod(scope.row)"
                v-model="scope.row.activated"
              ></el-checkbox>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.login"
              effect="dark"
              content="Đang đăng nhập"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                style="margin-left: 10px; color: #409eff"
              />
            </el-tooltip>
            <el-tooltip
              v-else
              effect="dark"
              content="Chưa đăng nhập"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                style="margin-left: 10px; color: red"
              />
            </el-tooltip>
          </template>
          <i
            style="color: #78a5e7; margin-left: 10px"
            class="el-icon-success"
          />
        </el-table-column>
        <el-table-column label="SMS" align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="
                scope.row.smsReceive ? 'Hủy kích hoạt SMS' : 'Kích hoạt SMS'
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
        <el-table-column
          prop="birthday"
          sortable
          label="Ngày sinh"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.birthday | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="email"
          label="Email"
        ></el-table-column>

        <el-table-column
          label="Tác vụ"
          align="center"
          fixed="right"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="dataSearch.deleteStatus"
              style="width: 85px"
              size="mini"
              type="danger"
              @click="deleteEmployeeMethod(scope.row)"
              >Xóa</el-button
            >
            <el-button
              v-else
              style="width: 85px"
              size="mini"
              type="warning"
              @click="restoreEmployeeMethod(scope.row)"
              >Khôi phục</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >Sửa</el-button
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
    <UpdateEmployee
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateEmployee"
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
    <ChangePasswordMany
      :dialogVisible="showChangePasswordManyDialog"
      @dialog-close="closeChangePasswordManyDialog()"
      ref="ChangePasswordMany"
    />
  </div>
</template>

<script>
import EmployeeDataService from "@/services/EmployeeDataService";
import EmployeeMasterService from "@/services/EmployeeMasterService";
import UpdateEmployee from "./UpdateEmployee.vue";
import SchoolMasterService from "@/services/SchoolMasterService";
import AgentService from "@/services/AgentService";
import SchoolService from "@/services/SchoolService";
import AccountHandle from "@/views/common/AccountHandle.vue";
import ChangePhoneSMS from "@/views/common/ChangePhoneSMS.vue";
import ChangePasswordMany from "./ChangePasswordMany.vue";

export default {
  components: {
    UpdateEmployee,
    AccountHandle,
    ChangePhoneSMS,
    ChangePasswordMany,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      agentList: [],
      schoolList: [],
      employeeDataList: [],
      multipleSelectionEmployee: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showCreateNotifyDialog: false,
      showCreateNotifySmsDialog: false,
      showAccountHandeDialog: false,
      showChangePhoneSMSDialog: false,
      showChangePasswordManyDialog: false,
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      appTypeList: [
        { key: "plus", value: "Nhà trường" },
        { key: "teacher", value: "Giáo viên" },
      ],
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      departmentList: [],
      dataListNotify: [],
      dataListNotifySms: [],
      dataEmployeeNotifyList: [],
      dataEmployeeNotifySmsList: {
        listId: [],
        listNoActive: [],
      },
      fixpage: 1,
      fixpagenumber: 10,
      idList: [],
      updateSelectedActivated: {
        updateEmployeeMainInfoRequest: {
          activated: "",
          id: "",
        },
      },
      dataSearch: {
        deleteStatus: true,
        idAgent: "",
        idSchool: "",
        appType: "plus",
        statusEmployeee: "Đang làm",
        employeeNameOrPhone: "",
      },
    };
  },
  methods: {
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      this.dataEmployeeNotifySmsList.listId = [];
      this.dataEmployeeNotifySmsList.listNoActive = [];
    },
    handleSendNotify(command) {
      let employeeList = this.multipleSelectionEmployee;
      if (employeeList.length == 0) {
        this.$message({
          message: "Không có nhận sự nào được chọn",
          type: "error",
        });
        return;
      }
      if (command == "createNotifyApp") {
        this.createNotifyDialog(employeeList);
      } else if (command == "createNotifySms") {
        this.createNotifySmsDialog(employeeList);
      }
    },
    accountHanedleDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: this.dataSearch.appType,
        phone: row.phone,
      };
      this.showAccountHandeDialog = true;
      this.$refs.AccountHandle.getAccountHandelInitial(objectData);
    },
    changePhoneSMSDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "teacher",
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
    createNotifyDialog(data) {
      this.dataListNotify = data;
      this.dataListNotify.forEach((value) => {
        this.dataEmployeeNotifyList.push(value.id);
      });
      this.showCreateNotifyDialog = true;
    },
    createNotifySmsDialog(data) {
      this.dataListNotifySms = data;
      console.log(this.dataListNotifySms);

      this.dataListNotifySms.forEach((value) => {
        this.dataEmployeeNotifySmsList.listId.push(value.id);
        if (value.smsReceive == false) {
          this.dataEmployeeNotifySmsList.listNoActive.push(value.id);
        }
      });
      console.log(this.dataEmployeeNotifySmsList);
      this.showCreateNotifySmsDialog = true;
      this.$refs.CreateEmployeeNotifySms.getNumber();
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
    },
    //
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
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
    handleCommand(command) {
      let dataList = this.multipleSelectionEmployee;
      if (dataList.length == 0) {
        this.$message({
          message: "Chưa có nhân viên nào được chọn",
          type: "error",
        });
        return;
      }
      let idList = dataList.map((x) => x.id);
      if (command == "changePasswordCommand") {
        this.changePasswordManyMethod(idList);
      }
      // if (command == "activeAccount") {
      //   this.updateMultiActivated(idList, true);
      // } else if (command == "unactiveAccount") {
      //   this.updateMultiActivated(idList, false);
      // } else if (command == "activeSMS") {
      //   this.updateMultiActivatedSMS(idList, true);
      // } else if (command == "unactiveSMS") {
      //   this.updateMultiActivatedSMS(idList, false);
      // } else if (command == "deleteMultiEmployee") {
      //   this.handleMultiDelelte();
      // } else if (command == "exportExcel") {
      //   this.exportExcelEmployee();
      // } else if (command == "importExcel") {
      //   this.importExcelEmployee();
      // }
    },
    closeChangePasswordManyDialog() {
      this.showChangePasswordManyDialog = false;
      this.searchByProperties();
    },
    changePasswordManyMethod(idList) {
      this.showChangePasswordManyDialog = true;
      this.$refs.ChangePasswordMany.getDataInitial("employeeType", idList);
    },

    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelectionEmployee = val;
    },
    //click edit at row
    handleEdit(index, row) {
      this.total = 1;
      this.handleCurrentChangeAfter();
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployee.clickNameInitial("noFullName");
      this.$refs.UpdateEmployee.getEmployeeById(row.id);
    },
    handleCurrentChangeAfter() {
      this.handleCurrentChange(1);
      // this.total = 1;
    },
    clickFullName(index, row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployee.clickNameInitial("fullName");
      this.$refs.UpdateEmployee.getEmployeeById(row.id);
    },
    //click delete at row
    deleteEmployeeMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa nhân sự đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        EmployeeMasterService.deleteEmployeeAdmin(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
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
    //click delete at row
    restoreEmployeeMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn khôi phục nhân sự đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        EmployeeMasterService.restoreEmployeeAdmin(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
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
    handleMultiDelelte() {
      console.log(this.multipleSelectionEmployee);
      let idList = [];
      this.multipleSelectionEmployee.forEach((x) => idList.push(x.id));

      this.$confirm(
        "Bạn có chắc chắn muốn xóa tất cả nhân viên đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
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
      SchoolMasterService.searchEmployeeMaster(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.statusEmployeee,
        this.dataSearch.employeeNameOrPhone,
        this.dataSearch.appType
      )
        .then((resp) => {
          this.employeeDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          console.log(err);
          this.pageTotal = 1;
          this.studentList = [];
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
      EmployeeDataService.updateActiveOne(row)
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
      EmployeeDataService.updateActiveOneSMSReceive(row)
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

    /**
     * thay đổi đại lý
     */
    async changeAgentMethod() {
      await this.getSchoolMethod();
      this.searchHeaderMethod();
    },

    /**
     * danh sách đại lý
     */
    async getAgentMethod() {
      await AgentService.getAllCommon()
        .then((resp) => {
          this.agentList = resp.data.data;
          if (this.agentList.length > 0) {
            this.dataSearch.idAgent = this.agentList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * danh sách trường theo đại lý đã chọn
     */
    async getSchoolMethod() {
      await SchoolService.getSchoolInAgent(this.dataSearch.idAgent)
        .then((resp) => {
          this.schoolList = resp.data.data;
          this.dataSearch.idSchool = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * get data initial
     */
    async fetchDataMany() {
      await this.getAgentMethod();
      await Promise.all([this.getSchoolMethod()])
        .then((resp) => {
          console.log(resp);
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeMount() {
    this.fetchDataMany();
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
    margin-right: 5px;
    width: 145px;
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
  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: auto;
    margin-top: -1px;
  }
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    // max-height: 50px;
    text-overflow: ellipsis;
  }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    // margin-left: 5px;
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
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.button-left-class {
  margin-right: 5px;
  width: 140px;
}
.button-left-small {
  margin-right: 5px;
  width: 120px;
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
