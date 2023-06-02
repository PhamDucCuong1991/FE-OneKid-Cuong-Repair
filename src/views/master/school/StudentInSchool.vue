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
          style="width: 230px"
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
            :label="item.id+' - '+item.schoolName"
        >
        <span>{{ item.id }}</span> - 
        <span>{{ item.schoolName }}</span>
          </el-option>
        </el-select>
        <!-- trạng thái xóa -->
        <el-select
          class="button-left-class"
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
        <!-- chọn trạng thái -->
        <el-select
          class="button-left-class"
          v-model="dataSearch.status"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in kidStatusList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>

        <!-- nhập ô tìm kiếm -->
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="dataSearch.nameOrPhone"
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

      <!-- button lick  -->
      <div class="button-click row-data">
        <el-dropdown @command="handleCommandAction">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item command="changePasswordCommand"
              >Đổi mật khẩu
            </el-dropdown-item>
            <!-- <el-dropdown-item command="appActive">Kích hoạt App</el-dropdown-item>
            <el-dropdown-item command="appCancelActive"
              >Hủy kích hoạt App</el-dropdown-item
            >
            <el-dropdown-item command="sMSregisterReceive"
              >Đăng ký nhận SMS</el-dropdown-item
            >
            <el-dropdown-item command="sMScancelReceive"
              >Hủy đăng ký SMS</el-dropdown-item
            >
            <el-dropdown-item command="excelImport">Nhập File Excel</el-dropdown-item>
            <el-dropdown-item command="excelExport">Xuất File Excel</el-dropdown-item> -->
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
        :cell-style="tableRowStyle"
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
        <el-table-column min-width="200" fixed label="Họ tên">
          <template slot-scope="scope">
            <el-button
              class="click-fullname"
              @click="clickFullName(scope.$index, scope.row)"
              >{{ scope.row.fullName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="schoolName" width="200" label="Trường">
          <template slot-scope="scope">
            <span>{{ scope.row.id }} - {{ scope.row.schoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="maClass.className"
          width="120"
          label="Lớp"
        ></el-table-column>
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
        <el-table-column label="SĐT-SMS" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="Đổi số điện thoại nhận SMS" placement="top">
              <el-button
                class="click-in-row"
                @click="changePhoneSMSDialogMethod(scope.row)"
                type="text"
                size="mini"
              >
                <span>{{ scope.row.phone }}</span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="120" label="Tài khoản" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.username == 'Xử lý'">
              <el-button
                disabled
                class="handle-account"
                @click="accountHanedleDialogMethod(scope.row)"
                type="text"
                size="mini"
              >
                <span>&#8810;{{ scope.row.username }}&#8811;</span>
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
        <el-table-column sortable align="center" width="140" label="Ngày sinh">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          width="100"
          sortable
          label="Giới tính"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="verifyCodeSchool"
          width="120"
          label="Mã nhà trường"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="verifyCodeAdmin"
          width="120"
          label="Mã Hệ thống"
          align="center"
        ></el-table-column>

        <el-table-column prop="smsReceive" width="60" label="SMS" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.smsReceive"
              effect="dark"
              content="Hủy kích hoạt SMS"
              placement="top"
            >
              <el-checkbox
                @change="activeOneSMSMethod(scope.$index, scope.row)"
                v-model="scope.row.smsReceive"
              ></el-checkbox>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="Kích hoạt SMS" placement="top">
              <el-checkbox
                @change="activeOneSMSMethod(scope.$index, scope.row)"
                v-model="scope.row.smsReceive"
              ></el-checkbox>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column sortable label="Kích hoạt" width="120" align="center">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="
                scope.row.activated ? 'Hủy kích hoạt tài khoản' : 'Kích hoạt tài khoản'
              "
              placement="top"
            >
              <el-checkbox
                @change="activeOneMethod(scope.$index, scope.row)"
                v-model="scope.row.activated"
              ></el-checkbox>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.login == 'loginYes'"
              effect="dark"
              content="Đã đăng nhập"
              placement="top"
            >
              <i class="el-icon-circle-check" style="margin-left: 10px; color: #409eff" />
            </el-tooltip>
            <el-tooltip
              v-else-if="scope.row.login == 'loginNo'"
              effect="dark"
              content="Không đăng nhập"
              placement="top"
            >
              <i class="el-icon-circle-check" style="margin-left: 10px; color: #e6a23c" />
            </el-tooltip>
            <el-tooltip
              v-else-if="scope.row.login == 'loginYet'"
              effect="dark"
              content="Chưa từng đăng nhập"
              placement="top"
            >
              <i class="el-icon-circle-check" style="margin-left: 10px; color: red" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Tác vụ" width="260" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="dataSearch.deleteStatus"
              style="width: 85px"
              size="mini"
              type="danger"
              @click="deleteKidsMethod(scope.row)"
              >Xóa</el-button
            >
            <el-button
              v-else
              style="width: 85px"
              size="mini"
              type="warning"
              @click="restoreKidsMethod(scope.row)"
              >Khôi phục</el-button
            >
            <el-button size="mini" type="primary" @click="mergeKidsMethod(scope.row)"
              >Gộp con</el-button
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
    <UpdateStudent
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateStudent"
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
    <MergeKidDialog
      :dialogVisible="showMergeKidsDialog"
      @dialog-close="closeMegeKidsDialog()"
      ref="MergeKidDialog"
    />
    <ChangePasswordMany
      :dialogVisible="showChangePasswordManyDialog"
      @dialog-close="closeChangePasswordManyDialog()"
      ref="ChangePasswordMany"
    />
  </div>
</template>

<script>
import StudentService from "@/services/StudentService";
import StudentMasterService from "@/services/StudentMasterService";
import SchoolMasterService from "@/services/SchoolMasterService";
import AgentService from "@/services/AgentService";
import SchoolService from "@/services/SchoolService";
import UpdateStudent from "./UpdateStudent.vue";
import AccountHandle from "@/views/common/AccountHandle.vue";
import ChangePhoneSMS from "@/views/common/ChangePhoneSMS.vue";
import MergeKidDialog from "./MergeKidDialog.vue";
import ChangePasswordMany from "./ChangePasswordMany.vue";

export default {
  components: {
    UpdateStudent,
    AccountHandle,
    ChangePhoneSMS,
    MergeKidDialog,
    ChangePasswordMany,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      studentList: [],
      multipleSelection: [],
      Notify: false,
      showUpdateDialog: false,
      showCreateDialog: false,
      showChangeClassDialog: false,
      showCreateNotifySmsDialog: false,
      showCreateNotifyDialog: false,
      showAccountHandeDialog: false,
      showChangePhoneSMSDialog: false,
      showMergeKidsDialog: false,
      showChangePasswordManyDialog: false,
      agentList: [],
      schoolList: [],
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      updateGrade: {
        id: "",
        gradeName: "",
        gradeDescription: "",
      },
      dataSearch: {
        deleteStatus: true,
        idAgent: "",
        idSchool: "",
        status: "STUDYING",
        nameOrPhone: "",
      },

      classOfGradeList: [],
      kidStatusList: [
        { key: "STUDYING", value: "Đang học" },
        { key: "STUDY_WAIT", value: "Chờ học" },
        { key: "RESERVE", value: "Bảo lưu" },
        { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
      ],
      searchCodeOrname: "",
      dataListNotify: [],
      dataListNotifySms: [],
      dataKidNotifyList: [],
      dataKidNotifySmsList: {
        listId: [],
        listNoActive: [],
      },
      dataOneActive: {
        id: Number,
        checkOneActive: "",
      },
      dataOneActiveSMS: {
        id: Number,
        checkOneActiveSMS: "",
      },
    };
  },

  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      if (row.username == "Chưa có") {
        return "color: #409EFF";
      } else if (row.username == "Xử lý") {
        return "color: red";
      } else if (row.invalidAccount) {
        return "color: orange";
      }
    },
    // create notify
    createNotifyDialog(data) {
      this.dataListNotify = data;

      this.dataListNotify.forEach((value) => {
        this.dataKidNotifyList.push(value.id);
      });

      console.log(this.dataKidNotifyList);

      this.showCreateNotifyDialog = true;
    },
    createNotifySmsDialog(data) {
      this.dataListNotifySms = data;
      console.log(this.dataListNotifySms);
      this.dataListNotifySms.forEach((value) => {
        this.dataKidNotifySmsList.listId.push(value.id);
        if (value.smsReceive == false) {
          this.dataKidNotifySmsList.listNoActive.push(value.id);
        }
      });
      this.showCreateNotifySmsDialog = true;
      this.$refs.CreateStudentNotifySms.getNumber();
    },
    // select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogCloseCreateMethod() {
      this.searchByProperties();
      this.showCreateDialog = false;
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
      this.dataKidNotifyList = [];
    },
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      this.dataKidNotifySmsList.listId = [];
      this.dataKidNotifySmsList.listNoActive = [];
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },
    diglogCloseChangeClassMethod() {
      this.searchByProperties();
      this.showChangeClassDialog = false;
    },
    accountHanedleDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "parent",
        phone: row.phoneRepresentation,
      };
      this.showAccountHandeDialog = true;
      this.$refs.AccountHandle.getAccountHandelInitial(objectData);
    },
    dialogCloseAccountHandleMethod() {
      this.showAccountHandeDialog = false;
      this.searchByProperties();
    },
    dialogCloseChangePhoneSMSMethod() {
      this.showChangePhoneSMSDialog = false;
      this.searchByProperties();
    },
    closeMegeKidsDialog() {
      this.showMergeKidsDialog = false;
      this.searchByProperties();
    },
    closeChangePasswordManyDialog() {
      this.showChangePasswordManyDialog = false;
      this.searchByProperties();
    },
    changePhoneSMSDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "parent",
        oldPhone: row.phone,
      };
      this.showChangePhoneSMSDialog = true;
      this.$refs.ChangePhoneSMS.getChangePhoneSMSInitial(objectData);
    },
    mergeKidsMethod(row) {
      this.showMergeKidsDialog = true;
      this.$refs.MergeKidDialog.getMergeKidsInitial(row);
    },
    changePasswordManyMethod(idList) {
      this.showChangePasswordManyDialog = true;
      this.$refs.ChangePasswordMany.getDataInitial("kidsType", idList);
    },
    //click vào nút sửa
    handleEdit(index, row) {
      this.$refs.UpdateStudent.clickNameInitial("noFullName");
      this.$refs.UpdateStudent.getDataInitial(row.id);
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
    },
    /**
     * click vào tên
     */
    clickFullName(index, row) {
      this.$refs.UpdateStudent.clickNameInitial("fullName");
      this.$refs.UpdateStudent.getDataInitial(row.id);
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
    },
    handleCommandAction(command) {
      let kidList = this.multipleSelection;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      let idList = kidList.map((x) => x.id);
      if (command == "changePasswordCommand") {
        this.changePasswordManyMethod(idList);
      }
      // if (command == "sMSregisterReceive") {
      //   this.actionActiveSMSMethod(kidList);
      // } else if (command == "sMScancelReceive") {
      //   this.actionCancelctiveSMSMethod(kidList);
      // } else if (command == "appActive") {
      //   this.actionActiveMethod(kidList);
      // } else if (command == "appCancelActive") {
      //   this.actionCancelctiveMethod(kidList);
      // } else if (command == "studentsDelete") {
      //   this.deleteManyStudent(kidList);
      // } else if (command == "excelExport") {
      //   this.exportExcel();
      // }
    },
    handleSendNotify(command) {
      let kidList = this.multipleSelection;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      if (command == "createNotifyApp") {
        this.createNotifyDialog(kidList);
      } else if (command == "createNotifySms") {
        this.createNotifySmsDialog(kidList);
      }
    },

    // tác vụ
    actionActiveMethod(dataAction) {
      StudentService.updateManyActive(dataAction)
        .then(() => {
          this.$message({
            message: "Kích hoạt tài khoản thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Kích hoạt tài khoản thất bại",
            type: "error",
          });
        });
    },

    actionCancelctiveMethod(dataAction) {
      StudentService.updateManyCancelActive(dataAction)
        .then(() => {
          this.$message({
            message: "Hủy kích hoạt tài khoản thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy kích hoạt tài khoản thất bại",
            type: "error",
          });
        });
    },

    /**
     * đăng ký nhận sms
     */
    actionActiveSMSMethod(dataAction) {
      StudentService.updateManyActiveSMS(dataAction)
        .then(() => {
          this.$message({
            message: "Đăng ký nhận SMS thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Đăng ký nhận SMS thất bại",
            type: "error",
          });
        });
    },

    /**
     * hủy đăng ký nhận sms
     */
    actionCancelctiveSMSMethod(dataAction) {
      StudentService.updateManyCancelActiveSMS(dataAction)
        .then(() => {
          this.$message({
            message: "Hủy Đăng ký nhận SMS thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy Đăng ký nhận SMS thất bại",
            type: "error",
          });
        });
    },
    //click delete at row
    deleteKidsMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa học sinh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        StudentMasterService.deleteKidsAdmin(row.id)
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
    restoreKidsMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn khôi phục học sinh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        StudentMasterService.restoreKidsAdmin(row.id)
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
    deleteManyStudent(data) {
      StudentService.deleteManyKids(data)
        .then(() => {
          this.$message({
            message: "Xóa các học sinh thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa các học sinh thất bại",
            type: "error",
          });
        });
    },

    // kích hoạt tài khoản cho một học sinh
    activeOneMethod(index, row) {
      this.dataOneActive.id = row.id;
      let handleUpdate = (this.dataOneActive.checkOneActive = row.activated);
      StudentService.updateOneActive(this.dataOneActive)
        .then(() => {
          if (handleUpdate) {
            this.$message({
              message: "Kích hoạt tài khoản thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy kích hoạt tài khoản thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          if (handleUpdate) {
            this.$message({
              message: "Kích hoạt tài khoản thất bại",
              type: "error",
            });
          } else {
            this.$message({
              message: "Hủy kích tài khoản hoạt thất bại",
              type: "error",
            });
          }
        });
    },

    //kích hoạt tính năng nhận sms cho một học sinh
    activeOneSMSMethod(index, row) {
      this.dataOneActiveSMS.id = row.id;
      let handleUpdate = (this.dataOneActiveSMS.checkOneActiveSMS = row.smsReceive);
      StudentService.updateOneActiveSMS(this.dataOneActiveSMS)
        .then(() => {
          if (handleUpdate) {
            this.$message({
              message: "Đăng ký nhận SMS thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy đăng ký nhận SMS thành công",
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          if (handleUpdate) {
            this.$message({
              message: "Đăng ký nhận SMS thất bại",
              type: "error",
            });
          } else {
            this.$message({
              message: "Hủy Đăng ký nhận SMS thất bại",
              type: "error",
            });
          }
        });
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
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      SchoolMasterService.searchStudentMaster(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.status,
        this.dataSearch.nameOrPhone
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

    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa học sinh đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        StudentService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa học sinh thành công",
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa học sinh thất bại",
              type: "error",
            });
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
/deep/.el-pagination .el-select .el-input {
  width: 75px;
}

/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
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
    width: 110px;
  }
  .button-left-class {
    margin-right: 5px;
    width: 140px;
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
