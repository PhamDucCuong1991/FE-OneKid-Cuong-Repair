<template>
  <div class="content">
    <div style="float: left">
      <el-select
        style="width: 135px; margin-right: 5px"
        v-model="dataSearch.active"
        @change="searchHeaderMethod()"
        clearable
        placeholder="Hiển thị"
      >
        <el-option
          v-for="item in activeList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>

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
        style="width: 270px"
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
        style="width: 270px"
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
      <el-button class="button-over" type="success" @click="createNotifyDialog()">
        <i class="el-icon-plus" />
        Tạo tin tức
      </el-button>
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
        <el-table-column width="90px" prop label="Số File" align="center"
          ><template slot-scope="scope">
            <span>{{ scope.row.notifySchoolAttachFileList.length }}</span>
          </template></el-table-column
        >
        <el-table-column prop="active" width="90px" label="Hiển thị" align="center"
          ><template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.active"
              @change="getActiveNotifySchool(scope.row)"
            ></el-checkbox> </template
        ></el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="160px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >Sửa</el-button
            >
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
              >Xóa</el-button
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
    <CreateNotifySchool
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateNotifySchool"
    />
    <UpdateNotifySchool
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateNotifySchool"
    />
  </div>
</template>

<script>
import NotifySchoolService from "@/services/NotifySchoolService";
import CreateNotifySchool from "./CreateNotifySchool.vue";
import UpdateNotifySchool from "./UpdateNotifySchool.vue";
export default {
  components: { CreateNotifySchool, UpdateNotifySchool },
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
    //
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
        NotifySchoolService.deleteNotifySchool(row.id)
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
      NotifySchoolService.searchNotifySchool(
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
      NotifySchoolService.getActiveNotifySchool(data)
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
</style>
