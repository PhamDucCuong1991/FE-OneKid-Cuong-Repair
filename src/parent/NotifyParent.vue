<template>
  <div class="content">
    <div>
      <div style="float: left" class="button-click-left">
        <el-date-picker
          v-model="dataSearch.dateList"
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
          placeholder="Nhập tiêu đề tìm kiếm"
          clearable
          v-model="dataSearch.title"
          @change="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
        <el-input
          class="button-left-class"
          style="width: 300px"
          placeholder="Nhập nội dung tìm kiếm"
          clearable
          v-model="dataSearch.content"
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

      <div class="button-click row-data">
        <el-button
          class="button-over"
          type="success"
          :loading="loaddingButton"
          @click="viewNotifyParentMany()"
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
        :data="responseList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
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
          prop="title"
          label="Tiêu đề"
          width="300"
          align="left"
        ></el-table-column>
        <el-table-column prop="content" label="Nội dung" align="left"></el-table-column>
        <el-table-column width="200px" prop label="File đính kèm"
          ><template slot-scope="scope">
            <el-upload :file-list="scope.row.fileList" :on-preview="downloadFile">
            </el-upload> </template
        ></el-table-column>

        <el-table-column label="Tác vụ" width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="viewNotifyParentOne(scope.row)"
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

    <el-dialog
      title="Chi tiết thông báo"
      :visible.sync="showDetailDialog"
      width="70%"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div style="font-family: arial">
        <span style="font-size: 17px; font-family: arial">Tiêu đề</span>
        <div>{{ rowDetailData.title }}</div>
      </div>
      <br />
      <div style="font-size: 17px; font-family: arial">Nội dung</div>
      <el-input
        type="textarea"
        :rows="13"
        v-model="rowDetailData.content"
        style="background-color: #f0f0f0"
      >
      </el-input>
      <br />
      <br />
      <div style="font-size: 17px; font-family: arial">File đính kèm</div>
      <br />
      <div>
        <el-upload :file-list="rowDetailData.fileList" :on-preview="downloadFile">
        </el-upload>
      </div>
      <br />
    </el-dialog>
  </div>
</template>
<script>
import ParentService from "@/services/ParentService";

export default {
  data() {
    return {
      loadingData: true,
      loaddingButton: false,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      multipleSelection: [],
      user_unread: "",
      showCreateDialog: false,
      showDetailDialog: false,
      rowDetailData: {},
      responseList: [],
      dateStartEnd: "",
      dataSearch: {
        title: "",
        content: "",
        dateList: [],
      },
    };
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
      this.searchByProperties();
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + fileList.length
        } totally`
      );
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
    downloadFile(file) {
      let id = file.id;
      let fileName = file.name;
      ParentService.downloadFileNotify(id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$message({
            message: "File không tồn tại",
            type: "error",
          });
        });
    },
    handleChange(file, fileList) {
      this.fileInputList = fileList.filter((x) => x.id == undefined);
    },
    handleViewDetail(index, row) {
      this.dataSearch.user_unread = true;
      this.showCreateDialog = true;
      this.$refs.ViewContent.getDetailMethod(row.id);
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
        ParentService.updateRead(a)
          .then((resp) => {
            console.log(resp);
            this.$message({
              message: "Duyệt đã đọc thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
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
      this.searchByProperties();
    },
    viewNotifyParentMany() {
      let idList = this.multipleSelection.map((x) => x.id);
      if (idList.length == 0) {
        this.$message({
          message: "Không có thông báo nào được chọn",
          type: "error",
        });
        throw null;
      }
      this.loaddingButton = true;
      this.viewNotifyParent(idList);
    },
    viewNotifyParentOne(row) {
      this.showDetailDialog = true;
      this.rowDetailData = this.responseList.filter((x) => x.id == row.id)[0];
      if (!row.userUnread) {
        this.viewNotifyParent(row.id);
      }
    },
    viewNotifyParent(idList) {
      ParentService.viewNotifyParent(idList)
        .then(() => {
          // this.$message({
          //   message: resp.data.message,
          //   type: "success",
          // });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButton = false;
          }, 300);
        });
    },
    searchByProperties() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = [];
      }
      this.loadingData = true;
      this.textTable = "";
      ParentService.getNotifyParent(this.pageNumber, this.maxPageItem, this.dataSearch)
        .then((resp) => {
          this.pageTotal = resp.data.data.total;
          this.responseList = resp.data.data.dataList;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.responseList = null;
          console.log(err);
        })
        .finally(() => {
          if (this.responseList == null || this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },
  beforeMount() {
    this.searchByProperties();
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
  /deep/.el-table .cell {
    overflow-y: auto;
    white-space: pre-line;
    word-break: break-word;
    padding-right: 10px;
    max-height: 50px;
    text-align: left;
  }
  /deep/.el-upload-list__item .el-icon-upload-success {
    color: #ffffff !important;
  }
  /deep/.el-upload-list__item .el-icon-close {
    display: none;
  }
}
</style>
