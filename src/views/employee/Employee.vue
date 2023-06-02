<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left">
        <!-- trạng thái đăng nhập -->
        <el-select
          style="width: 155px; margin-right: 5px"
          v-model="dataSearch.loginStatus"
          @change="searchHeaderMethod()"
          clearable
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in loginStatusList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="button-left"
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
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
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
        <el-button
          v-if="checkPermission(['infoEmployee_list_update'])"
          class="button-over"
          type="success"
          @click="createEmployeeDialog()"
        >
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>
        <el-dropdown
          v-if="
            checkPermission(['infoEmployee_list_app']) ||
            checkPermission(['infoEmployee_list_sms'])
          "
          @command="handleSendNotify"
        >
          <el-button class="button-over" type="success">
            Gửi tin
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item
              v-if="checkPermission(['infoEmployee_list_app'])"
              command="createNotifyApp"
              >Gửi qua App</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['infoEmployee_list_sms'])"
              command="createNotifySms"
              >Gửi qua SMS</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['infoEmployee_list_sms'])"
              command="sendAccount"
              >Gửi tài khoản</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <span v-if="checkPermission(['infoEmployee_list_update'])">
              <el-dropdown-item command="activeAccount">Kích hoạt App</el-dropdown-item>
              <el-dropdown-item command="unactiveAccount"
                >Hủy kích hoạt App</el-dropdown-item
              >
              <el-dropdown-item command="activeSMS">Kích hoạt SMS</el-dropdown-item>
              <el-dropdown-item command="unactiveSMS">Hủy kích hoạt SMS</el-dropdown-item>
            </span>
            <el-dropdown-item command="importExcel">Nhập File Excel</el-dropdown-item>
            <el-dropdown-item command="exportExcel">Xuất File Excel</el-dropdown-item>
            <el-dropdown-item v-if="deleteStatusButton" command="deleteMultiEmployee"
              >Xóa nhân sự</el-dropdown-item
            >
            <el-dropdown-item command="groupOut">Ra trường</el-dropdown-item>
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
        <el-table-column fixed prop="fullName" min-width="170" label="Họ tên">
          <template slot-scope="scope">
            <el-button
              class="click-in-row"
              type="text"
              @click="clickFullName(scope.$index, scope.row)"
              >{{ scope.row.fullName }}</el-button
            >
          </template>
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
        <el-table-column label="Lớp" min-width="120">
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
        <el-table-column label="SMS" align="center" width="70">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="!checkPermission(['infoEmployee_list_update'])"
              @change="activeOneSMSMethod(scope.row)"
              v-model="scope.row.smsReceive"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Kích hoạt" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="!checkPermission(['infoEmployee_list_update'])"
              @change="activeOneMethod(scope.row)"
              v-model="scope.row.activated"
            ></el-checkbox>
            <el-tooltip
              v-if="scope.row.login"
              effect="dark"
              content="Đã đăng nhập"
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
            <span v-else>
              <el-tooltip :content="'Mật khẩu: ' + scope.row.password" placement="top">
                <span>{{ scope.row.username }}</span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="checkPermission(['infoEmployee_list_update'])"
          label="Tác vụ"
          align="center"
          fixed="right"
          :width="deleteStatusButton ? 240 : 170"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >Sửa</el-button
            >
            <el-button
              :disabled="dataSearch.statusEmployeee == 'Nghỉ làm' ? true : false"
              size="mini"
              type="primary"
              @click="updateEmployeeStatusMethod(scope.row)"
              >Nghỉ làm</el-button
            >
            <el-button
              v-if="deleteStatusButton"
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
    <CreateEmployee
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateEmployee"
    />
    <UpdateEmployee
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateEmployee"
    />
    <CreateEmployeeNotify
      v-bind:dataEmployeeNotifyList="dataEmployeeNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />
    <CreateEmployeeNotifySms
      v-bind:dataEmployeeNotifySmsList="dataEmployeeNotifySmsList"
      :dialogVisibleSms="showCreateNotifySmsDialog"
      @dialog-close="dialogCloseCreateNotifySmsMethod()"
      ref="CreateEmployeeNotifySms"
    />
    <CreateEmployeeExcel
      :dialogVisibleExEmployee="showCreateExcelDialog"
      @dialog-close="dialogCloseCreateExcelMethod()"
      ref="CreateEmployeeExcel"
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
    <EmployeeUpdateStatusDialog
      :dialogVisible="showUpdateEmployeeStatus"
      @dialog-close="closeUpdateEmployeeStatus()"
      ref="EmployeeUpdateStatusDialog"
    />
    <CreateSmsDialog
      :dialogVisible="showCreateSms"
      @dialog-close="closeCreateSmsMethod()"
      ref="CreateSmsDialog"
    />
    <CreateEmployeeGroupOutDialog
      :listEmployee="multipleSelection"
      :dialogVisible="showCreateGroupOutDialog"
      @dialog-close="closeCreateGroupOutDialog()"
      ref="CreateEmployeeGroupOutDialog"
    />
  </div>
