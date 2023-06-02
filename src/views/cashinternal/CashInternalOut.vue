<template>
  <div class="content">
    <!-- add -->
    <div class="search">
      <el-date-picker
        v-model="dateStartEnd"
        type="daterange"
        unlink-panels
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
        @change="searchHeaderMethod()"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
      ></el-date-picker>

      <!-- <el-select
        class="button-left-class"
        v-model="dataSearch.statusApprove"
        @change="searchByProperties()"
        clearable
        placeholder="Trạng thái duyệt"
        style="margin-left: 5px"
      >
        <el-option
          v-for="item in statusApprove"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-select
        class="button-left-class"
        v-model="dataSearch.statusPay"
        @change="searchByProperties()"
        clearable
        placeholder="TT thanh toán"
        style="margin-left: 5px; width: 160px"
      >
        <el-option
          v-for="item in statusPay"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select> -->
      <el-select
        class="button-left-class"
        v-model="dataSearch.status"
        @change="searchHeaderMethod()"
        clearable
        placeholder="Trạng thái"
        style="margin-left: 5px; width: 160px"
      >
        <el-option
          v-for="item in statusCheck"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-input
        class="button-left-class"
        style="width: 210px"
        placeholder="Nhập mã phiếu"
        clearable
        v-model="dataSearch.code"
        @change="searchHeaderMethod()"
        @keyup.enter.native="searchHeaderMethod()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethod()"
        ></el-button>
      </el-input>

      <div
        class="button-click-right row-data"
        style="float: right; margin-top: 5px"
      >
        <el-button
          style="border-radius: 0"
          type="success"
          @click="viewStatistical()"
          icon="el-icon-s-data"
        >
          Thống kê
        </el-button>
        <el-button
          v-if="checkPermission(['cashInternal_out_create'])"
          class="button-over"
          type="success"
          @click="createDialogMethod()"
        >
          <i class="el-icon-plus" />
          Tạo phiếu chi
        </el-button>

        <el-dropdown @command="handleCommand">
          <el-button class="button-over" type="success">
            Tác vụ
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item
              v-if="checkPermission(['cashInternal_out_approved'])"
              command="approve"
              >Duyệt</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermission(['cashInternal_out_approved'])"
              command="unapprove"
              >Bỏ duyệt</el-dropdown-item
            >
            <el-dropdown-item command="cancel">Hủy phiếu chi</el-dropdown-item>
            <!-- <el-dropdown-item command="createNotifySms">Xuất danh sách</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

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
        <el-table-column
          type="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="code" width="80" label="Mã phiếu" align="center">
        </el-table-column>
        <el-table-column
          class="test"
          prop="createdBy"
          label="Người tạo "
          align="left"
          min-width="120"
        ></el-table-column>
        <el-table-column label="Thời gian tạo" width="140" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="90" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.canceled">Đã hủy</span>
            <span v-else-if="scope.row.approved">Đã duyệt</span>
            <span v-else style="color: #f56c6c">Chưa duyệt</span>
          </template>
        </el-table-column>

        <el-table-column label="Thanh toán" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.payment">Đã thanh toán</span>
            <span v-else style="color: #f56c6c">Chưa thanh toán</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" align="right" label="Số tiền" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.money == 0">{{ 0 }}&nbsp;₫</span>
            <span v-else>{{ scope.row.money | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Ngày chi" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.date | formatDate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          min-width="150"
          label="Nội dung"
          align="left"
        ></el-table-column>
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="400"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.row)"
              >Xem</el-button
            >
            <span
              style="margin-left: 10px"
              v-if="checkPermission(['cashInternal_out_approved'])"
            >
              <el-button
                v-if="scope.row.approved"
                :disabled="scope.row.canceled || scope.row.payment"
                :type="
                  scope.row.canceled || scope.row.payment ? 'info' : 'success'
                "
                size="mini"
                @click="approvedOneMethod(scope.row, false)"
              >
                Bỏ Duyệt
              </el-button>
              <el-button
                v-else
                :disabled="scope.row.canceled || scope.row.payment"
                :type="
                  scope.row.canceled || scope.row.payment ? 'info' : 'success'
                "
                @click="approvedOneMethod(scope.row, true)"
                size="mini"
                >Duyệt</el-button
              >
            </span>
            <span
              style="margin-left: 10px"
              v-if="checkPermission(['cashInternal_out_payment'])"
            >
              <el-button
                v-if="
                  scope.row.approved &&
                  !scope.row.payment &&
                  !scope.row.canceled
                "
                size="mini"
                type="success"
                :loading="scope.row.loaddingButtonRow"
                @click="handlePayment(scope.row)"
                >Thanh toán</el-button
              >
              <el-button v-else disabled size="mini" type="info"
                >Thanh toán</el-button
              >
            </span>
            <el-button
              v-if="checkPermission(['cashInternal_out_create'])"
              style="margin-left: 10px"
              size="mini"
              :disabled="scope.row.approved || scope.row.canceled"
              :type="
                scope.row.approved || scope.row.canceled ? 'info' : 'warning'
              "
              @click="handleUpdate(scope.row)"
              >Sửa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- Số tiền đã chi : {{ a }} đ
    <a style="margin-left: 20px">
      Số tiền chưa thanh toán: {{ Math.floor(Math.random() * (100000 - 1 + 1)) + 1 }} đ
    </a> -->
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
    <CashInternalPayCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CashInternalPayCreate"
    />
    <CashInternalDetail
      :dialogVisible="showCreateDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="CashInternalDetail"
    />
    <StatisticalOutDialog
      :dialogVisible="showStatistical"
      @dialog-close="dialogCloseStatistical()"
      ref="StatisticalOutDialog"
    />

    <CashInternalPayUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="CashInternalPayUpdate"
    />
    <!-- -- -->
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import CashInternalService from "@/services/CashInternalService";
import CashInternalPayCreate from "./CashInternalPayCreate.vue";
import CashInternalDetail from "./CashInternalDetail.vue";
import CashInternalPayUpdate from "./CashInternalPayUpdate.vue";
import StatisticalOutDialog from "./StatisticalOutDialog.vue";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  components: {
    CashInternalPayCreate,
    CashInternalPayUpdate,
    CashInternalDetail,
    StatisticalOutDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      loadingButton: false,
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      multipleSelection: [],
      showListReceiver: false,

      // statusApprove: [
      //   { status: true, label: "Đã duyệt" },
      //   { status: false, label: "Chưa duyệt" },
      // ],
      // statusPay: [
      //   { status: true, label: "Đã thanh toán" },
      //   { status: false, label: "Chưa thanh toán" },
      // ],
      statusCheck: [
        { status: "payTrue", label: "Đã thanh toán" },
        { status: "payFalse", label: "Chưa thanh toán" },
        { status: "approveTrue", label: "Đã duyệt" },
        { status: "approveFalse", label: "Chưa duyệt" },
        { status: "approveDel", label: "Đã hủy" },
      ],
      showUpdateDialog: false,
      newFeedbackUpdate: null,
      newUpdateRevoke: null,
      newUpdateRevokeun: null,
      dateStartEnd: [],
      showAdd: true,
      showHistory: false,
      showCreateDialog: false,
      showStatistical: false,
      showCreateDetailDialog: false,
      showCreateDialogViewCoutUserSent: false,
      kidsHeightWeightHistoryList: [],
      feedbacklist: [],
      smsappteacherlist: [],

      value: "",
      dataSearch: {
        status: "",
        code: "",
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
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseDetailMethod() {
      this.showCreateDetailDialog = false;
      this.searchByProperties();
    },
    dialogCloseStatistical() {
      this.showStatistical = false;
      this.searchByProperties();
    },
    printWindow() {
      window.print();
    },
    createDialogMethod() {
      this.$refs.CashInternalPayCreate.getDataInternalBeforeSelect();
      this.showCreateDialog = true;
    },
    viewStatistical() {
      this.$refs.StatisticalOutDialog.getDataInitial();
      this.showStatistical = true;
    },

    handleCommand(command) {
      if (command == "approve") {
        this.approveManyMethod(true, "duyệt");
      } else if (command == "unapprove") {
        this.approveManyMethod(false, "bỏ duyệt");
      } else if (command == "cancel") {
        this.cancelManyMethod();
      }
    },
    handleUpdate(row) {
      this.showUpdateDialog = true;
      this.$refs.CashInternalPayUpdate.getDataInitial(row.id);
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },

    approvedOneMethod(row, status) {
      CashInternalService.updateApproveOut(row.id, status)
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
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    handlePayment(row) {
      CashInternalService.updatePaymentOut(row.id)
        .then((resp) => {
          this.newFeedbackUpdate = resp.data.data;
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
    checkSelectRowList(rowList, text) {
      if (rowList.length == 0) {
        this.$message({
          message: "Không có phiếu chi nào được chọn ở trạng thái " + text,
          type: "error",
        });
        throw null;
      }
    },
    cancelManyMethod() {
      let selectRowList = this.multipleSelection.filter(
        (x) => !x.canceled && !x.approved && !x.payment
      );
      this.checkSelectRowList(selectRowList, "chưa hủy");
      this.$confirm(
        "Bạn có chắc chắn muốn hủy cho " +
          selectRowList.length +
          " phiếu chi đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        let dataInput = {
          status: false,
          idList: selectRowList.map((x) => x.id),
        };
        CashInternalService.cancelManyOut(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.searchByProperties();
              this.loadingButton = false;
            }, 500);
          });
      });
    },

    approveManyMethod(status, text) {
      let selectRowList = this.multipleSelection.filter(
        (x) => !x.canceled && !x.payment && x.approved != status
      );
      let textAlert = status ? "chưa duyệt" : "duyệt";
      this.checkSelectRowList(selectRowList, textAlert);
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " phiếu chi đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        let dataInput = {
          status: status,
          idList: selectRowList.map((x) => x.id),
        };
        CashInternalService.updateApproveManyOut(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.searchByProperties();
              this.loadingButton = false;
            }, 500);
          });
      });
    },
    approveCash() {
      let a = this.multipleSelection;
      console.log(a);
      if (a.length == 0) {
        this.$message({
          message: "Không có phiếu chi nào được chọn",
          type: "error",
        });
        return;
      }
      if (a.length >= 1) {
        CashInternalService.updateApproveManyOut(a)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.searchByProperties();
              this.loadingButton = false;
            }, 500);
          });
      }
      this.searchByProperties();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
      this.searchSmsAppTeacher();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
      this.searchSmsAppTeacher();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }
      this.loadingData = true;
      this.textTable = "";
      CashInternalService.searchInteralPay(
        this.pageNumber,
        this.maxPageItem,
        this.dateStartEnd,
        this.dataSearch.status,
        this.dataSearch.code
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.feedbacklist = resp.data.data.responseList;
          this.a = resp.data.data.totalMoney;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
          this.pageTotal = 1;
          this.feedbacklist = [];
        })
        .finally(() => {
          if (this.feedbacklist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    // click xem
    handleViewDetail(row) {
      this.showCreateDetailDialog = true;
      this.$refs.CashInternalDetail.getDataInitial(row.id);
    },
  },

  beforeMount() {
    this.searchByProperties();
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

.el-range-editor.el-input__inner {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  width: 260px;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group--append .el-input__inner,
.el-input-group__prepend {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-left: 5px;
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
/deep/.el-button--success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
  min-width: 90px;
}
/deep/.el-button--warning {
  color: #fff;
  background-color: #e6a23c;
  border-color: #e6a23c;
  min-width: 90px;
}
/deep/.el-button--info.is-disabled,
.el-button--info.is-disabled:active,
.el-button--info.is-disabled:focus,
.el-button--info.is-disabled:hover {
  color: #fff;
  background-color: #c8c9cc;
  border-color: #c8c9cc;
  width: 90px;
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
