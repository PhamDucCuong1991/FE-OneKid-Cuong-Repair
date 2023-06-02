<template>
  <div class="content">
    <!-- add -->
    <div v-if="showAdd" style="margin-top: 5px; margin-bottom: -20px">
      <el-date-picker
        v-model="dateStartEnd"
        type="daterange"
        unlink-panels
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        @change="searchHeaderMethodPlus()"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
      ></el-date-picker>

      <el-select
        class="button-left-class"
        v-model="dataSearch.dateSick"
        @change="searchHeaderMethodPlus()"
        placeholder="Kiểu gửi"
        style="margin-left: 5px"
      >
        <el-option
          v-for="item in dateSick"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-select
        class="button-left-class"
        v-model="dataSearch.receiverType"
        @change="searchHeaderMethodPlus()"
        clearable
        placeholder="Đối tượng nhận"
        style="margin-left: 5px"
      >
        <el-option
          v-for="item in receiverType"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-input
        class="button-left-class"
        style="width: 255px"
        placeholder="Nhập nội dung tìm kiếm"
        clearable
        v-model="dataSearch.title"
        @change="searchHeaderMethodPlus()"
        @keyup.enter.native="searchHeaderMethodPlus()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethodPlus()"
        ></el-button>
      </el-input>
    </div>

    <!-- history -->
    <div v-else-if="showHistory" style="margin-top: 5px; margin-bottom: -20px">
      <el-date-picker
        v-model="dateStartEnd"
        type="daterange"
        unlink-panels
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        @change="searchHeaderMethodTeacher()"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
      ></el-date-picker>

      <el-select
        class="button-left-class"
        v-model="dataAddSearch.dateSick2"
        @change="searchHeaderMethodTeacher()"
        placeholder="Kiểu gửi"
        style="margin-left: 5px"
      >
        <el-option
          v-for="item in dateSick2"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-input
        class="button-left-class"
        style="width: 255px"
        placeholder="Nhập nội dung tìm kiếm"
        clearable
        v-model="dataAddSearch.title"
        @change="searchHeaderMethodTeacher()"
        @keyup.enter.native="searchHeaderMethodTeacher()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethodTeacher()"
        ></el-button>
      </el-input>
    </div>

    <div class="lblthemlichsu">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Nhà trường" name="plus">
          <!-- table -->
          <!-- aa -->
          <div class="table-content row-data">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="feedbacklist"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="createdBy"
                min-width="150"
                label="Người gửi"
                align="left"
              ></el-table-column>
              <el-table-column label="Thời gian gửi" width="140" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdDate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sendType"
                width="100"
                label="Kiểu gửi"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="sendTitle"
                label="Tiêu đề"
                min-width="150"
              ></el-table-column>

              <el-table-column label="Nội dung" width="150" align="center ">
                <template slot-scope="scope">
                  <span>{{ scope.row.a }}</span>
                  <el-button
                    v-if="scope.row.sendContent != 0"
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleViewDetail(scope.$index, scope.row)"
                    >(Xem)</el-button
                  >

                  <el-button
                    v-else
                    disabled
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleViewDetail(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="numberFile"
                label="Số file"
                width="80"
                align="center"
              >
              </el-table-column>

              <el-table-column
                label="Số người nhận"
                width="150"
                align="center "
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.coutUserSent }}</span>
                  <el-button
                    v-if="scope.row.coutUserSent !== 0"
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleListReceiver(scope.$index, scope.row)"
                    >(Xem)</el-button
                  >
                </template>
              </el-table-column>

              <el-table-column
                v-if="checkPermission(['notifyHistory_historyApp_update'])"
                label="Tác vụ"
                width="260"
                fixed="right"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.approveRe"
                    type="success"
                    @click="handleconfirm(scope.row)"
                    >Duyệt</el-button
                  >

                  <el-button size="mini" v-else disabled type="info"
                    >Duyệt</el-button
                  >

                  <!-- <el-button size="mini" type="warning" @click="setCurrent()">Làm mới</el-button> -->

                  <el-button
                    v-if="scope.row.sendDel"
                    size="mini"
                    type="success"
                    @click="handleRevokeUn(scope.row)"
                    >Hủy thu hồi</el-button
                  >

                  <el-button
                    size="mini"
                    v-else
                    type="warning"
                    @click="handleRevoke(scope.row)"
                    >Thu hồi</el-button
                  >
                  <el-button
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"
                    type="danger"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <div class="btt">
              <el-dropdown @command="handleCommand">
                <el-button class="button-over" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu class="el-dropdown-menu-container">
                  <el-dropdown-item command="handleRead"
                    >Duyệt thông báo</el-dropdown-item
                  >
                  <el-dropdown-item command="handleConfirm"
                    >Thu hồi thông báo</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div
            class="paging-click row-data"
            style="float: right; margin-bottom: 10px"
          >
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
          <!-- -- -->
        </el-tab-pane>

        <!-- lich su -->
        <el-tab-pane label="Giáo viên" name="teacher">
          <!-- aa -->
          <div class="table-content row-data">
            <el-table
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              ref="multipleTable"
              :data="smsappteacherlist"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="createdBy"
                label="Người gửi"
                min-width="150"
                align="left"
              ></el-table-column>
              <el-table-column label="Thời gian gửi" width="140" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdDate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sendType"
                label="Kiểu gửi"
                width="100"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="sendTitle"
                label="Tiêu đề"
                min-width="150"
              ></el-table-column>

              <el-table-column label="Nội dung" width="150" align="center ">
                <template slot-scope="scope">
                  <span>{{ scope.row.a }}</span>
                  <el-button
                    v-if="scope.row.sendContent != 0"
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleViewDetail(scope.$index, scope.row)"
                    >(Xem)</el-button
                  >

                  <el-button
                    v-else
                    disabled
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleViewDetail(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="numberFile"
                label="Số file"
                width="80"
                align="center"
              >
              </el-table-column>

              <el-table-column
                label="Số người nhận"
                width="150"
                align="center "
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.coutUserSent }}</span>
                  <el-button
                    v-if="scope.row.coutUserSent != 0"
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleListReceiver(scope.$index, scope.row)"
                    >(Xem)</el-button
                  >
                  <el-button
                    v-else
                    disabled
                    type="text"
                    style="
                      color: #67c23a;
                      text-decoration: underline;
                      margin-left: 10px;
                    "
                    @click="handleListReceiver(scope.$index, scope.row)"
                  ></el-button>
                </template>
              </el-table-column>

              <el-table-column
                v-if="checkPermission(['notifyHistory_historyApp_update'])"
                label="Tác vụ"
                width="260"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    v-if="scope.row.approveRe"
                    type="success"
                    @click="handleconfirmTC(scope.row)"
                    >Duyệt</el-button
                  >

                  <el-button size="mini" disabled v-else type="info"
                    >Duyệt</el-button
                  >

                  <el-button
                    v-if="scope.row.sendDel"
                    size="mini"
                    type="success"
                    @click="handleRevokeUnTC(scope.row)"
                    >Hủy thu hồi</el-button
                  >

                  <el-button
                    size="mini"
                    v-else
                    type="warning"
                    @click="handleRevokeTC(scope.row)"
                    >Thu hồi</el-button
                  >

                  <el-button
                    size="mini"
                    @click="handleDelete2(scope.$index, scope.row)"
                    type="danger"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <div class="btt">
              <el-dropdown @command="handleCommand">
                <el-button class="button-over" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu class="el-dropdown-menu-container">
                  <el-dropdown-item command="confirmnotifi"
                    >Duyệt thông báo</el-dropdown-item
                  >
                  <el-dropdown-item command="revokenotifi"
                    >Thu hồi thông báo</el-dropdown-item
                  >
                  <el-dropdown-item command="deletenotifi"
                    >Xóa thông báo</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div
            class="paging-click row-data"
            style="float: right; margin-bottom: 10px"
          >
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
        </el-tab-pane>
      </el-tabs>
    </div>

    <view-content
      :dialogVisible="showCreateDialog"
      @dialog-close="showCreateDialog = false"
      ref="ViewContent"
    />
    <ViewCoutUserSentSmsAppforSys
      :dialogVisible="showCreateDialogViewCoutUserSent"
      @dialog-close="dialogCloseShowMethod2()"
      ref="ViewCoutUserSentSmsAppforSys"
    />
    <ListReceiver
      :dialogVisible="showListReceiver"
      @dialog-close="dialogCloseListReceiverMethod()"
      ref="ListReceiver"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ViewContent from "./ViewContent.vue";
