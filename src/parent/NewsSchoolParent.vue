<template>
  <div class="content">
    <div style="float: left" class="row-data">
      <el-date-picker
        class="button-left-class"
        style="width: 255px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.dateList"
        type="daterange"
        unlink-panels
        range-separator="-"
        @change="searchHeaderMethod()"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
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
    <div class="table-content row-data">
      <el-table
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="responseDataList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        border
        :max-height="$tableMaxHeight"
      >
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdDate"
          width="140px"
          label="Thời gian"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop width="170px" label="Người gửi"
          ><template slot-scope="scope">
            <span>{{ scope.row.createdBy }}</span>
          </template></el-table-column
        >
        <el-table-column
          width="250px"
          prop="title"
          label="Tiêu đề"
          class-name="contentText"
        ></el-table-column>
        <el-table-column
          min-width="400px"
          prop="content"
          label="Nội dung"
          class-name="contentText"
        ></el-table-column>
        <el-table-column width="200px" prop label="File đính kèm"
          ><template slot-scope="scope">
            <el-upload
              :file-list="scope.row.notifySchoolAttachFileList"
              :on-preview="downloadFile"
            >
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
      title="Chi tiết tin tức"
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
        <el-upload
          :file-list="rowDetailData.notifySchoolAttachFileList"
          :on-preview="downloadFile"
        >
        </el-upload>
      </div>
      <br />
    </el-dialog>
  </div>
</template>

<script>
import ParentService from "@/services/ParentService";
// import CreateNotifySchool from "./CreateNotifySchool.vue";
// import UpdateNotifySchool from "./UpdateNotifySchool.vue";
export default {
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      responseDataList: [],
      multipleSelection: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showDetailDialog: false,
      rowDetailData: {},
      activeList: [
        { key: true, value: "Đã hiển thị" },
        { key: false, value: "Chưa hiển thị" },
      ],
      dataSearch: {
        active: "",
        dateList: "",
        title: "",
        content: "",
      },
    };
  },
  methods: {
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    dialogCloseListReceiverMethod() {
      this.showListReceiver = false;
    },
    dialogCloseViewContentMethod() {
      this.showContentNotify = false;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
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
      ParentService.downloadFileNews(id)
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
    viewNotifyParentOne(row) {
      this.showDetailDialog = true;
      this.rowDetailData = this.responseDataList.filter((x) => x.id == row.id)[0];
    },
    handleSendNotify(command) {
      let listNotify = this.multipleSelection;
      if (listNotify.length == 0) {
        this.$message({
          message: "Không có thông báo nào được chọn",
          type: "error",
        });
        return;
      }
      if (command == "deleteNotifyApp") {
        this.deleteNotifyApp(listNotify);
      }
    },
    createNotifyDialog() {
      this.showCreateDialog = true;
      //   this.$refs.CreateNotifySchool.getAllSchool(this.dataSearch.idAgent);
    },
    //click edit at row
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateNotifySchool.getDataInitial(row.id);
    },

    // click xem
    handleViewDetail(index, row) {
      this.sendContentNotify = row.sendContent;
      this.showContentNotify = true;
    },

    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa tin tức đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        ParentService.deleteNotifySchool(row.id)
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

    clickTitle(row) {
      this.$refs.UpdateStudent.getDataInitial(row.id);
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
    },

    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = "";
      }
      this.loadingData = true;
      ParentService.searchNotifySchoolParent(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.active,
        this.dataSearch.dateList,
        this.dataSearch.title,
        this.dataSearch.content
      )
        .then((resp) => {
          this.responseDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.responseDataList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /*
     * Trạng thái active
     */
    getActiveNotifySchool(row) {
      let data = {
        id: row.id,
        active: row.active,
      };
      ParentService.getActiveNotifySchool(data)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
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
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click {
    text-align: right;
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
  .content .row-data {
    margin-bottom: 20px;
  }
  /deep/.el-table th {
    padding: 10px 0;
  }
  /deep/.el-table td,
  /deep/.el-table th {
    padding: 6px 0;
  }
}
.button-left-class {
  margin-right: 5px;
  width: 140px;
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
/deep/tbody .contentText .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
