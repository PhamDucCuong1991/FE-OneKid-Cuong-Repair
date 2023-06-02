<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left">
        <el-select
          class="button-left"
          v-model="dataSearch.statusAppSend"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
          clearable
        >
          <el-option
            v-for="item in statusAppSend"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>

        <div class="block">
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
            v-model="dataSearch.sendContent"
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
      </div>

      <div class="button-click row-data">
        <el-button
          class="button-over"
          type="success"
          :loading="loaddingButton"
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
        :data="notificationlist"
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
        <el-table-column label="Thời gian" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendTitle"
          label="Tiêu đề"
          width="300"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="sendContent"
          label="Nội dung"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="numberFile"
          label="Số file"
          width="80"
          align="center"
        >
        </el-table-column>

        <el-table-column label="Tác vụ" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Xem</el-button
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
    <view-content
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseShowMethod()"
      ref="ViewContent"
    />
  </div>
</template>
<script>
import ViewContent from "./ViewContent.vue";
import AppSendService from "@/services/AppSendService";

export default {
  components: {
    ViewContent,
  },
  data() {
    return {
      loadingData: true,
      loaddingButton: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],

      multipleSelection: [],
      user_unread: "",
      showCreateDialog: false,
      notificationlist: [],
      statusAppSend: [
        // { status: true, label: "Đã đọc" },
        // { status: false, label: "Chưa đọc" },
        {
          key: "yes",
          value: "Đã đọc",
        },
        {
          key: "no",
          value: "Chưa đọc",
        },
      ],
      dateStartEnd: "",
      dataSearch: {
        statusAppSend: "",
        sendContent: "",
        user_unread: "",
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
    // tableRowStyle({ row }) {
    //   if (!row.receiversList[0].userUnread) {
    //     return "color: #409EFF";
    //   }
    // },  // trạng thái đọc
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableRowStyle({ row }) {
      if (!row.userUnread) {
        return "color: #409EFF";
      }
    },
    dialogCloseShowMethod() {
      this.showCreateDialog = false;
      this.getAllAppSend();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${
          files.length
        } files this time, add up to ${files.length + fileList.length} totally`
      );
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.getAllAppSend();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getAllAppSend();
    },
    handleChange(file, fileList) {
      this.fileInputList = fileList.filter((x) => x.id == undefined);
    },

    // beforeRemove(file, fileList) {
    //   return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    // },
    // click xem
    handleViewDetail(index, row) {
      this.dataSearch.user_unread = true;
      this.showCreateDialog = true;
      this.$refs.ViewContent.getDetailMethod(row.id);
    },
    searchOnFEMethod() {
      if (this.seachOnFE.user_unread != "") {
        this.searchOnFEMethod();
      }
      let data = this.dataSearch.statusAppSend;
      if (data != "") {
        if (data == "yes") data = true;
        if (data == "no") data = false;
        this.notificationlist = this.notificationlist.filter((x) => {
          return x.receiversList[0].user_unread == data;
        });
      }
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
        this.loaddingButton = true;
        AppSendService.updateRead(a)
          .then((resp) => {
            console.log(resp);
            this.$message({
              message: "Duyệt đã đọc thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllAppSend();
            }, 100).catch((err) => {
              console.log(err);
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButton = false;
            }, 500);
          });
      }
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.getAllAppSend();
    },
    getAllAppSend() {
      if (this.dateStartEnd == null) {
        this.dateStartEnd = [];
      }
      this.loadingData = true;
      this.textTable = "";
      AppSendService.searchAppSend(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.statusAppSend,
        this.dateStartEnd,
        this.dataSearch.sendContent
      )
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.notificationlist = resp.data.data.appSendResponse;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.notificationlist = null;
          console.log(err);
        })
        .finally(() => {
          if (
            this.notificationlist == null ||
            this.notificationlist.length == 0
          ) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },
  beforeMount() {
    this.getAllAppSend();
    // this.searchOnFEMethod();
  },
};
</script>
<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .hasagi {
    float: right;
    margin-top: 20px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .block {
    margin-top: -40px;
  }

  .button-left {
    margin-right: 5px;
    width: 140px;
  }
  .button-click-left {
    display: inline-block;
    // margin-top: -20px;
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

  /deep/.content .button-click-left[data-v-798adef2] {
    display: inline-block;
    margin-left: -150px !important;
  }
  /deep/.el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 260px;
  }
  .button-left-class {
    margin-left: 2px;
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
  /deep/.el-upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
    margin-top: -35px;
  }

  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    margin-left: 2px;
  }
  /deep/.el-table th > .cell {
    text-align: center !important;
  }
}
</style>