</template>

<script>
// import http from "../../http-download";
import moment from "moment";
import checkPermission from "@/utils/permission.js";
import EmployeeDataService from "@/services/EmployeeDataService";
import DepartmentDataService from "@/services/DepartmentDataService";
import CommonOnekidsService from "@/services/CommonOnekidsService";
import CreateEmployee from "./CreateEmployee.vue";
import UpdateEmployee from "./UpdateEmployee.vue";
import CreateEmployeeNotify from "./CreateEmployeeNotify.vue";
import CreateEmployeeNotifySms from "./CreateEmployeeNotifySms.vue";
import CreateEmployeeExcel from "./CreateEmployeeExcel.vue";
import AccountHandle from "@/views/common/AccountHandle.vue";
import ChangePhoneSMS from "@/views/common/ChangePhoneSMS.vue";
import EmployeeUpdateStatusDialog from "./EmployeeUpdateStatusDialog.vue";
import CreateEmployeeGroupOutDialog from "./CreateEmployeeGroupOutDialog.vue";
import CreateSmsDialog from "../common/CreateSmsDialog.vue";

export default {
  components: {
    CreateEmployee,
    UpdateEmployee,
    CreateEmployeeNotify,
    CreateEmployeeNotifySms,
    CreateEmployeeExcel,
    AccountHandle,
    ChangePhoneSMS,
    EmployeeUpdateStatusDialog,
    CreateSmsDialog,
    CreateEmployeeGroupOutDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      deleteStatusButton: false,
      employeeDataList: [],
      multipleSelection: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showCreateNotifyDialog: false,
      showCreateNotifySmsDialog: false,
      showCreateExcelDialog: false,
      showAccountHandeDialog: false,
      showChangePhoneSMSDialog: false,
      showUpdateEmployeeStatus: false,
      showCreateGroupOutDialog: false,
      showCreateSms: false,
      loading: "",
      loginStatusList: [
        { key: false, value: "Chưa đăng nhập" },
        { key: true, value: "Đã đăng nhập" },
      ],
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
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
        loginStatus: "",
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    checkPermission,
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      // this.fetchDataMany();
      location.reload();
      this.dataEmployeeNotifySmsList = [];
      this.dataEmployeeNotifySmsList.listId = [];
      this.dataEmployeeNotifySmsList.listNoActive = [];
    },
    dialogCloseCreateExcelMethod() {
      this.showCreateExcelDialog = false;
      this.searchByProperties();
    },
    createSmsMethod() {
      this.showCreateSms = true;
      let idList = this.multipleSelection.map((x) => x.id);
      this.$refs.CreateSmsDialog.getDataCreateSmsInitial(idList, "employee", "employee");
    },
    closeCreateSmsMethod() {
      this.showCreateSms = false;
    },
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
        this.getStyleExcelEmployee();
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        // return http
        //   .get(`employees/export-excel/employee?list=` + list)
        //   .then((response) => {
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement("a");
        //     link.href = url;
        //     link.setAttribute(
        //       "download",
        //       "QUAN_LY_NHAN_SU_" + myDate + ".xlsx"
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
        //   });
        EmployeeDataService.exportExcelEmployeeNew(list)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_NHAN_SU_${myDate}`;
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
      });
    },
    getStyleExcelEmployee() {
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
          font: { bold: true, sz: "11" },
        },
      };
      this.styleCols2.push(styleCol1);

      this.styleCols1.push(styleCol2);
      this.styleCols1.push(styleCol3);
    },
    // Nhập file excel
    importExcelEmployee() {
      this.showCreateExcelDialog = true;
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
    sendAccount() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn",
          type: "error",
        });
        return;
      } else if (list.length > 1000) {
        this.$message({
          message: "Bạn không thể gửi vượt quá 1000 người/lần gửi",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn gửi tài khoản cho nhân viên đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.openFullScreen2();
        EmployeeDataService.sendAccountEmployee(list)
          .then((response) => {
            this.loading.close();
            console.log(response);
            this.$message({
              message: response.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.loading.close();
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    openFullScreen2() {
      this.loading = this.$loading({
        lock: true,
        text: "Tài khoản đang được gửi. Xin vui lòng chờ trong giây lát!",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // setTimeout(() => {
      //   loading.close();
      // }, 2000);
    },
    createNotifyDialog(data) {
      // this.dataListNotify = data;
      // this.dataListNotify.forEach((value) => {
      //   this.dataEmployeeNotifyList.push(value.id);
      // });
      this.dataEmployeeNotifyList = data.map((x) => x.id);
      this.showCreateNotifyDialog = true;
    },
    // sendSmsMethod() {
    //   this.showCreateNotifySmsDialog = true;
    //   let idInfoEmployeeList = this.multipleSelection.map((x) => x.id);
    //   this.$refs.CreateEmployeeNotifySms.getSendSmsInitial(idInfoEmployeeList);
    // },
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
    handleCommand(command) {
      if (command == "importExcel") {
        this.importExcelEmployee();
      } else {
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
        } else if (command == "groupOut") {
          this.handelGroupOut();
        }
      }
    },
    accountHanedleDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "teacher",
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
    updateEmployeeStatusMethod(row) {
      this.showUpdateEmployeeStatus = true;
      this.$refs.EmployeeUpdateStatusDialog.getStatusDataInitial(row.id, row.fullName);
    },
    dialogCloseAccountHandleMethod() {
      this.showAccountHandeDialog = false;
      this.searchByProperties();
    },
    dialogCloseChangePhoneSMSMethod() {
      this.showChangePhoneSMSDialog = false;
      this.searchByProperties();
    },
    closeUpdateEmployeeStatus() {
      this.showUpdateEmployeeStatus = false;
      this.searchByProperties();
    },
    closeCreateGroupOutDialog() {
      this.searchByProperties();
      this.showCreateGroupOutDialog = false;
    },
    /**
     * Chuyển đồi học sinh ra trường
     */
    handelGroupOut() {
      this.showCreateGroupOutDialog = true;
    },
    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //click edit at row
    handleEdit(index, row) {
      this.total = 1;
      this.handleCurrentChangeAfter();
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployee.clickNameInitial("noFullName");
      this.$refs.UpdateEmployee.getEmployeeById(row.id);
      this.$refs.UpdateEmployee.getAllAccountType();
      this.$refs.UpdateEmployee.getTabDepartmentInEmployee();
      this.$refs.UpdateEmployee.getTabProfessionalInEmployee();
      this.$refs.UpdateEmployee.tabTeacherIconMethod(row.id);
    },
    handleCurrentChangeAfter() {
      this.handleCurrentChange(1);
    },
    clickFullName(index, row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateEmployee.clickNameInitial("fullName");
      this.$refs.UpdateEmployee.getEmployeeById(row.id);
      this.$refs.UpdateEmployee.getAllAccountType();
      this.$refs.UpdateEmployee.getTabDepartmentInEmployee();
      this.$refs.UpdateEmployee.getTabProfessionalInEmployee();
      this.$refs.UpdateEmployee.tabTeacherIconMethod(row.id);
    },
    handleDelete(index, row) {
      this.$confirm(
        "Thao tác này sẽ xóa toàn bộ thông tin của nhân sự bao gồm cả thông tin tài chính. Bạn có chắc chắn muốn xóa nhân viên đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        EmployeeDataService.delete(row.id)
          .then((resp) => {
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
    handleMultiDelelte() {
      let idList = [];
      this.multipleSelection.forEach((x) => idList.push(x.id));
      this.$confirm(
        "Thao tác này sẽ xóa toàn bộ thông tin của nhân sự bao gồm cả thông tin tài chính, Bạn có chắc chắn muốn xóa các nhân viên đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        EmployeeDataService.deleteMulti(idList)
          .then((resp) => {
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
    createEmployeeDialog() {
      this.total = 1;
      this.showCreateDialog = true;
      this.$refs.CreateEmployee.getAllAccountType();
      this.$refs.CreateEmployee.getTabDepartmentInEmployee();
      this.$refs.CreateEmployee.getTabProfessionalInEmployee();
      this.$refs.CreateEmployee.tabTeacherIconMethod();
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
      this.textTable = "";
      EmployeeDataService.searchEmployeeInSchool(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.loginStatus,
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
          console.log(err);
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
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
          let a = this.departmentList;
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getSchoolConfigAddMethod() {
      await CommonOnekidsService.getSchoolConfigAdd()
        .then((resp) => {
          this.deleteStatusButton = resp.data.data.deleteStatus;
        })
        .catch((err) => {
          throw err;
        });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      this.getDepartment();
      await Promise.all([this.getSchoolConfigAddMethod()])
        .then(() => {
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
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
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
h4.edit {
  color: red;
  position: absolute;
  bottom: -12px;
  right: 18px;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
</style>
