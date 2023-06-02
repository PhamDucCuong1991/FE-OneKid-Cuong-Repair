<template>
  <div class="content">
    <div>
      <div class="button-click-left">
        <el-select
          class="button-left"
          width:180
          v-model="dataSearch.hidestatus"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
          clearable
        >
          <el-option
            v-for="item in hidestatus"
            :key="item.status"
            :value="item.status"
            :label="item.label"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          v-model="dataSearch.statusread"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái đọc"
          clearable
        >
          <el-option
            v-for="item in statusread"
            :key="item.status"
            :value="item.status"
            :label="item.label"
          ></el-option>
        </el-select>

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

        <el-input
          class="button-left-class"
          style="width: 300px"
          placeholder="Nhập nội dung tìm kiếm"
          clearable
          v-model="dataSearch.feedbackTitle"
          @change="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>
      <div
        v-if="checkPermission(['news_feedbackParent_update'])"
        class="button-click row-data"
      >
        <el-button
          class="button-over"
          type="success"
          :loading="loadingButton"
          @click="approveSchoolUnread()"
          >Duyệt đã đọc</el-button
        >
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
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Thời gian" width="155" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdByUser"
          label="Người góp ý"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="replyName"
          label="Người trả lời"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="feedbackTitle"
          min-width="300"
          label="Tiêu đề"
        ></el-table-column>
        <el-table-column
          prop="numberFile"
          label="Số file"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="urlPicture"
          label="Trạng thái"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <span
              style="color: #303133"
              v-if="scope.row.schoolConfirmStatus == true"
              >Đã xác nhận</span
            >

            <span style="color: #f56c6c" type="text" v-else>Chưa xác nhận</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Chi tiết</el-button
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
    <ViewParentFeedback
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewParentFeedback"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import ViewParentFeedback from "./ViewParentFeedback.vue";
import FeedBackService from "@/services/FeedBackService";
export default {
  components: {
    ViewParentFeedback,
  },
  data() {
    return {
      loadingData: true,
      loadingButton: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      showCreateDialog: false,
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
    tableRowStyle({ row }) {
      if (!row.schoolUnread) {
        return "color: #409EFF";
      }
    },
    closeDialog() {
      this.$refs["formAllTabStudent"].resetFields();
      this.$emit("dialog-close");
      this.getAllFeedBack();
    },
    approveSchoolUnread() {
      let a = this.multipleSelection;
      console.log(a);
      if (a.length == 0) {
        this.$message({
          message: "Không có góp ý nào được chọn",
          type: "error",
        });
        return;
      }
      if (a.length >= 1) {
        this.loadingButton = true;
        FeedBackService.updateRead(a)
          .then((resp) => {
            console.log(resp);
            this.$message({
              message: "Duyệt đã đọc thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllFeedBack();
            }, 100).catch((err) => {
              console.log(err);
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButton = false;
            }, 500);
          });
      }
    },
    dialogCloseShowMethod() {
      this.getAllFeedBack();
      this.showCreateDialog = false;
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
      FeedBackService.searchFeedBack(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.hidestatus,
        this.dataSearch.statusread,
        this.dateStartEnd,
        this.dataSearch.feedbackTitle
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.feedbacklist = resp.data.data.feedBackResponses;
        })
        .catch((err) => {
          this.pageTotal = 1;
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

    handleViewDetail(index, row) {
      this.showCreateDialog = true;
      this.$refs.ViewParentFeedback.getDetailMethod(row.id);
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
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
    margin-bottom: 20px;
  }
  .button-click {
    margin-top: 5px;
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
  //   max-height: 50px;
  //   word-break: break-word;
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
    margin-left: 5px;
    // margin-top: 5px;
  }
  /deep/.el-dialog__title {
    line-height: 24px;
    font-size: 30px;
    color: #606266;
  }
  .el-input-group {
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-top: 5px;
  }
  /deep/.el-table th > .cell {
    text-align: center !important;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
</style>
