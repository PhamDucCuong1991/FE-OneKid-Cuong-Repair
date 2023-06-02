<template>
  <div class="content">
    <div style="float: left" class="button-click-left">
      <!-- <el-select
        @change="getAllAppSendNotify"
        v-model="dataSearch.appType"
        class="button-left"
        placeholder="Đối tượng nhận"
        clearable
      >
        <el-option
          v-for="item in appTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select> -->
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

      <el-select
        class="button-left-class"
        v-model="dataSearch.dateSick"
        @change="getAllFeedBack()"
        placeholder="Kiểu gửi"
        style="margin-left: 5px"
        clearable
      >
        <el-option
          v-for="item in dateSick"
          :key="item.status"
          :value="item.status"
          :label="item.label"
        ></el-option>
      </el-select>
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
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table-content row-data">
      <el-table
        :data="tableDataFilter"
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
        <el-table-column prop="createdDate" label="Thời gian" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="Người gửi"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sendTitle"
          label="Tiêu đề"
          align="center"
        ></el-table-column>

        <el-table-column label="Nội dung" align="center">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.a }}</span> -->
            <el-button
              v-if="scope.row.sendContent != 0"
              size="mini"
              type="text"
              @click="handleViewDetail(scope.$index, scope.row)"
              >Xem</el-button
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
          label="Số lượng File"
          align="center"
        ></el-table-column>
        <!-- <el-table-column prop label="File đính kèm" align="center">
          <template slot-scope="scope">
            <el-upload
              class="upload-demo"
              action
              :on-preview="handleFileRequest"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="scope.row.fileAttachAppSendResponseList"
            >
              <el-button size="small" type="primary">Tải file lên</el-button> 
            </el-upload>
          </template>
        </el-table-column>-->
        <el-table-column prop label="Danh sách người nhận" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleListReceiver(scope.$index, scope.row)"
              >Xem</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="220" align="center">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageList"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
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
import HistorySmsService from "@/services/HistorySmsService";
import AppSendService from "@/services/AppSendService";
// import EmployeeDataService from "../../services/EmployeeDataService";
// import CreateAppSendNotify from "@/notifihistory/CreateAppSendNotify";
// import UpdateAppSendNotify from "../notifihistory/UpdateAppSendNotify";
import ListReceiver from "../notifihistory/ListReceiver";
// import ViewContentNotify from "../notifihistory/ViewContentNotify";
import http from "@/http-download";
export default {
  components: {
    // CreateAppSendNotify,
    // UpdateAppSendNotify,
    ListReceiver,
    // ViewContentNotify,
  },
  data() {
    return {
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      pageList: [2, 10, 20, 30, 40, 50],
      tableDataFilter: [],
      multipleSelection: [],
      showTransferDialog: false,
      departmentData: [],
      sendContentNotify: "",
      showCreateDialog: false,
      showUpdateDialog: false,
      showListReceiver: false,
      showExportDialog: false,
      showContentNotify: false,
      appTypeList: [
        {
          value: "teacher",
          name: "App Teacher",
        },
        {
          value: "plus",
          name: "App Plus",
        },
      ],
         dateSick: [
        { status: "sys", label: "Hệ thống" },
        { status: "common", label: "Chung" },
        { status: "Sinh nhật", label: "Sinh nhật" },
        // { status: "celebrate", label: "Ngày lễ" },
        // { status: "leave", label: "Điểm danh về" },
        // { status: "arrive", label: "Điểm danh đến" },
      ],
      dataSearch: {
        appType: "",
        title: "",
         dateSick: "",
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
      this.getAllAppSendNotify();
      this.$refs.upload.clearFiles();
      // }, 500);
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.getAllAppSendNotify();
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
      this.tableDataFilter = this.appSendNotifyList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.total = this.appSendNotifyList.length;
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilter = this.appSendNotifyList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
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
          this.getAllAppSendNotify();
        });
      });
    },
    createNotifyDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateAppSendNotify.getAllAgent();
      this.$refs.CreateAppSendNotify.getAllSchool();
      this.$refs.CreateAppSendNotify.getClassSearch();
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateAppSendNotify.getAppSendNotifyByRow(row);
      this.$refs.UpdateAppSendNotify.getAllAgent();
      this.$refs.UpdateAppSendNotify.getAllSchool();
      this.$refs.UpdateAppSendNotify.getClassSearch();
      // console.log("edit " + index, row);
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
          this.getAllAppSendNotify();
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
    getAllAppSendNotify() {
          HistorySmsService.searchSmsappsys(
        this.dataSearch.hidestatus,
        this.dataSearch.statusread,
        this.dateStartEnd,
        this.dataSearch.feedbackTitle,
        this.dataSearch.dateSick
      )
        .then((response) => {
          this.appSendNotifyList = response.data.data;
          this.tableDataFilter = this.appSendNotifyList.slice(0, this.pageSize);
          this.total = this.appSendNotifyList.length;
        })
        .catch((e) => {
          console.log(e);
          this.tableDataFilter = "";
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
  },
  beforeMount() {
    this.getAllAppSendNotify();
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