<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left">
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
      </div>
      <div class="button-click">
        <el-button
          type="success"
          style="border-radius: 0"
          @click="handleSmsCustomExcelDialog('firebaseType')"
          >Gửi qua App
        </el-button>
        <el-button
          type="success"
          style="border-radius: 0"
          @click="handleSmsCustomExcelDialog('smsType')"
          >Gửi qua SMS
        </el-button>
      </div>
    </div>

    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="feedbacklist"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="createdBy"
          label="Người gửi"
          align="left"
        ></el-table-column>
        <el-table-column label="Thời gian gửi" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendContent"
          label="Tiêu đề gửi"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="coutSms"
          width="150"
          label="Tổng số sms"
          align="center"
        ></el-table-column>

        <el-table-column label="Thành công " width="150" align="center ">
          <template slot-scope="scope">
            <span>{{ scope.row.coutSuccess }}</span>
            <el-button
              v-if="scope.row.coutSuccess !== 0"
              type="text"
              style="color: #67c23a; text-decoration: underline; margin-left: 10px"
              @click="handleViewCoutUserSentSmsHistory(scope.$index, scope.row)"
              >(Xem)</el-button
            >
          </template>
        </el-table-column>

        <el-table-column label="Thất bại" width="150" align="center ">
          <template slot-scope="scope">
            <span>{{ scope.row.coutFail }}</span>
            <el-button
              v-if="scope.row.coutFail !== 0"
              type="text"
              style="color: #67c23a; text-decoration: underline; margin-left: 10px"
              @click="handleViewCoutUserSentSmsHistoryFail(scope.$index, scope.row)"
              >(Xem)</el-button
            >
          </template>
        </el-table-column>

        <el-table-column label="Số người nhận" width="150" align="center ">
          <template slot-scope="scope">
            <span>{{ scope.row.coutAll }}</span>
            <el-button
              v-if="scope.row.coutAll !== 0"
              type="text"
              style="color: #67c23a; text-decoration: underline; margin-left: 10px"
              @click="handleViewCoutUserSentSmsHistoryAll(scope.$index, scope.row)"
              >(Xem)</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data" style="float: right; margin-bottom: 10px">
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
    <ViewContentSms
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewContentSms"
    />

    <ViewSmsCustomSuccess
      :dialogVisible="showCreateDialogViewCoutUserSentSmsHistory"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewSmsCustomSuccess"
    />
    <ViewSmsCustomFail
      :dialogVisible="showCreateDialogViewCoutUserSentSmsHistoryFail"
      @dialog-close="dialogCloseShowMethodFail()"
      ref="ViewSmsCustomFail"
    />
    <ViewSmsCustomAll
      :dialogVisible="showCreateDialogViewCoutUserSentSmsHistoryAll"
      @dialog-close="dialogCloseShowMethodAll()"
      ref="ViewSmsCustomAll"
    />
    <SmsCustomExcelDialog
      :dialogVisible="showSmsCustomExcelDialog"
      @dialog-close="dialogCloseShowExcel()"
      ref="SmsCustomExcelDialog"
    />
  </div>
</template>

<script>
import ViewContentSms from "./ViewContentSms.vue";
import ViewSmsCustomSuccess from "./ViewSmsCustomSuccess.vue";
import ViewSmsCustomFail from "./ViewSmsCustomFail.vue";
import ViewSmsCustomAll from "./ViewSmsCustomAll.vue";
import SmsCustomExcelDialog from "./SmsCustomExcelDialog.vue";
import HistorySmsService from "@/services/HistorySmsService";
export default {
  components: {
    ViewContentSms,
    ViewSmsCustomSuccess,
    ViewSmsCustomFail,
    ViewSmsCustomAll,
    SmsCustomExcelDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      showCreateDialog: false,
      showCreateDialogViewCoutUserSentSmsHistory: false,
      showCreateDialogViewCoutUserSentSmsHistoryFail: false,
      showCreateDialogViewCoutUserSentSmsHistoryAll: false,
      showSmsCustomExcelDialog: false,
      activeName: "AddHeightWeight",
      showAdd: true,
      multipleSelection: [],
      dateStartEnd: [],
      statusread: [
        { status: true, label: "Đã đọc" },
        { status: false, label: "Chưa đọc" },
      ],
      hidestatus: [
        { status: true, label: "Ẩn danh" },
        { status: false, label: "Không ẩn danh" },
      ],
      feedbacklist: [],
      dataSearch: {
        dateStartEnd: "",
        typeSend: "",
      },
    };
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    closeDialog() {
      this.$refs["formAllTabStudent"].resetFields();
      this.$emit("dialog-close");
      this.getAllFeedBack();
    },

    dialogCloseShowMethod() {
      this.getAllFeedBack();
      this.showCreateDialog = false;
    },
    dialogCloseShowMethodFail() {
      this.getAllFeedBack();
      this.showCreateDialogViewCoutUserSentSmsHistoryFail = false;
    },
    dialogCloseShowMethodAll() {
      this.getAllFeedBack();
      this.showCreateDialogViewCoutUserSentSmsHistoryAll = false;
    },
    dialogCloseShowExcel() {
      this.showSmsCustomExcelDialog = false;
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllFeedBack();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllFeedBack();
    },
    dialogCloseShowMethodU() {
      this.getAllFeedBack();
      this.showCreateDialogViewCoutUserSentSmsHistory = false;
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.getAllFeedBack();
    },
    getAllFeedBack() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }
      this.loadingData = true;
      this.textTable = "";
      HistorySmsService.searchSmsCustom(
        this.pageNumber,
        this.maxPageItem,
        this.dateStartEnd,
        this.dataSearch.typeSend
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
          if (this.feedbacklist == null || this.feedbacklist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
      this.showCreateDialog = false;
      this.showCreateDialogViewCoutUserSentSmsHistory = false;
      this.showCreateDialogViewCoutUserSentSmsHistoryFail = false;
    },
    //click delete at row

    handleViewSms(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewContentSms.getDetailMethod(row.id);
    },
    handleViewCoutUserSentSmsHistory(index, row) {
      this.showCreateDialogViewCoutUserSentSmsHistory = true;
      this.$refs.ViewSmsCustomSuccess.getDetailMethodabc(row.id);
    },
    handleViewCoutUserSentSmsHistoryFail(index, row) {
      this.showCreateDialogViewCoutUserSentSmsHistoryFail = true;
      this.$refs.ViewSmsCustomFail.getDetailMethodFail(row.id);
    },
    handleViewCoutUserSentSmsHistoryAll(index, row) {
      this.showCreateDialogViewCoutUserSentSmsHistoryAll = true;
      this.$refs.ViewSmsCustomAll.getDetailMethodAll(row.id);
    },
    handleSmsCustomExcelDialog(sendType) {
      this.showSmsCustomExcelDialog = true;
      this.$refs.SmsCustomExcelDialog.getDataInitialSend(sendType);
    },
  },
  beforeMount() {
    this.getAllFeedBack();
  },
};
</script>
<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .zz {
    font-size: 10px;
    height: 17px;
    padding: 3px 0px;
    margin-top: 5px;
  }
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
    margin-bottom: 20px;
  }
  .button-click {
    float: right;
  }
  /deep/.content .button-click-left {
    display: inline-block;
    margin-bottom: 20px !important;
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
  //   margin-top: -1px;
  // }
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    max-height: 50px;
    text-overflow: ellipsis;
  }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
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
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 5px;
    // margin-top: 5px;
  }
  .el-input-group {
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
</style>
