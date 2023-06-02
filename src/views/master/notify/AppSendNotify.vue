<template>
  <div class="content">
    <div style="float: left" class="button-click-left">
      <el-select
        class="button-left-class"
        v-model="dataSearch.idAgent"
        @change="changeAgentMethod()"
        placeholder="Chọn đại lý"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :value="item.id"
          :label="item.agentName"
        ></el-option>
      </el-select>

      <!-- chọn trường -->
      <el-select
        class="button-left-class"
        filterable
        clearable
        v-model="dataSearch.idSchool"
        placeholder="Chọn trường"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in schoolList"
          :key="item.id"
          :value="item.id"
          :label="item.schoolName"
        ></el-option>
      </el-select>
      <el-select
        class="button-left-class"
        v-model="dataSearch.sendType"
        @change="searchHeaderMethod()"
        placeholder="Kiểu gửi"
        style="margin-right: 5px"
        clearable
      >
        <el-option
          v-for="item in sendTypeList"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>

      <el-input
        v-model="dataSearch.title"
        style="width: 300px"
        placeholder="Nhập tiêu đề tìm kiếm"
        @clear="searchHeaderMethod()"
        clearable
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
        @click="createNotifyDialog()"
      >
        <i class="el-icon-plus" />
        Tạo thông báo
      </el-button>
      <el-dropdown @command="handleSendNotify">
        <el-button class="button-over" type="success">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item>Gửi qua App</el-dropdown-item>
          <!-- <el-dropdown-item>Gửi qua Email</el-dropdown-item> -->
          <el-dropdown-item>Gửi qua Sms</el-dropdown-item>
          <el-dropdown-item command="deleteNotifyApp"
            >Xóa thông báo</el-dropdown-item
          >
          <el-dropdown-item>Xuất danh sách</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
        <el-table-column type="selection" width="55"></el-table-column>
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
        <el-table-column
          prop="createdBy"
          width="170px"
          label="Người gửi"
        ></el-table-column>
        <el-table-column
          width="250px"
          prop="sendTitle"
          label="Tiêu đề"
        ></el-table-column>
        <el-table-column
          width="400px"
          prop="sendContent"
          label="Nội dung"
        ></el-table-column>
        <el-table-column
          width="100px"
          prop="fileNumber"
          label="Số File"
          align="center"
        ></el-table-column>
        <el-table-column prop label="DS người nhận" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleListReceiver(scope.$index, scope.row)"
              >Xem</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="160px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
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
    <CreateAppSendNotify
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateAppSendNotify"
    />
    <UpdateAppSendNotify
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateAppSendNotify"
    />
    <ListReceiver
      :dialogVisible="showListReceiver"
      @dialog-close="dialogCloseListReceiverMethod()"
      ref="ListReceiver"
    />
    <ViewContentNotify
      v-bind:sendContentNotify="sendContentNotify"
      :dialogVisible="showContentNotify"
      @dialog-close="dialogCloseViewContentMethod()"
      ref="ViewContentNotify"
    />
  </div>
</template>

<script>
import AppSendService from "../../../services/AppSendService";
import SchoolService from "@/services/SchoolService";
import AgentService from "@/services/AgentService";
import CreateAppSendNotify from "../notify/CreateAppSendNotify";
import UpdateAppSendNotify from "../notify/UpdateAppSendNotify";
import ListReceiver from "../notify/ListReceiver";
import ViewContentNotify from "../notify/ViewContentNotify";
import http from "../../../http-download";
export default {
  components: {
    CreateAppSendNotify,
    UpdateAppSendNotify,
    ListReceiver,
    ViewContentNotify,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      responseDataList: [],
      multipleSelection: [],
      showTransferDialog: false,
      departmentData: [],
      sendContentNotify: "",
      showCreateDialog: false,
      showUpdateDialog: false,
      showListReceiver: false,
      showExportDialog: false,
      showContentNotify: false,
      sendTypeList: [
        { status: "sys", label: "Hệ thống" },
        { status: "common", label: "Chung" },
        { status: "birthday", label: "Sinh nhật" },
        { status: "celebrate", label: "Ngày lễ" },
      ],
      dataSearch: {
        idAgent: "",
        idSchool: "",
        sendType: "",
        title: "",
      },
      appSendNotifyList: [],
      // fileList: [],
    };
  },
  methods: {
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      // this.$router.go("/master/notify/notify-onekids");
      // location.reload()
      // setTimeout(() => {
      this.searchByProperties();
      this.$refs.upload.clearFiles();
      // }, 500);
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
    //highlight cho row theo điều kiện
    tableRowStyle({ row }) {
      console.log(row);
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
      // else if (command == "sMSregisterReceive") {
      //   this.actionActiveSMSMethod(kidList);
      // }
    },
    deleteNotifyApp(listNotify) {
      let listId = [];
      listNotify.forEach((x) => {
        listId.push(x.id);
      });
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thông báo gửi đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        AppSendService.delateAppSendNotifyById(listId).then(() => {
          this.$message({
            message: "Xóa thông báo thành công",
            type: "success",
          });
          this.searchByProperties();
        });
      });
    },
    createNotifyDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateAppSendNotify.getAllSchool(this.dataSearch.idAgent);
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateAppSendNotify.getAppSendNotifyByRow(row);
      // this.$refs.UpdateAppSendNotify.getAllAgent();
      this.$refs.UpdateAppSendNotify.getAllSchool();
    },
    handleListReceiver(index, row) {
      this.showListReceiver = true;
      this.$refs.ListReceiver.getAllReceiversNotify(row.id);
    },
    handleDelete(index, row) {
      // console.log("delete " + index, row);
      let list = [];
      list.push(row.id);
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thông báo gửi đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        AppSendService.delateAppSendNotifyById(list).then(() => {
          this.$message({
            message: "Xóa thông báo thành công",
            type: "success",
          });
          this.searchByProperties();
        });
      });
    },

    // click xem
    handleViewDetail(index, row) {
      this.sendContentNotify = row.sendContent;
      this.showContentNotify = true;
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
      this.loadingData = true;
      AppSendService.getAllAppSendNotifyAdmin(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.sendType,
        this.dataSearch.title
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
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlAppSendFile = file.id;
      this.downloadItem(label, extensionFile, idUrlAppSendFile);
    },
    downloadItem(label, extensionFile, idUrlAppSendFile) {
      http
        .get(`/appsend-notify/download/${idUrlAppSendFile}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label + "." + extensionFile);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thất bại",
            type: "error",
          });
        });
    },
    /**
     * thay đổi đại lý
     */
    async changeAgentMethod() {
      await this.getSchoolMethod();
      this.searchHeaderMethod();
    },

    /**
     * danh sách đại lý
     */
    async getAgentMethod() {
      await AgentService.getAllCommon()
        .then((resp) => {
          this.agentList = resp.data.data;
          if (this.agentList.length > 0) {
            this.dataSearch.idAgent = this.agentList[0].id;
          }
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * danh sách trường theo đại lý đã chọn
     */
    async getSchoolMethod() {
      await SchoolService.getSchoolInAgent(this.dataSearch.idAgent)
        .then((resp) => {
          this.schoolList = resp.data.data;
          this.dataSearch.idSchool = "";
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      await this.getAgentMethod();
      await Promise.all([this.getSchoolMethod()])
        .then((resp) => {
          console.log(resp);
          this.searchByProperties();
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
    this.fetchDataMany();
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
</style>
