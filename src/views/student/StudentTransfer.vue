<template>
  <div class="content">
    <div style="margin-top: 5px; margin-bottom: 20px;">
      <div class="button-click-left">
        <el-select
          class="button-left-status"
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

        <!-- chọn khối -->
        <el-select
          v-if="this.getAppTypeUserLogin == 'plus'"
          class="button-left-class"
          clearable
          v-model="dataSearch.idGrade"
          @change="changeGradeMethod()"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>

        <!-- chọn lớp -->
        <el-select
          class="button-left-class"
          filterable
          :clearable="this.getAppTypeUserLogin == 'plus'"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>

        <!-- nhập ô tìm kiếm -->
        <el-input
          class="button-left-class"
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
      <div class="button-click">
        <el-button
          v-if="checkPermission(['kids_transfer_update'])"
          class="button-over"
          type="danger"
          @click="handleDeleteMany()"
        >
          <i class="el-icon-delete" />
          Xóa hàng loạt
        </el-button>
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
        <el-table-column
          fixed
          align="center"
          label="Mã HS"
          prop="kidCode"
          width="100"
        ></el-table-column>
        <el-table-column min-width="170" fixed label="Họ tên">
          <template slot-scope="scope">
            <el-button
              class="click-in-row"
              type="text"
              @click="clickFullName(scope.$index, scope.row)"
              >{{ scope.row.fullName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="maClass.className"
          min-width="130"
          label="Lớp"
        ></el-table-column>
        <!-- <el-table-column align="center" min-width="130" label="Ngày nhập học">
          <template slot-scope="scope">
            <span>{{ scope.row.dateStart | formatDate }}</span>
          </template>
        </el-table-column> -->

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
        <el-table-column
          align="center"
          min-width="150"
          label="Số người đưa đón"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.count > 0">{{
              scope.row.count
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="checkPermission(['kids_transfer_update'])"
          fixed="right"
          label="Tác vụ"
          width=" 260"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="dialogTransferOneMethod(scope.row)"
              >Thêm</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="dialogTransferListOneMethod(scope.row)"
              >Danh sách</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOne(scope.row)"
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
    <CreateStudent
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateStudent"
    />
    <UpdateStudent
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateStudent"
    />
    <ChangeClassStudent
      :dialogVisible="showChangeClassDialog"
      @dialog-close="diglogCloseChangeClassMethod()"
      ref="ChangeClassStudent"
    />
    <CreateStudentNotify
      v-bind:dataKidNotifyList="dataKidNotifyList"
      :dialogVisibleEx="showCreateNotifyDialog"
      @dialog-close="dialogCloseCreateNotifyMethod()"
      ref="CreateStudentNotify"
    />
    <CreateStudentNotifySms
      v-bind:dataKidNotifySmsList="dataKidNotifySmsList"
      :dialogVisibleSms="showCreateNotifySmsDialog"
      @dialog-close="dialogCloseCreateNotifySmsMethod()"
      ref="CreateStudentNotifySms"
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
    <CreateStudentExcel
      :gradeList="gradeList"
      :dialogVisibleExStudent="showCreateStudentExcelDialog"
      @dialog-close="dialogCloseCreateStudentExcelMethod()"
      ref="CreateStudentExcel"
    />
    <KidsUpdateStatusDialog
      :dialogVisible="showUpdateKidsStatus"
      @dialog-close="closeUpdateKidsStatus()"
      ref="KidsUpdateStatusDialog"
    />
    <CreateSmsDialog
      :dialogVisible="showCreateSms"
      @dialog-close="closeCreateSmsMethod()"
      ref="CreateSmsDialog"
    />
    <CreateGroupOutDialog
      :listKids="multipleSelection"
      :dialogVisible="showCreateGroupOutDialog"
      @dialog-close="closeCreateGroupOutDialog()"
      ref="CreateGroupOutDialog"
    />
    <KidsSearchExtendDialog
      :listKids="multipleSelection"
      :dialogVisible="showSearchExtend"
      @dialog-close="closeSearchExtend"
      ref="KidsSearchExtendDialog"
    />
    <ExportMedicineDialog
      :dialogVisible="showExportMedicineDialog"
      @dialog-close="closeExportMedicineDialog"
      ref="ExportMedicineDialog"
    />

    <!-- code mới -->
    <StudentTransferDialog
      :dialogVisible="showDialogTransfer"
      @dialog-close="closeDialogTransfer"
      ref="StudentTransferDialog"
    />
    <StudentTransferListDialog
      :dialogVisible="showDialogTransferList"
      @dialog-close="closeDialogTransferList"
      ref="StudentTransferListDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import StudentService from "@/services/StudentService";
import TeacherService from "@/services/TeacherService";
// import CommonOnekidsService from "@/services/CommonOnekidsService";
// import http from "../../http-download";
import CreateStudent from "./CreateStudent.vue";
import UpdateStudent from "./UpdateStudent.vue";
import CreateGroupOutDialog from "./CreateGroupOutDialog.vue";
import ChangeClassStudent from "./ChangeClassStudent.vue";
import CreateStudentNotify from "./CreateStudentNotify.vue";
import CreateStudentNotifySms from "./CreateStudentNotifySms.vue";
import AccountHandle from "@/views/common/AccountHandle.vue";
import ChangePhoneSMS from "@/views/common/ChangePhoneSMS.vue";
import CreateStudentExcel from "./CreateStudentExcel.vue";
import KidsUpdateStatusDialog from "./KidsUpdateStatusDialog.vue";
import CreateSmsDialog from "../common/CreateSmsDialog.vue";
import KidsSearchExtendDialog from "./KidsSearchExtendDialog.vue";
import ExportMedicineDialog from "./ExportMedicineDialog.vue";
import StudentTransferDialog from "./StudentTransferDialog.vue";
import StudentTransferListDialog from "./StudentTransferListDialog.vue";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  components: {
    CreateStudent,
    UpdateStudent,
    CreateGroupOutDialog,
    ChangeClassStudent,
    CreateStudentNotify,
    CreateStudentNotifySms,
    AccountHandle,
    ChangePhoneSMS,
    CreateStudentExcel,
    KidsUpdateStatusDialog,
    CreateSmsDialog,
    KidsSearchExtendDialog,
    ExportMedicineDialog,
    StudentTransferDialog,
    StudentTransferListDialog,
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
      deleteStatusButton: false,
      showUpdateDialog: false,
      showCreateDialog: false,
      showAccountHandeDialog: false,
      showChangePhoneSMSDialog: false,
      showChangeClassDialog: false,
      showCreateNotifySmsDialog: false,
      showCreateNotifyDialog: false,
      showCreateStudentExcelDialog: false,
      showUpdateKidsStatus: false,
      showCreateGroupOutDialog: false,
      loadingButton: false,
      fullscreenLoading: false,
      showCreateSms: false,
      showSearchExtend: false,
      showExportMedicineDialog: false,
      showDialogTransfer: false,
      showDialogTransferList: false,
      loading: "",
      updateGrade: {
        id: "",
        gradeName: "",
        gradeDescription: "",
      },
      dataSearch: {
        status: "STUDYING",
        idGrade: "",
        idClass: "",
        nameOrPhone: "",
        type: "startDate",
        dateList: [],
      },
      classList: [],
      gradeList: [],
      classOfGradeList: [],
      classOfGradeFilterList: [],
      loginStatusList: [
        { key: "loginYet", value: "Chưa từng đăng nhập" },
        { key: "loginNo", value: "Không đăng nhập" },
        { key: "loginYes", value: "Đã đăng nhập" },
      ],
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
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
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
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      if (row.username == "Chưa có") {
        return "color: #409EFF";
      } else if (row.username == "Xử lý") {
        return "color: red";
      }
    },
    // select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // click create student
    createStudentDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateStudent.getAllGrade();
      this.$refs.CreateStudent.tabParentIconMethod();
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
    changePhoneSMSDialogMethod(row) {
      let objectData = {
        id: row.id,
        appType: "parent",
        oldPhone: row.phone,
      };
      this.showChangePhoneSMSDialog = true;
      this.$refs.ChangePhoneSMS.getChangePhoneSMSInitial(objectData);
    },
    updateKidsStatusMethod(row) {
      this.showUpdateKidsStatus = true;
      this.$refs.KidsUpdateStatusDialog.getKidsStatusDataInitial(
        row.id,
        row.fullName
      );
    },
    createSmsMethod() {
      this.showCreateSms = true;
      let idList = this.multipleSelection.map((x) => x.id);
      this.$refs.CreateSmsDialog.getDataCreateSmsInitial(
        idList,
        "kid",
        "student"
      );
    },
    searchExtendDialog() {
      this.showSearchExtend = true;
      this.$refs.KidsSearchExtendDialog.getSearchExtendInitial(
        this.dataSearch.type,
        this.dataSearch.dateList
      );
    },

    dialogCloseCreateMethod() {
      this.searchByProperties();
      this.showCreateDialog = false;
    },
    closeSearchExtend(data) {
      if (typeof data == "object") {
        this.dataSearch.type = data.type;
        this.dataSearch.dateList = data.dateList;
        this.searchByProperties();
      }
      this.showSearchExtend = false;
    },
    closeExportMedicineDialog() {
      this.showExportMedicineDialog = false;
    },
    closeDialogTransfer() {
      this.showDialogTransfer = false;
      this.searchByProperties();
    },
    closeDialogTransferList() {
      this.showDialogTransferList = false;
      this.searchByProperties();
    },
    dialogCloseAccountHandleMethod() {
      this.showAccountHandeDialog = false;
      this.searchByProperties();
    },
    dialogCloseChangePhoneSMSMethod() {
      this.showChangePhoneSMSDialog = false;
      this.searchByProperties();
    },
    dialogCloseCreateNotifyMethod() {
      this.showCreateNotifyDialog = false;
      this.dataKidNotifyList = [];
    },
    dialogCloseCreateNotifySmsMethod() {
      this.showCreateNotifySmsDialog = false;
      this.dataKidNotifySmsList = [];
      this.dataKidNotifySmsList.listId = [];
      this.dataKidNotifySmsList.listNoActive = [];
    },
    dialogCloseCreateStudentExcelMethod() {
      this.showCreateStudentExcelDialog = false;
      this.searchByProperties();
    },
    closeUpdateKidsStatus() {
      this.showUpdateKidsStatus = false;
      this.searchByProperties();
    },
    closeCreateSmsMethod() {
      this.showCreateSms = false;
    },
    closeCreateGroupOutDialog() {
      this.searchByProperties();
      this.showCreateGroupOutDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },
    diglogCloseChangeClassMethod() {
      this.searchByProperties();
      this.showChangeClassDialog = false;
    },
    //click edit at row
    handleEdit(index, row) {
      this.$refs.UpdateStudent.clickNameInitial("noFullName");
      this.$refs.UpdateStudent.getDataInitial(row.id);
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
    },
    clickFullName(index, row) {
      this.$refs.UpdateStudent.clickNameInitial("fullName");
      this.$refs.UpdateStudent.getDataInitial(row.id);
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
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
    handleCommandAction(command) {
      if (command == "excelImport") {
        this.importExcel();
      } else {
        let kidList = this.multipleSelection;
        this.checkSelectRowList(kidList);
        if (command == "changeClass") {
          this.actionChangeClassMethod(kidList);
        } else if (command == "sMSregisterReceive") {
          this.actionActiveSMSMethod(kidList);
        } else if (command == "sMScancelReceive") {
          this.actionCancelctiveSMSMethod(kidList);
        } else if (command == "appActive") {
          this.actionActiveMethod(kidList);
        } else if (command == "appCancelActive") {
          this.actionCancelctiveMethod(kidList);
        } else if (command == "studentsDelete") {
          this.deleteManyStudent(kidList);
        } else if (command == "excelExport") {
          this.exportExcel();
        } else if (command == "excelMessageParent") {
          this.exportExcelMessageParentMethod();
        } else if (command == "excelMedicine") {
          this.exportMedicineDialogMethod();
        } else if (command == "excelAbsentLetter") {
          this.exportExcelAbsentLetterMethod();
        } else if (command == "excelSMS") {
          this.exportExcelSMSMethod();
        } else if (command == "groupOut") {
          this.handelGroupOut();
        }
      }
    },
    handleDeleteOne(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ người đưa đón không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let idKidList = [];
        idKidList.push(row.id);
        StudentService.kidsTransferDeleteByIdKidList(idKidList)
          .then((response) => {
            this.$message({
              message: response.data.message,
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
    handleDeleteMany() {
      let idKidList = this.multipleSelection.map(x=>x.id);
      this.checkBeforeSelect(idKidList);
      this.$confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ người đưa đón cho các học sinh đã chọn không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        StudentService.kidsTransferDeleteByIdKidList(idKidList)
          .then((response) => {
            this.$message({
              message: response.data.message,
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
    checkBeforeSelect(list) {
      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    handleSendNotify(command) {
      let kidList = this.multipleSelection;
      this.checkSelectRowList(kidList);
      if (command == "createNotifyApp") {
        this.createNotifyDialog(kidList);
      } else if (command == "createNotifySms") {
        // this.createNotifySmsDialog(kidList);
        this.createSmsMethod();
      } else if (command == "sendAccount") {
        this.sendAccountMethod();
      }
    },
    //export lời nhắn
    exportExcelMessageParentMethod() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.getStyleExcel();
      StudentService.exportExcelMessageParent(selectRowList)
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "DANH_SACH_LOI_NHAN";
              const tHeader = [
                "STT",
                "Thời gian gửi",
                "Nội dung",
                "Số file",
                "Trạng thái",
                "Giáo viên phản hồi",
                "Nhà trường phản hồi",
              ];
              const filterVal = [
                "pro1",
                "pro2",
                "pro3",
                "pro4",
                "pro5",
                "pro6",
                "pro7",
              ];
              let columnList = [
                { col: 5 },
                { col: 17 },
                { col: 55 },
                { col: 6 },
                { col: 14 },
                { col: 25 },
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
    exportMedicineDialogMethod() {
      this.showExportMedicineDialog = true;
    },
    dialogTransferOneMethod(row) {
      this.$refs.StudentTransferDialog.initialDataCreate(
        row.id,
        row.fullName,
        row.maClass.className
      );
      this.showDialogTransfer = true;
    },
    dialogTransferListOneMethod(row) {
      this.$refs.StudentTransferListDialog.initialData(
        row.id,
        row.fullName,
        row.maClass.className,
        row.kidsTransferList
      );
      this.showDialogTransferList = true;
    },
    //Xuất file excel Dặn thuốc
    exportExcelMedicineMethod() {
      this.getStyleExcel();
      let selectRowList = this.multipleSelection.map((x) => x.id);
      StudentService.exportExcelMedicine(selectRowList).then((resp) => {
        import("@/services/ExportExcel")
          .then((excel) => {
            let dataList = resp.data.data;
            let fileName = "DANH_SACH_DAN_THUOC";
            const tHeader = [
              "STT",
              "Thời gian gửi",
              "Nội dung",
              "Ngày uống",
              "Số file",
              "Trạng thái",
              "Giáo viên phản hồi",
              "Nhà trường phản hồi",
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
            ];
            let columnList = [
              { col: 5 },
              { col: 17 },
              { col: 45 },
              { col: 22 },
              { col: 6 },
              { col: 14 },
              { col: 23 },
              { col: 23 },
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
            setTimeout(() => {
              this.closeExportMedicineDialog();
            }, 1000);
          });
      });
    },
    //Xuất file excel Dặn  theo ngày
    exportExcelMedicineDateMethod() {
      let dateSelect = this.$refs.ExportMedicineDialog.dateSelect;
      let idClass = this.dataSearch.idClass;
      if (idClass == "") {
        this.$message({
          message: "Chưa có lớp nào được chọn",
          type: "error",
        });
        throw null;
      }
      this.getStyleExcelDate();
      let selectRowList = this.multipleSelection.map((x) => x.id);
      let className = this.classList.filter((x) => x.id == idClass)[0]
        .className;
      let dateFormat = this.moment(dateSelect).format("DD.MM.YYYY");
      StudentService.exportExcelMedicineDate(
        selectRowList,
        dateSelect,
        this.dataSearch.idClass
      ).then((resp) => {
        import("@/services/ExportExcel")
          .then((excel) => {
            let dataList = resp.data.data;
            let fileName = "DANTHUOC-" + className + "-" + dateFormat;
            const tHeader = [
              "STT",
              "Họ và tên",
              "Thời gian gửi",
              "Nội dung",
              "Ngày uống",
              "Số file",
              "Trạng thái",
              "Giáo viên phản hồi",
              "Nhà trường phản hồi",
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
              { col: 20 },
              { col: 17 },
              { col: 45 },
              { col: 22 },
              { col: 6 },
              { col: 14 },
              { col: 23 },
              { col: 23 },
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
            setTimeout(() => {
              this.closeExportMedicineDialog();
            }, 1000);
          });
      });
    },
    //Xuất file excel Xin nghỉ
    exportExcelAbsentLetterMethod() {
      this.getStyleExcel();
      let selectRowList = this.multipleSelection.map((x) => x.id);
      StudentService.exportExcelAbsentLetter(selectRowList).then((resp) => {
        import("@/services/ExportExcel")
          .then((excel) => {
            let dataList = resp.data.data;
            let fileName = "DANH_SACH_XIN_NGHI";
            const tHeader = [
              "STT",
              "Thời gian gửi",
              "Nội dung",
              "Thời gian nghỉ",
              "Số file",
              "Trạng thái",
              "Giáo viên phản hồi",
              "Nhà trường phản hồi",
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
            ];
            let columnList = [
              { col: 5 },
              { col: 17 },
              { col: 45 },
              { col: 22 },
              { col: 6 },
              { col: 14 },
              { col: 23 },
              { col: 23 },
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
      });
    },

    //Xuất file excel SMS
    exportExcelSMSMethod() {
      this.getStyleExcelSms();
      let selectRowList = this.multipleSelection.map((x) => x.id);
      StudentService.exportExcelSMS(selectRowList).then((resp) => {
        import("@/services/ExportExcel")
          .then((excel) => {
            let dataList = resp.data.data;
            let fileName = "DANH_SACH_HOC_SINH_GUI_SMS";
            const tHeader = ["STT", "Mã HS", "Tên học sinh", "Lớp", "Nội dung"];
            const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
            let columnList = [
              { col: 5 },
              { col: 15 },
              { col: 25 },
              { col: 15 },
              { col: 50 },
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
      });
    },
    //Css Excel dặn thuốc, xin nghỉ,...
    getStyleExcel() {
      let style = {
        font: { bold: true },
        fill: { fgColor: { rgb: "67C23A" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
      let styleCol1 = {
        name: ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3"],
        style,
      };
      let styleCol2 = {
        name: ["A1", "A2"],
        style: { font: { bold: true, color: { rgb: "ff0000" } } },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
    },
    getStyleExcelDate() {
      let style = {
        font: { bold: true },
        fill: { fgColor: { rgb: "67C23A" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
      let styleCol1 = {
        name: ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4"],
        style,
      };
      let styleCol2 = {
        name: ["A1", "A2", "A3"],
        style: { font: { bold: true, color: { rgb: "ff0000" } } },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
    },
    //Css Excel sms
    getStyleExcelSms() {
      let style = {
        font: { bold: true },
        fill: { fgColor: { rgb: "67C23A" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
      let styleCol2 = {
        name: "A1:E1",
        style,
      };
      this.styleCols2.push(styleCol2);
    },
    exportExcel() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn xuất file học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.getStyleExcelStudent();
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        let selectRowList = this.multipleSelection.map((x) => x.id);
        StudentService.exportExcelStudentNew(selectRowList)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_HOC_SINH_${myDate}`;
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
                  "Địa chỉ hiện tại",
                  "Địa chỉ thường trú",
                  "Dân tộc",
                  "Số định danh",
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
                  "pro28",
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
              });
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
    //Style css Excel Student
    getStyleExcelStudent() {
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
        name: "V5:AB5",
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
    importExcel() {
      this.showCreateStudentExcelDialog = true;
      this.$refs.CreateStudentExcel.getDataImportExcelInitial();
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
    actionChangeClassMethod(data) {
      this.showChangeClassDialog = true;
      this.$refs.ChangeClassStudent.getClassDataInitial(data);
    },
    /**
     * xóa nhiều học sinh
     */
    deleteManyStudent(data) {
      this.$confirm(
        "Thao tác này sẽ xóa toàn bộ thông tin của học sinh bao gồm cả thông tin tài chính. Bạn có chắc chắn muốn xóa các học sinh đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        StudentService.deleteManyKids(data)
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
      let handleUpdate = (this.dataOneActiveSMS.checkOneActiveSMS =
        row.smsReceive);
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

    // gửi tài khoản đăng nhập cho phụ huynh học sinh
    sendAccountMethod() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
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
        "Bạn có chắc chắn muốn gửi tài khoản cho học sinh đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
          loadingButton: true,
        }
      ).then(() => {
        this.openFullScreen2();
        StudentService.sendAccountStudent(list)
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
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButton = false;
            }, 500);
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
    openFullScreen() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 4000);
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
      StudentService.searchKidsTransfer(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.status,
        this.dataSearch.idGrade,
        this.dataSearch.idClass,
        this.dataSearch.nameOrPhone
      )
        .then((resp) => {
          if (this.getAppTypeUserLogin == "teacher") {
            this.studentList =
              this.dataSearch.idClass != "" ? resp.data.data : [];
          } else {
            this.studentList = resp.data.data;
          }
          this.pageTotal = resp.data.total;
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
    /**
     * Chuyển đồi học sinh ra trường
     */
    handelGroupOut() {
      this.showCreateGroupOutDialog = true;
    },
    /**
     * clear grade
     */
    clearGrade() {
      this.changeGrade();
    },
    /**
     * chang grade
     */
    changeGrade() {
      this.dataSearch.idClass = "";
    },
    /**
     * lấy config nút xóa
     */
    // async getSchoolConfigAddMethod() {
    //   await CommonOnekidsService.getSchoolConfigAdd()
    //     .then((resp) => {
    //       this.deleteStatusButton = resp.data.data.deleteStatus;
    //     })
    //     .catch((err) => {
    //       throw err;
    //     });
    // },

    /**
     * thay đổi khối
     */
    changeGradeMethod() {
      this.dataSearch.idClass = "";
      this.getClassOfGrade();
      this.searchHeaderMethod();
    },
    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeList.length > 0) {
            this.dataSearch.idGrade = this.gradeList[0].id;
          }

    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassOfGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.classList = resp.data.data;
          this.dataSearch.idClass = this.classList.filter(
            (x) => x.checked
          )[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()])
          .then(() => {
            this.getClassOfGrade();
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.getAppTypeUserLogin == "teacher") {
        this.getClassListTeacher().then(() => {
          this.searchByProperties();
        });
      }
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
    width: 130px;
  }
  .button-left-class {
    margin-right: 5px;
    width: 170px;
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
