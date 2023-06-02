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
          @change="getAllFeedBack()"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
        ></el-date-picker>
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
          prop="nameUserSend"
          label="Người gửi"
          align="left"
        ></el-table-column>
        <el-table-column label="Ngày khởi tạo" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Ngày sẽ gửi" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.timeAlarm | formatDateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="statusSend"
          label="Trạng thái"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="smsNumber"
          label="Tổng số sms"
          align="center"
        ></el-table-column>

        <el-table-column label="Số người nhận " width="150" align="center ">
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
              @click="handleViewcoutUserSent(scope.$index, scope.row)"
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
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="Tác vụ"
          width="180"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewSms(scope.$index, scope.row)"
              >Xem</el-button
            >
            <el-button
              autofocus
              v-if="checkPermission(['notifyHistory_schedule_update'])"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              Hủy gửi</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <ViewSmsdule
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewSmsdule"
    />

    <ViewCoutUserSent
      :dialogVisible="showCreateDialogViewCoutUserSent"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewCoutUserSent"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ViewSmsdule from "./ViewSmsdule.vue";
import ViewCoutUserSent from "./ViewCoutUserSent.vue";
import FeedBackService from "@/services/FeedBackService";
import HistorySmsService from "@/services/HistorySmsService";
export default {
  components: {
    ViewSmsdule,
    ViewCoutUserSent,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      showCreateDialog: false,
      showCreateDialogViewCoutUserSent: false,
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
        statusread: "",
        hidestatus: "",
        feedbackTitle: "",
      },
    };
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
    dialogCloseShowMethodU() {
      this.getAllFeedBack();
      this.showCreateDialogViewCoutUserSent = false;
    },

    getAllFeedBack() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }
      this.loadingData = true;
      this.textTable = "";
      FeedBackService.searchSchedule(
        this.dataSearch.hidestatus,
        this.dataSearch.statusread,
        this.dateStartEnd,
        this.dataSearch.feedbackTitle
      )
        .then((resp) => {
          this.feedbacklist = resp.data.data.smsSendResponses;
        })
        .catch((err) => {
          this.feedbacklist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.feedbacklist == null || this.feedbacklist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn hủy gửi tin nhắn đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        HistorySmsService.delete(row.id).then((response) => {
          console.log(response);
          this.$message({
            message: "Hủy gửi tin nhắn thành công",
            type: "success",
          });
          setTimeout(() => {
            this.getAllFeedBack();
          }, 500);
        });
      });
    },
    handleViewSms(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewSmsdule.getDetailMethod(row.id);
    },
    handleViewcoutUserSent(index, row) {
      this.showCreateDialogViewCoutUserSent = true;
      this.$refs.ViewCoutUserSent.getDetailMethodabc(row.id);
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
  /deep/.content .button-click-left[data-v-14071a78] {
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
  // /deep/.el-table .cell {
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: pre-line;
  //   word-break: break-all;
  //   line-height: 23px;
  //   padding-right: 10px;
  //   max-height: 50px;
  //   text-overflow: ellipsis;
  // }
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
  /deep/.el-table th > .cell {
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