import ViewCoutUserSentSmsAppforSys from "./ViewCoutUserSentSmsAppforSys.vue";
import StudentService from "@/services/StudentService";
import HistorySmsService from "@/services/HistorySmsService";
import ListReceiver from "../notifihistory/ListReceiver";
import moment from "moment";
import AppSendService from "../../services/AppSendService";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  components: {
    ViewContent,
    ListReceiver,
    ViewCoutUserSentSmsAppforSys,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      multipleSelection: [],
      showListReceiver: false,

      receiverType: [
        { status: "teacher", label: "Giáo viên" },
        { status: "parent", label: "Phụ huynh" },
      ],
      dateSick: [
        { status: "common", label: "Chung" },
        { status: "arrive", label: "Điểm danh đến" },
        { status: "leave", label: "Điểm danh về" },
        { status: "finance", label: "Tài chính" },
        { status: "birthday", label: "Sinh nhật" },
        { status: "sys", label: "Gửi tự động" },
      ],
      dateSick2: [
        { status: "common", label: "Chung" },
        { status: "arrive", label: "Điểm danh đến" },
        { status: "leave", label: "Điểm danh về" },
        { status: "birthday", label: "Sinh nhật" },
      ],
      newFeedbackUpdate: null,
      newUpdateRevoke: null,
      newUpdateRevokeun: null,
      dateStartEnd: [],
      activeName: "plus",
      showAdd: true,
      showHistory: false,
      showCreateDialog: false,
      showCreateDialogViewCoutUserSent: false,
      kidsHeightWeightHistoryList: [],
      feedbacklist: [],
      smsappteacherlist: [],

      // -------
      value: "",
      dataAddSearch: {
        dateSick2: "common",
        title: "",
      },
      dataSearch: {
        dateSick: "common",
        receiverType: "",
        title: "",
      },

      newHeightWeightCreated: null,
    };
    // ----
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllFeedBack();
      this.searchSmsAppTeacher();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllFeedBack();
      this.searchSmsAppTeacher();
    },

    dialogCloseListReceiverMethod() {
      this.showListReceiver = false;
    },
    handleCommand(command) {
      if (command == "handleRead") {
        this.approveSchoolUnread();
      } else if (command == "handleConfirm") {
        this.approveSchoolConfirm();
      }
    },
    handleListReceiver(index, row) {
      this.showListReceiver = true;
      this.$refs.ListReceiver.getAllReceiversNotify(row.id);
    },
    approveSchoolUnread() {
      let a = this.multipleSelection;
      console.log(a);
      if (a.length == 0) {
        this.$message({
          message: "Không có thông báo nào được chọn",
          type: "error",
        });
        return;
      }
      if (a.length >= 1) {
        AppSendService.updateappovedmsmsapp(a).then((resp) => {
          console.log(resp);
        });
        this.$message({
          message: "Duyệt thông báo thành công",
          type: "success",
        });
        setTimeout(() => {
          this.getAllFeedBack();
        }, 100).catch((err) => {
          console.log(err);
        });
      }
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thông báo đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        HistorySmsService.deleteSmsAppNotSetDelactive(row.id).then(
          (response) => {
            console.log(response);
            this.$message({
              message: "Xóa thông báo thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllFeedBack();
            }, 500);
          }
        );
      });
    },
    handleDelete2(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thông báo đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        HistorySmsService.deleteSmsAppNotSetDelactive(row.id).then(
          (response) => {
            console.log(response);
            this.$message({
              message: "Xóa thông báo thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchSmsAppTeacher();
            }, 500);
          }
        );
      });
    },
    dialogCloseShowMethodU() {
      this.getAllFeedBack();
      this.showCreateDialogViewCoutUserSent = false;
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "plus") {
        this.showAdd = true;
        this.showHistory = false;
        this.checkDisable = false;
      } else if (tabNameClick == "teacher") {
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      }
    },
    handleconfirm(row) {
      let data = row;
      HistorySmsService.updateApprove(data.id)
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
          this.$message({
            message: "Duyệt  thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Duyệt thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
          this.getAllFeedBack();
        });
    },

    handleconfirmTC(row) {
      let data = row;
      HistorySmsService.updateApprove(data.id)
        .then((response) => {
          this.newFeedbackUpdate = response.data.data;
          this.$message({
            message: "Duyệt  thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Duyệt thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
          this.searchSmsAppTeacher();
        });
    },

    // thu hồi
    handleRevoke(row) {
      let data = row;
      HistorySmsService.updateRevokehis(data.id)
        .then((response) => {
          this.newUpdateRevoke = response.data.data;
          this.$message({
            message: "Thu hồi thành công",
            type: "success",
          });
          this.getAllFeedBack();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thu hồi thất bại",
            type: "error",
          });
        });

      // location.reload();
      // this.getAllFeedBack();
    },
    // thu hồi
    handleRevokeTC(row) {
      let data = row;
      HistorySmsService.updateRevokehis(data.id)
        .then((response) => {
          this.newUpdateRevoke = response.data.data;
          this.$message({
            message: "Thu hồi thành công",
            type: "success",
          });
          this.searchSmsAppTeacher();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thu hồi thất bại",
            type: "error",
          });
        });
    },

    //hủy thu hồi
    handleRevokeUn(row) {
      let data = row;
      HistorySmsService.updateUnRevokehis(data.id)
        .then((response) => {
          this.newUpdateRevoke = response.data.data;
          this.$message({
            message: "Hủy thu hồi  thành công",
            type: "success",
          });
          this.getAllFeedBack();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy thu hồi thất bại",
            type: "error",
          });
        });
    },
    //hủy thu hồi
    handleRevokeUnTC(row) {
      let data = row;
      HistorySmsService.updateUnRevokehis(data.id)
        .then((response) => {
          this.newUpdateRevoke = response.data.data;
          this.$message({
            message: "Hủy thu hồi  thành công",
            type: "success",
          });
          this.searchSmsAppTeacher();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Hủy thu hồi thất bại",
            type: "error",
          });
        });
    },
    handleViewcoutUserSent(index, row) {
      this.showCreateDialogViewCoutUserSent = true;
      this.$refs.ViewCoutUserSentSmsAppforSys.getDetailMethodabc(row.id);
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.searchSmsAppTeacher();
    },
    dialogCloseShowMethod2() {
      this.showCreateDialogViewCoutUserSent = false;
    },
    searchHeaderMethodTeacher() {
      this.pageNumber = 1;
      this.searchSmsAppTeacher();
    },
    // search history
    searchSmsAppTeacher() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }
      this.loadingData = true;
      this.textTable = "";
      HistorySmsService.searchSmstc(
        this.pageNumber,
        this.maxPageItem,
        this.dateStartEnd,
        this.dataAddSearch.dateSick2,
        this.dataAddSearch.title
      )
        .then((resp) => {
          this.smsappteacherlist = resp.data.data.responseList;
        })
        .catch((err) => {
          this.smsappteacherlist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.smsappteacherlist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchHeaderMethodPlus() {
      this.pageNumber = 1;
      this.getAllFeedBack();
    },
    getAllFeedBack() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }

      this.loadingData = true;
      this.textTable = "";
      HistorySmsService.searchSmsappsys(
        this.pageNumber,
        this.maxPageItem,
        this.dateStartEnd,
        this.dataSearch.dateSick,
        this.dataSearch.receiverType,
        this.dataSearch.title
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.feedbacklist = resp.data.data.responseList;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.feedbacklist = [];
          console.log(err);
        })
        .finally(() => {
          if (this.feedbacklist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    handleDelete1(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa tin nhắn ", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        HistorySmsService.deleteappsend(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa tin nhắn thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllFeedBack();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa tin nhắn thất bại !",
              type: "error",
            });
          });
      });
    },
    handleDeletetc(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa tin nhắn ", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        HistorySmsService.deleteappsend(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa tin nhắn thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchSmsAppTeacher();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa tin nhắn thất bại !",
              type: "error",
            });
          });
      });
    },
    openConfirm() {
      this.$confirm("Bạn có chắc chắn muốn xóa khối đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.$message({
          type: "success",
          message: "Thực hiện xóa",
        });
      });
    },

    // click xem
    handleViewDetail(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewContent.getDetailMethod(row.id);
    },
    getKidStatus() {
      StudentService.getKidStatus().then((resp) => {
        this.kidStatusList = resp.data.data;
      });
    },
    getCurrentDate() {
      let a = (this.dataAddSearch.date = moment(String(new Date())).format(
        "YYYY-MM-DD"
      ));
      console.log(a);
    },
  },

  beforeMount() {
    this.getAllFeedBack();
    this.searchSmsAppTeacher();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.button-select {
  margin-right: 5px;
  width: 150px;
}

/deep/.el-table th {
  padding: 10px 0;
}

.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-button--primary {
  // width: 8% !important;
  background: #409eff;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
}
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
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}

.button-left-class {
  margin-right: 5px;
  width: 150px;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
.button-left-class1 {
  margin-right: 5px;
  width: 133px;
}
/deep/.el-table th > .cell {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  text-align: center !important;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}

.button-left-class9 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class2 {
  margin-right: -50px;
  width: 140px;
}
.button-left-class3 {
  margin-left: -10px;
  width: 140px;
}
.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  // border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
/deep/.content[data-v-14071a78] .el-range-editor.el-input__inner {
  width: 240px;
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  width: 220px;
}
.el-range-editor.el-input__inner {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  width: 260px;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* border: red; */
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
/deep/.el-button--warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  width: 93px !important;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
/deep/.paging-click .el-pagination {
  text-align: right;
  margin-right: 50px;
  margin-top: -5px;
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
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  line-height: 23px;
  padding-right: 10px;
  max-height: 40px !important;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
