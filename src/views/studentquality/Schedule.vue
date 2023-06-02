<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- Tìm kiếm xem -->
      <div v-if="radio == 1" class="button-click-left">
        <el-date-picker
          v-model="timeSchedule"
          type="week"
          value-format="yyyy-MM-dd"
          format="Tuần WW(từ dd-MM-yyyy)"
          placeholder="Chọn tuần"
          :clearable="false"
          @change="
            searchByProperties(
              timeSchedule,
              dataSearch.idGrade,
              dataSearch.idClass
            )
          "
        ></el-date-picker>
        <!-- <el-button slot="append" icon="el-icon-search" @click="searchByProperties(timeSchedule)"></el-button> -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="button-left"
          v-model="dataSearch.idGrade"
          @change="changeGrade()"
          placeholder="Chọn khối"
          style="margin-left: 5px"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          v-model="dataSearch.idClass"
          @change="
            searchByProperties(
              timeSchedule,
              dataSearch.idGrade,
              dataSearch.idClass
            )
          "
          placeholder="Chọn lớp"
          :clearable="getAppTypeUserLogin == 'plus'"
          style="margin-left: 5px"
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <!-- Tìm kiếm chi tiết -->
      <div v-if="radio == 2" class="button-click-left">
        <el-date-picker
          v-model="timeSchedule"
          type="week"
          value-format="yyyy-MM-dd"
          format="Tuần WW(từ dd-MM-yyyy)"
          placeholder="Chọn tuần"
          :clearable="false"
          @change="getAllScheduleDetail(timeSchedule)"
        ></el-date-picker>
        <!-- <el-button slot="append" icon="el-icon-search" @click="searchByProperties(timeSchedule)"></el-button> -->
        <el-select
          v-if="getAppTypeUserLogin == 'plus'"
          class="button-left"
          v-model="dataSearch.idGrade"
          @change="changeGradeDetail(timeSchedule)"
          placeholder="Chọn khối"
          style="margin-left: 5px; margin-right: 5px"
        >
          <el-option
            v-for="item in gradeOfSchoolList"
            :key="item.id"
            :label="item.gradeName"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          style="margin-left: 5px"
          v-model="dataSearch.idClass"
          @change="getAllScheduleDetail(timeSchedule)"
          placeholder="Chọn lớp"
          clearable
        >
          <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <el-radio
        style="margin-left: 50px"
        @change="handleRadio()"
        v-model="radio"
        label="1"
        >Xem</el-radio
      >
      <el-radio v-model="radio" @change="handleRadio()" label="2"
        >Chi tiết</el-radio
      >

      <div class="button-click row-data">
        <el-dropdown
          v-if="checkPermission(['studentQuality_schedule_update'])"
          @command="handleCommandAdd"
        >
          <el-button class="button-over" type="success">
            <i class="el-icon-plus" />
            Thêm mới
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu class="el-dropdown-menu-container">
            <el-dropdown-item command="createSchedule"
              >Nhập thời khóa biểu</el-dropdown-item
            >
            <el-dropdown-item command="createScheduleFile"
              >Thêm dạng File,Ảnh</el-dropdown-item
            >
            <el-dropdown-item command="createScheduleExcel"
              >Thời khóa biểu từ Excel</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button class="button-over" type="success" @click="createEmployeeDialog()">
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>-->
        <el-dropdown @command="handleCommandAction">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>

          <el-dropdown-menu class="el-dropdown-menu-container">
            <span v-if="checkPermission(['studentQuality_schedule_update'])">
              <el-dropdown-item command="activeAccount"
                >Duyệt thời khóa biểu</el-dropdown-item
              >
              <el-dropdown-item command="unactiveAccount"
                >Hủy duyệt TKB</el-dropdown-item
              >
              <el-dropdown-item command="deleteContentSchedule"
                >Xóa nội dung TKB</el-dropdown-item
              >
            </span>
            <el-dropdown-item command="exportExcel"
              >Xuất File Excel</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- Màn hình xem -->
    <div
      v-show="radio == 1"
      class="table-content row-data"
      v-for="item in tableDataFilter"
      :key="item.id"
    >
      <h3 style="color: blue; margin-top: 50px">
        THỜI KHÓA BIỂU: {{ item.className }}
      </h3>
      <h3
        style="color: blue; margin-top: 10px"
        v-if="item.scheduleDayResponeList != null"
      >
        CHỦ ĐỀ:<el-button
          style="color: blue; margin-left: 10px; padding: 0px"
          type="text"
          @click="changeTitleMethod(item)"
          v-if="item.scheduleTitle != null"
        >
          <h4 style="margin: 0px; display: inline-block; margin-right: 5px">
            {{ item.scheduleTitle }}
          </h4>
          <i
            class="el-icon-edit"
            style="font-size: 15px; float: right; color: black"
          ></i
        ></el-button>
        <span
          v-if="item.scheduleTitle == null"
          @click="changeTitleMethod(item)"
        >
          Thêm chủ đề
        </span>
      </h3>
      <el-dialog
        title="CẬP NHẬT CHỦ ĐỀ"
        :visible.sync="dialogVisibleTitle"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-input type="text" v-model="scheduleTitle"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTitle = false">Đóng</el-button>
          <el-button type="primary" @click="submitTitle()">Lưu</el-button>
        </span>
      </el-dialog>
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="item.scheduleDayResponeList"
        border
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
      >
        <el-table-column prop="sessionDay" label="Buổi" align></el-table-column>
        <el-table-column prop="monday" label="Thứ 2" align>
          <template slot-scope="scope">
            <div class="dayContent">{{ scope.row.monday }}</div>
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 2)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tuesday" label="Thứ 3" align="center">
          <template slot-scope="scope">
            <div class="dayContent">{{ scope.row.tuesday }}</div>
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 3)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="wednesday" label="Thứ 4" align="center">
          <template slot-scope="scope">
            <div class="dayContent">{{ scope.row.wednesday }}</div>
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 4)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="thursday" label="Thứ 5" align="center">
          <template slot-scope="scope">
            {{ scope.row.thursday }}
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 5)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="friday" label="Thứ 6" align="center">
          <template slot-scope="scope">
            {{ scope.row.friday }}
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 6)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            item.morningSaturday ||
            item.afternoonSaturday ||
            item.eveningSaturday
          "
          prop="saturday"
          label="Thứ 7"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.saturday }}
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 7)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="item.sunday"
          prop="sunday"
          label="CN"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.sunday }}
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEdit(scope.$index, scope.row, 8)"
            >
              <div>
                <h4 class="edit" style="color: re00a1ffd">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Màn hình chi tiết -->
    <div v-if="radio == 2" class="table-content row-data">
      <el-table
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        @selection-change="handleSelectionChange"
        :data="tabListScheduleDetail"
        border
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="gradeName"
          label="Tên khối học"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="className"
          label="Tên lớp"
          align="center"
        ></el-table-column>
        <el-table-column prop="approve" align="center" label="Duyệt" width="70">
          <template slot-scope="scope">
            <el-checkbox
              v-if="
                scope.row.listCheckContentDay !== null ||
                scope.row.fileList != null
              "
              v-model="scope.row.approve"
              @change="handleCheckBoxApprove(scope.$index, scope.row)"
            ></el-checkbox>
            <el-checkbox v-else disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="listCheckContentDay"
          label="Các ngày có nội dung"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.listCheckContentDay }}
            <el-button
              size="mini"
              class="clickCellSchedule"
              @click="handleEditDetailClass(scope.$index, scope.row, 2)"
            >
              <div>
                <h4 class="edit" style="color: 00a1ff">
                  <i style="font-size: 18px" class="el-icon-edit"></i>
                </h4>
              </div>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="listFileOrPicture"
          label="TKB dạng File,Ảnh"
          align="center"
        >
          <template slot-scope="scope" v-bind="scope.row.fileList">
            <el-upload
              class="upload-demo"
              ref="upload"
              action
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :before-upload="handleBeforeUpload"
              multiple
              :auto-upload="false"
              :on-change="handleChangeFile"
              :limit="5"
              :on-exceed="handleExceed"
              :on-preview="handleFileRequest"
              :file-list="scope.row.fileList == null ? [] : scope.row.fileList"
            >
              <el-button
                v-if="checkPermission(['studentQuality_schedule_update'])"
                @click="getIndexRow(scope.$index)"
                size="mini"
                type="primary"
                >Nhập file</el-button
              >
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" align="center" width="110">
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission(['studentQuality_schedule_update'])"
              style="margin-bottom: 20px; width: 95px"
              size="mini"
              type="primary"
              :disabled="checkSave"
              @click="handleChangeFileSchedule()"
              >Lưu File</el-button
            >
            <el-button
              style="margin-left: 0"
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Xem chi tiết</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <UpdateSchedule
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateSchedule"
    />
    <CreateSchedule
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateSchedule"
    />
    <CreateScheduleExcel
      :dialogVisibleEx="showCreateExcelDialog"
      @dialog-close="dialogCloseCreateExcelMethod()"
      ref="CreateScheduleExcel"
    />
    <CreateClassScheduleFile
      :dialogVisibleFile="showCreateFileDialog"
      @dialog-close="dialogCloseCreateFileMethod()"
      ref="CreateClassScheduleFile"
    />
    <SchdeduleDetail
      :dialogVisible="showViewDetailDialog"
      @dialog-close="dialogCloseViewDetailMethod()"
      ref="ScheduleDetail"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ScheduleService from "../../services/ScheduleService";
