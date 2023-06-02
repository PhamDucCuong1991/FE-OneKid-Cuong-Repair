<template>
  <div>
    <div
      class="search-input"
      :style="{ visibility: showDataSearch ? 'visible' : 'hidden' }"
      style="margin-bottom: -20px; position: relative; z-index: 1; margin-top: 5px"
    >
      <!-- chọn khối -->
      <el-select
        class="input-common"
        style="width: 140px"
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
        class="input-common"
        style="width: 140px"
        filterable
        clearable
        v-model="dataSearch.idClass"
        placeholder="Chọn lớp"
        @change="handleClickTab()"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :value="item.id"
          :label="item.className"
        ></el-option>
      </el-select>

      <el-input
        style="width: 280px"
        placeholder="Nhập tên lớp"
        clearable
        v-model="dataSearch.className"
        @clear="handleClickTab()"
        @keyup.enter.native="handleClickTab()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleClickTab()"
        ></el-button>
      </el-input>
    </div>

    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- nguồn tin -->

        <el-tab-pane label="Nguồn tin" name="oneCamNewTab" style="width: 60%">
          <div>Cài đặt tin tức OneCam</div>
          <br />
          <el-form
            label-width="140px"
            :model="oneCameData"
            label-position="left"
            :rules="rules"
            ref="oneCameData"
          >
            <el-form-item label="OneCam" prop="oneCamNumber">
              <el-input
                v-model.number="oneCameData.oneCamNumber"
                placeholder="OneCam"
              ></el-input>
            </el-form-item>
            <el-form-item label="OneKids" prop="oneKidsNumber">
              <el-input
                v-model.number="oneCameData.oneKidsNumber"
                placeholder="OneKids"
              ></el-input>
            </el-form-item>
            <el-form-item label="Nhà trường" prop="schoolNumber">
              <el-input
                v-model.number="oneCameData.schoolNumber"
                placeholder="Nhà trường"
              ></el-input>
            </el-form-item>
            <el-form-item label="Tổng số hiện thị">
              {{
                oneCameData.schoolNumber +
                oneCameData.oneKidsNumber +
                oneCameData.oneCamNumber
              }}
            </el-form-item>
            <el-form-item label="Nguồn link mở rộng">
              <el-radio-group v-model="oneCameData.extendLinkStatus">
                <el-radio :label="true">Link mở rộng</el-radio>
                <el-radio :label="false">Tin nhà trường</el-radio>
                <el-input
                  v-if="oneCameData.extendLinkStatus"
                  v-model="oneCameData.extendLink"
                  placeholder="Nhập link mở rộng(https://...)"
                ></el-input>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-button
            type="success"
            size="medium"
            :loading="loadingButtonOneCam"
            mini
            @click="updateOneCamSettingMethod()"
            style="float: right"
          >
            <i class="el-icon-circle-check" />
            <span>{{ $t("button.save") }}</span>
          </el-button>
        </el-tab-pane>
        <el-tab-pane label="View Setting" name="oneCamSettingTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSetting"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="onecamSettingList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="className"
              label="Tên lớp"
              width="170"
            ></el-table-column>
            <el-table-column label="Điểm danh đến" width="120" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.arriveViewStatus" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Điểm danh về" width="120" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.leaveNoViewStatus" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Giới hạn số phút" width="130" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.viewLimitStatus" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="Số phút"
              prop="viewLimitNumber"
              width="90"
              align="center"
            >
            </el-table-column>
            <el-table-column label="Giới hạn khoảng" width="130" align="center">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.timeViewStatus" disabled></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Khoảng thời gian">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.startTime1 != null || scope.row.endTime1 != null"
                  style="margin-right: 8px"
                  type
                  effect="plain"
                  >{{ scope.row.startTime1 }} - {{ scope.row.endTime1 }}</el-tag
                >
                <el-tag
                  v-if="scope.row.startTime2 != null || scope.row.endTime2 != null"
                  style="margin-right: 8px"
                  type
                  effect="plain"
                  >{{ scope.row.startTime2 }} - {{ scope.row.endTime2 }}</el-tag
                >
                <el-tag
                  v-if="scope.row.startTime3 != null || scope.row.endTime3 != null"
                  style="margin-right: 8px"
                  type
                  effect="plain"
                  >{{ scope.row.startTime3 }} - {{ scope.row.endTime3 }}</el-tag
                >
                <el-tag
                  v-if="scope.row.startTime4 != null || scope.row.endTime4 != null"
                  style="margin-right: 8px"
                  type
                  effect="plain"
                  >{{ scope.row.startTime4 }} - {{ scope.row.endTime4 }}</el-tag
                >
                <el-tag
                  v-if="scope.row.startTime5 != null || scope.row.endTime5 != null"
                  style="margin-right: 8px"
                  type
                  effect="plain"
                  >{{ scope.row.startTime5 }} - {{ scope.row.endTime5 }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="100" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="settingViewSettingMethod(scope.row)"
                  >Cài đặt</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- camera setting -->
        <el-tab-pane label="Camera setting" name="cameraSettingTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSetting"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="cameraSettingList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="className"
              label="Tên lớp"
              width="200"
            ></el-table-column>
            <el-table-column label="Danh sách camera">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 8px"
                  v-for="item in scope.row.cameraList"
                  :key="item.id"
                  type
                  effect="plain"
                  >{{ item.camName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="addCameraForClassMethod(scope.row)"
                  >Thêm Camera</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- camera list -->
        <el-tab-pane label="Camera list" name="cameraListTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableList"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="cameraList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeCameraList"
            :max-height="$tableMaxHeight"
            border
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column
              fixed
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed
              prop="camName"
              label="Camera Name"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="dvrCamera.dvrName"
              label="DVR Name"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="camChanel"
              label="Chanel"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="camStream"
              label="Stream"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="camChanelOneCam"
              label="OneCam Chanel"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="camStreamOneCam"
              label="OneCam Stream"
              width="150"
            ></el-table-column>
            <el-table-column prop="linkCam" label="Camera Link" width="550">
              <template slot-scope="scope">
                <span>{{ scope.row.dvrCamera.linkDvr }}{{ scope.row.linkCam }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Active" width="70" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeCameraMethod(scope.row)"
                  v-model="scope.row.camActive"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="Ghi chú" width="250"></el-table-column>
            <el-table-column fixed="right" label="Action" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateCameraMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteCameraOneMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <!-- <el-dropdown @command="handleCommandCamera">
              <el-button class="button-bottom" type="success">
                Tác vụ
                <i class="el-icon-caret-bottom" />
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item command="addCamera">Thêm Camera</el-dropdown-item>
                <el-dropdown-item command="remoCamera">Xóa Camera</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <el-button type="success" class="button-bottom" @click="addCameraMethod()">
              <i class="el-icon-circle-check" />
              Thêm camera
            </el-button>
          </div>
        </el-tab-pane>

        <!-- camera dvrconfig -->
        <el-tab-pane label="DVR config" name="dvrConfigTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableDVR"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="dvrCameraList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeDvrcamera"
            :max-height="$tableMaxHeight"
            border
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column
              fixed
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed
              prop="dvrName"
              label="DVR Name"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="dvrType"
              label="Factory"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="adminDvrAcc"
              label="Acc"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="adminDvrPassword"
              label="Pass"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="schoolDomain"
              label="School Domain"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="camPort"
              label="Port"
              align="center"
              width="65"
            ></el-table-column>
            <el-table-column
              prop="linkDvr"
              label="Link DVR"
              width="490"
            ></el-table-column>
            <el-table-column
              prop="ipLocal"
              label="IP Local"
              align="center"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="modemAcc"
              label="Modem Acc"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="modemPass"
              label="Modem Pass"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column label="DVR Active" align="center" width="100">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeDvrcameraMethod(scope.row)"
                  v-model="scope.row.dvrActive"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="Note" width="240"></el-table-column>
            <el-table-column fixed="right" label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateDvrcameraMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteDvrcameraOneMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <!-- <el-dropdown @command="handleCommandDvrCamera">
              <el-button class="button-bottom" type="success">
                Tác vụ
                <i class="el-icon-caret-bottom" />
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item command="addDvrCamera">Thêm Đầu ghi</el-dropdown-item>
                <el-dropdown-item command="removeDvrCamera">Xóa Đầu ghi</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>-->
            <el-button type="success" class="button-bottom" @click="addDvrCameraMethod()">
              <i class="el-icon-circle-check" />
              Thêm đầu ghi
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <CameraUpdateDialog
      :dialogVisible="showUpdateCameraDialog"
      @dialog-close="dialogCloseUpdateCameraMethod()"
      ref="CameraUpdateDialog"
    />
    <CameraCreateDialog
      :dialogVisible="showCreateCameraDialog"
      @dialog-close="dialogCloseCreateCameraMethod()"
      ref="CameraCreateDialog"
    />
    <AddCameraForClassDialog
      :dialogVisible="showAddCameraDialog"
      @dialog-close="dialogCloseAddCameraMethod()"
      ref="AddCameraForClassDialog"
    />
    <DvrCameraCreateDialog
      :dialogVisible="showCreateDvrCameraDialog"
      @dialog-close="dialogCloseCreateDvrCameraMethod()"
    />
    <DvrCameraUpdateDialog
      :dialogVisible="showUpdateDvrCameraDialog"
      @dialog-close="dialogCloseUpdateDvrCameraMethod()"
      ref="DvrCameraUpdateDialog"
    />
    <OneCameSettingDialog
      :dialogVisible="showOneCamSettingDialog"
      @dialog-close="dialogCloseOneCamSettingMethod()"
      ref="OneCameSettingDialog"
    />
  </div>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
import CameraUpdateDialog from "./CameraUpdateDialog.vue";
import CameraCreateDialog from "./CameraCreateDialog.vue";
import AddCameraForClassDialog from "./AddCameraForClassDialog.vue";
import DvrCameraCreateDialog from "./DvrCameraCreateDialog.vue";
import DvrCameraUpdateDialog from "./DvrCameraUpdateDialog.vue";
import OneCameSettingDialog from "./OneCameSettingDialog.vue";
import {mapActions, mapState} from "vuex";

export default {
  components: {
    CameraUpdateDialog,
    CameraCreateDialog,
    AddCameraForClassDialog,
    DvrCameraCreateDialog,
    DvrCameraUpdateDialog,
    OneCameSettingDialog,
  },
  data() {
    return {
      loadingData: true,
      textTableSetting: "",
      textTableList: "",
      textTableDVR: "",
      activeTabName: "cameraSettingTab",
      showDataSearch: true,
      cameraList: [],
      cameraSettingList: [],
      onecamSettingList: [],
      dvrCameraList: [],
      oneCameData: {},
      noSelect: "",
      multipleSelectionCameraList: [],
      multipleSelectionDvrcamera: [],
      albumRadio: false,
      loaddingButton: false,
      showUpdateCameraDialog: false,
      showAddCameraDialog: false,
      showCreateCameraDialog: false,
      showCreateDvrCameraDialog: false,
      showUpdateDvrCameraDialog: false,
      showOneCamSettingDialog: false,
      loaddingButtonClass: false,
      loadingButtonOneCam: false,
      gradeList: [],
      classList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
    };
  },
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (row.absentStatus == "Nghỉ có phép" || row.absentStatus == "Nghỉ không phép") {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    handleSelectionChangeCameraList(val) {
      this.multipleSelectionCameraList = val;
    },
    handleSelectionChangeDvrcamera(val) {
      this.multipleSelectionDvrcamera = val;
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },

    handleClickTab() {
      let tabNameClick = this.activeTabName;
      // let tabNameClick = tab.name;
      if (tabNameClick == "cameraSettingTab") {
        this.showDataSearch = true;
        this.searchByProperties();
      } else if (tabNameClick == "cameraListTab") {
        this.showDataSearch = false;
        this.findAllCameraMethod();
      } else if (tabNameClick == "dvrConfigTab") {
        this.showDataSearch = false;
        this.findAllDvrCameraMethod();
      } else if (tabNameClick == "oneCamNewTab") {
        this.showDataSearch = false;
        this.findOneCamSettingMethod();
      } else if (tabNameClick == "oneCamSettingTab") {
        this.showDataSearch = true;
        this.searchOneCamSettingByProperties();
      }
    },
    dialogCloseUpdateCameraMethod() {
      this.showUpdateCameraDialog = false;
      this.findAllCameraMethod();
    },
    dialogCloseAddCameraMethod() {
      this.showAddCameraDialog = false;
      this.searchByProperties();
    },
    updateCameraMethod(row) {
      this.showUpdateCameraDialog = true;
      this.$refs.CameraUpdateDialog.findAllDvrCameraMethodInitial(row);
    },
    updateDvrcameraMethod(row) {
      this.showUpdateDvrCameraDialog = true;
      this.$refs.DvrCameraUpdateDialog.getDvrcameraUpdateInitial(row);
    },
    addCameraForClassMethod(row) {
      setTimeout(() => {
        this.showAddCameraDialog = true;
      }, 100);
      this.$refs.AddCameraForClassDialog.getCameraForClassInitial(row.id);
    },
    settingViewSettingMethod(row) {
      this.showOneCamSettingDialog = true;
      this.$refs.OneCameSettingDialog.initialDataMethod(row);
    },
    dialogCloseCreateCameraMethod() {
      this.showCreateCameraDialog = false;
      this.findAllCameraMethod();
    },
    dialogCloseCreateDvrCameraMethod() {
      this.showCreateDvrCameraDialog = false;
      this.findAllDvrCameraMethod();
    },
    dialogCloseUpdateDvrCameraMethod() {
      this.showUpdateDvrCameraDialog = false;
      this.findAllDvrCameraMethod();
    },
    dialogCloseOneCamSettingMethod() {
      this.showOneCamSettingDialog = false;
      this.searchOneCamSettingByProperties();
    },
    addCameraMethod() {
      this.$refs.CameraCreateDialog.findAllDvrCameraMethodInitial();
      setTimeout(() => {
        this.showCreateCameraDialog = true;
      }, 100);
    },

    /**
     * xóa nhiều camera
     */
    deleteCameraManyMethod() {
      let dataList = this.multipleSelectionCameraList;
      if (dataList.length == 0) {
        this.$message({
          message: "Không có camera nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + dataList.length + " camera đã chọn?",
        "Xóa nhiều camera",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteCameraMany(dataList)
          .then((resp) => {
            let checkDelete = resp.data.data;
            console.log(checkDelete);
            this.$message({
              message: "Xóa nhiều camera thành công",
              type: "success",
            });
            this.findAllCameraMethod();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa nhiều camera thất bại",
              type: "error",
            });
          });
      });
    },
    addDvrCameraMethod() {
      this.showCreateDvrCameraDialog = true;
    },
    /**
     * xóa nhiều dvrcamera
     */
    deleteDvrCameraManyMethod() {
      let dataList = this.multipleSelectionDvrcamera;
      if (dataList.length == 0) {
        this.$message({
          message: "Không có DVR Link nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + dataList.length + " DVR Link đã chọn?",
        "Xóa nhiều DVR Link",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteDvrCameraMany(dataList)
          .then((resp) => {
            let checkDelete = resp.data.data;
            console.log(checkDelete);
            this.$message({
              message: "Xóa nhiều DVR Link thành công",
              type: "success",
            });
            this.findAllDvrCameraMethod();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa nhiều DVR Link thất bại",
              type: "error",
            });
          });
      });
    },
    /**
     * xóa 1 camera
     */
    deleteCameraOneMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa camera đã chọn?", "Xóa camera", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        SchoolConfigService.deleteCameraOne(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllCameraMethod();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa thất bại",
              type: "error",
            });
          });
      });
    },

    /**
     * xóa 1 dvrcamera
     */
    deleteDvrcameraOneMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa Link DVR đã chọn?", "Xóa Link DVR", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        SchoolConfigService.deleteDvrCamera(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllDvrCameraMethod();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa thất bại",
              type: "error",
            });
          });
      });
    },
    /**
     * kích hoạt 1 camera
     */
    activeCameraMethod(row) {
      let textAlert = "";
      if (row.camActive) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      SchoolConfigService.updateActiveCamera(row)
        .then((resp) => {
          let checkActive = resp.data.data;
          console.log(checkActive);
          this.$message({
            message: textAlert + " thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: textAlert + " thất bại",
            type: "error",
          });
        });
    },
    /**
     * kích hoạt 1 dvrcamera
     */
    activeDvrcameraMethod(row) {
      let textAlert = "";
      if (row.dvrActive) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      SchoolConfigService.updateActiveDvrCamera(row)
        .then((resp) => {
          let checkActive = resp.data.data;
          console.log(checkActive);
          this.$message({
            message: textAlert + " thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: textAlert + " thất bại",
            type: "error",
          });
        });
    },

    /**
     * tìm kiếm tất cả các camera
     */
    findAllCameraMethod() {
      this.loadingData = true;
      SchoolConfigService.findAllCamera()
        .then((resp) => {
          this.cameraList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.cameraList = null;
        })
        .finally(() => {
          if (this.cameraList == null) {
            this.textTableList = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    /**
     * tìm kiếm tất cả camera setting
     */
    searchByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.findAllCameraSetting(data.idGrade, data.idClass, data.className)
        .then((resp) => {
          this.cameraSettingList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.cameraSettingList = null;
        })
        .finally(() => {
          if (this.cameraSettingList == null) {
            this.textTableSetting = this.$tableEmpty;
          }
          this.loadingData = false;
          // this.getClassFirstGrade(this.dataSearch.idGrade);
        });
    },
    searchOneCamSettingByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.findOneCamSetting(data.idGrade, data.idClass, data.className)
        .then((resp) => {
          this.onecamSettingList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.onecamSettingList = null;
        })
        .finally(() => {
          if (this.cameraSettingList == null) {
            this.textTableSetting = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm all dvrcamera
     */
    findAllDvrCameraMethod() {
      this.loadingData = true;
      SchoolConfigService.findAllDvrCamera()
        .then((resp) => {
          this.dvrCameraList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.dvrCameraList = null;
        })
        .finally(() => {
          if (this.dvrCameraList == null) {
            this.textTableDVR = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    findOneCamSettingMethod() {
      SchoolConfigService.findOneCamNews()
        .then((resp) => {
          this.oneCameData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateOneCamSettingMethod() {
      this.loadingButtonOneCam = true;
      SchoolConfigService.updateOneCamNews(this.oneCameData)
        .then((resp) => {
          console.log(resp.data.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonOneCam = false;
          }, 500);
        });
    },

    /**
     * thay đổi khối
     */
    changeGradeMethod() {
      this.dataSearch.idClass = "";
      this.getClassOfGrade();
      this.handleClickTab();
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
    async fetchDataMany() {
      await this.getAllGrade();
      await this.getClassOfGrade();
      this.searchByProperties();
    },
  },
  beforeMount() {
    this.fetchDataMany();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 14px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
}
// td {
//   padding: 12px;
// }
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