import MaClassService from "../../services/MaClassService";
import GradeService from "../../services/GradeService";
import TeacherService from "@/services/TeacherService";
import UpdateSchedule from "./UpdateSchedule.vue";
import CreateSchedule from "./CreateSchedule.vue";
import CreateScheduleExcel from "./CreateScheduleExcel.vue";
import CreateClassScheduleFile from "./CreateClassScheduleFile.vue";
import SchdeduleDetail from "./ScheduleDetail.vue";
import moment from "moment";
import http from "../../http-download";
import {mapActions, mapState} from "vuex";

export default {
  components: {
    UpdateSchedule,
    CreateSchedule,
    SchdeduleDetail,
    CreateScheduleExcel,
    CreateClassScheduleFile,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      currentPageNumber: 1,
      timeSchedule: "",
      dateTitle: "",
      scheduleTitle: "",
      dialogVisibleTitle: false,
      radio: "1",
      multipleSelection: [],
      multipartFileList: [],
      indexRow: 0,
      loadingButton: false,
      checkSave: false,
      // offset : this.currentPageNumber*this.pageSize-this.pageSize,
      pageList: [10, 20, 30, 40, 50, 10000],
      tableDataFilter: [],
      listFileAndPicture: [],
      tabListScheduleDetail: [],

      showUpdateDialog: false,
      showCreateDialog: false,
      showCreateExcelDialog: false,
      showCreateFileDialog: false,
      showViewDetailDialog: false,
      dataSearch: {
        idGrade: "",
        idClass: "",
      },
      classOfGradeList: [],
      gradeOfSchoolList: [],
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
    handleRemove(file) {
      let a = file;
      console.log(a);
      ScheduleService.deleteScheduleFile(file.idUrlScheduleFile)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa file thời khóa biểu thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Xóa file thời khóa biểu thất bại",
            type: "error",
          });
        });
    },
    handleBeforeUpload() {
      this.$refs.upload.clearFiles();
    },
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlScheduleFile = file.idUrlScheduleFile;
      this.downloadItem(label, extensionFile, idUrlScheduleFile);
    },
    downloadItem(label, extensionFile, idUrlScheduleFile) {
      http
        .get(`/schedules/download2/${idUrlScheduleFile}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label);
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
    },
    handleChangeFile(file, fileList) {
      this.multipartFileList = fileList;
    },
    handleChangeFileSchedule() {
      // this.loadingButton = true;
      this.checkSave = true;
      let formData = new FormData();

      let idClass = this.tabListScheduleDetail[this.indexRow].idClass;
      let approved = this.tabListScheduleDetail[this.indexRow].approve;
      console.log("hi" + approved);
      if (this.multipartFileList.length > 0) {
        this.multipartFileList.forEach((element) => {
          formData.append("multipartFileList", element.raw);
        });
      }
      formData.append("fromFileTsime", this.timeSchedule);
      formData.append("Approved", approved);
      formData.append("idClass", idClass);
      ScheduleService.createFileAndPicture(formData)
        .then((res) => {
          if (res.data) {
            this.$message({
              message: "Tải lên file thời khóa biểu thành công",
              type: "success",
            });
            this.getAllScheduleDetail(this.timeSchedule);
            this.multipartFileList = [];
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Tải lên file thời khóa biểu thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.checkSave = false;
          }, 500);
        });
    },
    getIndexRow(index) {
      this.indexRow = index;
      this.$refs.upload.clearFiles();
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleEdit(index, row, timeDay) {
      this.$refs.UpdateSchedule.getScheduleInClassWeek(
        this.timeSchedule,
        row.idClass,
        timeDay,
        row.className
      );

      this.$refs.UpdateSchedule.getStatusWeekend(
        row.morningSaturday,
        row.afternoonSaturday,
        row.eveningSaturday,
        row.sunday
      );
      this.showUpdateDialog = true;
    },
    handleEditDetailClass(index, row, timeDay) {
      this.$refs.UpdateSchedule.getScheduleInClassWeek(
        this.timeSchedule,
        row.idClass,
        timeDay
      );
      this.showUpdateDialog = true;
    },
    handleCheckBoxApprove(index, row) {
      console.log(row);
      console.log("hi");

      ScheduleService.updateApprove(row)
        .then((res) => {
          console.log(res);
          if (row.approve) {
            this.$message({
              message: "Duyệt thời khóa biểu thành công",
              type: "success",
            });
          } else {
            this.$message({
              message: "Hủy duyệt thời khóa biểu thành công",
              type: "success",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            message: "Duyệt thời khóa biểu thất bại",
            type: "error",
          });
        });
    },
    handleRadio() {
      let a = this.radio;
      if (a == 2) {
        this.getAllScheduleDetail(this.timeSchedule);
      } else if (a == 1) {
        this.searchByProperties(
          this.timeSchedule,
          this.dataSearch.idGrade,
          this.dataSearch.idClass
        );
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
      this.getAllScheduleDetail(this.timeSchedule);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    dialogCloseCreateExcelMethod() {
      this.showCreateExcelDialog = false;
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    dialogCloseCreateFileMethod() {
      this.showCreateFileDialog = false;
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
      this.getAllScheduleDetail(this.timeSchedule);
    },
    dialogCloseViewDetailMethod() {
      this.showViewDetailDialog = false;
      this.getAllScheduleDetail(this.timeSchedule);
      // this.searchByProperties(
      //   this.timeSchedule,
      //   this.dataSearch.idGrade,
      //   this.dataSearch.idClass
      // );
    },
    searchByProperties(timeSchedule, idGrade, idClass) {
      this.loadingData = true;
      ScheduleService.search(timeSchedule, idGrade, idClass)
        .then((response) => {
          // this.tableDataFilter = response.data.data;
          if (this.getAppTypeUserLogin == "teacher") {
            this.tableDataFilter = idClass != "" ? response.data.data : [];
          } else {
            this.tableDataFilter = response.data.data;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          if (this.tableDataFilter.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getCurrentDate() {
      let monday = (this.timeSchedule = moment(String(new Date()))
        .startOf("isoweek")
        .format("YYYY-MM-DD"));
      let tuesday = moment(String(new Date()))
        .startOf("isoweek")
        .add(1, "days")
        .format("YYYY-MM-DD");
      console.log(tuesday);
      console.log(monday);
    },
    handleCommandAdd(command) {
      if (command == "createSchedule") {
        this.showCreateDialog = true;
        this.$refs.CreateSchedule.getAllClass();
      }
      if (command == "createScheduleExcel") {
        this.showCreateExcelDialog = true;
        this.$refs.CreateScheduleExcel.getAllClass();
      }
      if (command == "createScheduleFile") {
        this.showCreateFileDialog = true;
        this.$refs.CreateClassScheduleFile.getAllClass();
      }
    },
    handleCommandAction(command) {
      if (command == "activeAccount") {
        this.updateMultiActivated(true);
      } else if (command == "unactiveAccount") {
        this.updateMultiActivated(false);
      } else if (command == "deleteContentSchedule") {
        this.deleteContentSchedule();
      } else if (command == "exportExcel") {
        this.exportExcelSchedule();
      }
    },
    handleExceed() {
      this.$message.warning("Bạn chỉ được chọn 5 files");
    },
    beforeRemove(file) {
      return this.$confirm(`Bạn có muốn xóa file ${file.name} ?`);
    },
    //Chi tiết
    getAllScheduleDetail(timeSchedule) {
      this.loadingData = true;
      ScheduleService.getAllScheduleDetail(
        timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      )
        .then((res) => {
          // this.tabListScheduleDetail = res.data.data;
          if (this.getAppTypeUserLogin == "teacher") {
            this.tabListScheduleDetail =
              this.dataSearch.idClass != "" ? res.data.data : [];
          } else {
            this.tabListScheduleDetail = res.data.data;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          if (this.tabListScheduleDetail.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeTitleMethod(item) {
      this.dateTitle = this.timeSchedule;
      this.scheduleTitle = item.scheduleTitle;
      this.idClassTitle = item.idClass;
      this.dialogVisibleTitle = true;
    },
    submitTitle() {
      let dataForTitle = {
        idClass: "",
        scheduleDate: "",
        scheduleTitle: "",
      };
      dataForTitle.idClass = this.idClassTitle;
      dataForTitle.scheduleDate = this.dateTitle;
      dataForTitle.scheduleTitle = this.scheduleTitle;

      ScheduleService.updateTitleClass(dataForTitle)
        .then((response) => {
          console.log(response.data.data);
          this.$message({
            message: "Cập nhật chủ đề thành công",
            type: "success",
          });
          setTimeout(() => {
            this.fetchDataMany();
            this.dialogVisibleTitle = false;
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Cập nhật chủ đề thất bại",
            type: "error",
          });
          console.log(err);
        });
    },
    handleClose() {
      this.dialogVisibleTitle = false;
    },
    updateMultiActivated(statusApprove) {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length == 0) {
        this.$message({
          message: "Không có nhân viên nào được chọn",
          type: "error",
        });
        return;
      } else {
        let e = this.multipleSelection.filter((element) => {
          return element.listCheckContentDay != null;
        });
        e.forEach((element) => {
          element.approve = statusApprove;
          let r = element;
          console.log(r);
        });
        console.log("e");
        console.log(e);
        console.log("e");
        ScheduleService.updateMultiApprove(e)
          .then((res) => {
            console.log(res.data.data);
            if (statusApprove == true) {
              this.$message({
                message: "Duyệt thời khóa biểu thành công",
                type: "success",
              });
            } else if (statusApprove == false) {
              this.$message({
                message: "Hủy duyệt thời khóa biểu thành công",
                type: "success",
              });
            }
            this.getAllScheduleDetail(this.timeSchedule);
          })
          .catch((err) => {
            console.log(err);
            if (statusApprove == true) {
              this.$message({
                message: "Duyệt thời khóa biểu thất bại",
                type: "error",
              });
            } else if (statusApprove == false) {
              this.$message({
                message: "Hủy duyệt thời khóa biểu thất bại",
                type: "error",
              });
            }
          });
      }
    },
    handleViewDetail(index, row) {
      this.$refs.ScheduleDetail.getTabScheduleViewDetail(row.idClass);
      this.$refs.ScheduleDetail.getClassName(row.className);
      this.showViewDetailDialog = true;
    },
    /**Xuất file excel */

    // exportExcelSchedule() {
    //   let id = this.dataSearch.idClass;
    //   let date = this.timeSchedule;
    //   if (id == "" || id == undefined) {
    //     this.$message({
    //       message: "Chưa chọn lớp",
    //       type: "error",
    //     });
    //     return;
    //   }
    //   this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
    //     distinguishCancelAndClose: true,
    //     closeOnClickModal: false,
    //     confirmButtonText: "Có",
    //     cancelButtonText: "Không",
    //   }).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(
    //         `/schedules/export-schedule-class?idClass=` +
    //           id +
    //           `&timeSchedule=` +
    //           date
    //       )
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //           "download",
    //           "QUAN_LY_TKB_HOC_SINH_" + myDate + ".xlsx"
    //         );
    //         document.body.appendChild(link);
    //         link.click();
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         this.$message({
    //           message: "Thất bại",
    //           type: "error",
    //         });
    //       });
    //   });
    // },
    exportExcelSchedule() {
      let id = this.dataSearch.idClass;
      let date = this.timeSchedule;
      if (id == "" || id == undefined) {
        this.$message({
          message: "Chưa chọn lớp",
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
        this.getStyleExcelTKB();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        ScheduleService.getExportExcelSchedule(id, date)
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `QUAN_LY_TKB_HOC_SINH_${myDate}`;
                const merges = ["A1:H1"];
                const tHeader = [
                  "Thời gian",
                  "Thứ hai/Monday",
                  "Thứ ba/Tuesday",
                  "Thứ tư/Wednesday",
                  "Thứ năm/Thursday",
                  "Thứ sáu/Friday",
                  "Thứ bảy/Sat",
                  "Chủ nhật/Sun",
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
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                  { col: 20 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
                  data: dataList,
                  title: filterVal,
                  filename: fileName,
                  checkCustom: "tkb",
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
    //Style css Excel TKB
    getStyleExcelTKB() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();

      let style1 = {
        name: "A6:H6",
        style: {
          fill: { fgColor: { rgb: "ffff00" } },
          font,
          alignment,
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
          alignment: { horizontal: "center", vertical: "center" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3", "A4", "A5"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };
      let styleCol03 = {
        name: ["A6"],
        style: {
          fill: { fgColor: { rgb: "ffff00" } },
          font: { color: { rgb: "ff0000" }, bold: true, sz: "11" },
          alignment,
          border,
        },
      };
      this.styleCols2.push(style1);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
      //css cuối
      this.styleCols1.push(styleCol03);
    },
    deleteContentSchedule() {
      let e = this.multipleSelection.filter((element) => {
        return element.listCheckContentDay != null;
      });
      ScheduleService.deleteContentSchedule(e)
        .then((res) => {
          console.log(res.data.data);
          this.$message({
            message: "Xóa nội dung thời khóa biểu thành công",
            type: "success",
          });
          this.getAllScheduleDetail(this.timeSchedule);
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            message: "Xóa nội dung thời khóa biểu thất bại",
            type: "error",
          });
        });
    },
    /**
     * đối khối cho tab detail
     */
    async changeGrade() {
      await this.getClassInGrade();
      this.dataSearch.idClass = "";
      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
    },
    async changeGradeDetail(timeSchedule) {
      await this.getClassInGrade();
      this.dataSearch.idClass = "";
      this.getAllScheduleDetail(timeSchedule);
    },
    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeOfSchoolList.length > 0) {
            this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
          }
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])
    },
    //get class for teacher
    async getClassListTeacher() {
      await TeacherService.getClassInTeacher()
        .then((resp) => {
          this.classOfGradeList = resp.data.data;
          this.dataSearch.idClass = this.classOfGradeList.filter(
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
      this.getCurrentDate();
      if (this.getAppTypeUserLogin == "plus") {
        await Promise.all([this.getAllGrade()]);
        await this.getClassInGrade();
      } else if (this.getAppTypeUserLogin == "teacher") {
        await this.getClassListTeacher();
      }

      this.searchByProperties(
        this.timeSchedule,
        this.dataSearch.idGrade,
        this.dataSearch.idClass
      );
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
  // /deep/.el-table--scrollable-y .el-table__body-wrapper {
  //   overflow-y: auto;
  //   // margin-top: -1px;
  // }
  /deep/.el-table .cell {
    // box-sizing: border-box;
    overflow-y: auto;
    white-space: pre-line;
    word-break: break-word;
    // line-height: 23px;
    padding-right: 10px;
    max-height: 150px;
    text-align: left;
    // text-overflow: ellipsis;
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
    margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
/deep/.el-table th > .cell {
  text-align: center !important;
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
  max-height: 10px;
}
.clickCellSchedule {
  border: none;
  padding: 0;
}
.clickCellSchedule:hover {
  color: red;
}
.el-table .line-break .cell {
  white-space: pre;
}
h4.edit {
  color: #00a1ff;
  position: absolute;
  bottom: -12px;
  right: 18px;
}
</style>
