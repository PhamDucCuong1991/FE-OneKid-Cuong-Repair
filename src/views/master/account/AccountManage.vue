<template>
  <div class="content">
    <div>
      <!-- button left -->
      <div class="button-click-left">
        <!-- trạng thái xóa -->
        <el-select
          class="button-left-class"
          v-model="dataSearch.deleteStatus"
          placeholder="Chọn trạng thái"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in deleteList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <el-select
          v-if="dataSearch.deleteStatus == 'deleteComplete'"
          class="button-left-class"
          v-model="dataSearch.typeDelete"
          placeholder="Kiểu xóa"
          clearable
          @change="searchHeaderMethod()"
        >
          <el-option value="manual" label="Xoay bằng tay"></el-option>
          <el-option value="handle" label="Xoay xử lý"></el-option>
          <el-option value="auto" label="Xoay tự động"></el-option>
        </el-select>
        <el-select
          v-else
          class="button-left-class"
          v-model="dataSearch.typeChildren"
          placeholder="Dạng tài khoản"
          clearable
          @change="searchHeaderMethod()"
        >
          <el-option value="yes" label="Có info"></el-option>
          <el-option value="no" label="Không có info"></el-option>
        </el-select>
        <!-- appType list -->
        <el-select
          class="button-left-class"
          v-model="dataSearch.appType"
          @change="searchHeaderMethod()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in appTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <el-select
          class="button-left-class"
          v-model="dataSearch.active"
          placeholder="Chọn trạng thái"
          clearable
          @change="searchHeaderMethod()"
        >
          <el-option value="true" label="Đã kích hoạt"></el-option>
          <el-option value="false" label="Chưa kích hoạt"></el-option>
        </el-select>
        <!-- name or phone -->
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="dataSearch.nameOrPhone"
          @clear="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>

      <!-- button action -->
      <div class="button-click-right row-data"></div>
    </div>

    <!-- nội dung thông tin chính -->
    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="tableDataList"
        highlight-current-row
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          prop="fullName"
          label="Họ tên"
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="createdDate"
          label="Thời gian tạo"
          align="center"
          min-width="135"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Ngày quét xóa"
          width="135"
          align="center"
          v-if="dataSearch.deleteStatus == 'deleteTrue'"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.startDateDelete | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          prop="timeDelete"
          label="Thời gian xóa"
          align="center"
          width="135"
        >
          <template slot-scope="scope">
            <span v-if="dataSearch.deleteStatus == 'deleteFalse'">{{
              scope.row.timeDelete | formatDateTime
            }}</span>
            <span v-if="dataSearch.deleteStatus == 'deleteComplete'">{{
              scope.row.timeDeleteComplete | formatDateTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="Username" width="150"></el-table-column>
        <el-table-column
          prop="passwordShow"
          label="Password"
          width="150"
        ></el-table-column>
        <el-table-column align="center" label="Số thiết bị OneKids" width="85">
          <template slot-scope="scope">
            <el-button
              style="width: 50px"
              v-if="scope.row.deviceLoginList.length > 0"
              type="text"
              @click="deviceLoginMethod(scope.row)"
              ><u>{{ scope.row.deviceLoginList.length }}</u></el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="Số thiết bị OneCam" width="85">
          <template slot-scope="scope">
            <el-button
              style="width: 50px"
              v-if="scope.row.deviceCamList.length > 0"
              type="text"
              @click="deviceOneCamMethod(scope.row)"
              ><u>{{ scope.row.deviceCamList.length }}</u></el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="dataSearch.deleteStatus == 'deleteComplete'"
          align="center"
          prop="extendUsername"
          label="Số"
          width="50"
        >
        </el-table-column>
        <el-table-column
          v-if="dataSearch.deleteStatus == 'deleteComplete'"
          align="center"
          label="Kiểu xóa"
          width="110"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.typeDelete == 'manual'">Xóa bằng tay</span>
            <span v-if="scope.row.typeDelete == 'handle'">Xóa xử lý</span>
            <span v-if="scope.row.typeDelete == 'auto'">Xóa tự động</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="SĐT"
          width="110"
        ></el-table-column>
        <el-table-column align="center" label="Kích hoạt" width="90">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.activated"
              effect="dark"
              content="Đã kích hoạt"
              placement="top"
            >
              <i class="el-icon-circle-check" style="margin-left: 10px; color: #409eff" />
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="Chưa kích hoạt" placement="top">
              <i class="el-icon-circle-check" style="margin-left: 10px; color: red" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Dùng thử" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.trialStatus">
              <i class="el-icon-circle-check" style="margin-left: 10px; color: #409eff" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Tác vụ"
          :width="dataSearch.deleteStatus == 'deleteComplete' ? 130 : 250"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="dataSearch.deleteStatus == 'deleteTrue'"
              style="width: 65px"
              size="mini"
              type="warning"
              @click="deleteAccountMethod(scope.row)"
              >Xóa</el-button
            >
            <el-button
              v-if="dataSearch.deleteStatus != 'deleteComplete'"
              style="width: 85px"
              size="mini"
              type="danger"
              @click="deleteCompleteMethod(scope.row)"
              >Xóa hẳn</el-button
            >
            <el-button
              size="mini"
              v-if="dataSearch.deleteStatus == 'deleteTrue'"
              type="primary"
              @click="handleEdit(scope.row)"
              >Sửa</el-button
            >

            <el-button
              v-if="dataSearch.deleteStatus != 'deleteTrue'"
              size="mini"
              type="success"
              @click="restoreAccountMethod(scope.row)"
              >Khôi phục</el-button
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
    <AccountUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AccountUpdate"
    />
    <DeviceLoginDialog
      :dialogVisible="showDeviceLoginDialog"
      :dataTransfer="dataTransferDeviceLogin"
      @dialog-close="closeDeviceLoginDialogMethod()"
    />
    <DeviceOneCamDialog
      :dialogVisible="showDeviceOneCamDialog"
      :dataTransfer="oneCamTransferDeviceLogin"
      @dialog-close="closeDeviceOneCamDialogMethod()"
    />
  </div>
</template>

<script>
import AccountService from "@/services/AccountService";
import AccountUpdate from "./AccountUpdate.vue";
import DeviceLoginDialog from "./DeviceLoginDialog.vue";
import DeviceOneCamDialog from "./DeviceOneCamDialog.vue";

export default {
  components: {
    AccountUpdate,
    DeviceLoginDialog,
    DeviceOneCamDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      tableDataList: [],
      showUpdateDialog: false,
      showDeviceLoginDialog: false,
      showDeviceOneCamDialog: false,
      dataTransferDeviceLogin: [],
      oneCamTransferDeviceLogin: [],
      dataSearch: {
        deleteStatus: "deleteTrue",
        appType: "parent",
        active: "",
        nameOrPhone: "",
        typeDelete: "",
        typeChildren: "",
      },
      deleteList: [
        { key: "deleteTrue", value: "Chưa xóa" },
        { key: "deleteFalse", value: "Đã xóa" },
        { key: "deleteComplete", value: "Đã xóa hẳn" },
      ],
      appTypeList: [
        { key: "plus", value: "Nhà trường" },
        { key: "teacher", value: "Giáo viên" },
        { key: "parent", value: "Phụ huynh" },
      ],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (!row.activated) {
        return "color:  red";
      }
    },

    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    closeDeviceLoginDialogMethod() {
      this.showDeviceLoginDialog = false;
      this.searchByProperties();
    },
    closeDeviceOneCamDialogMethod() {
      this.showDeviceOneCamDialog = false;
      this.searchByProperties();
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
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.AccountUpdate.getDataInitial(row);
    },
    //click delete at row
    deleteAccountMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa tài khoản đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AccountService.deleteAccountUser(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    //click delete at row
    deleteCompleteMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa hẳn tài khoản đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AccountService.deleteCompleteAccountUser(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    //click delete at row
    restoreAccountMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn khôi phục tài khoản đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AccountService.restoreAccountUser(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    deviceLoginMethod(row) {
      this.showDeviceLoginDialog = true;
      this.dataTransferDeviceLogin = row.deviceLoginList;
    },
    deviceOneCamMethod(row) {
      this.showDeviceOneCamDialog = true;
      this.oneCamTransferDeviceLogin = row.deviceCamList;
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      AccountService.findAccountUser(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.appType,
        this.dataSearch.active,
        this.dataSearch.nameOrPhone,
        this.dataSearch.typeDelete,
        this.dataSearch.typeChildren
      )
        .then((resp) => {
          this.tableDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.tableDataList = [];
          this.pageTotal = 1;
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.tableDataList.length == 0) {
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
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-pagination .el-select .el-input {
  width: 75px;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
.click-number-teacher {
  border: none;
  padding: 0;
  color: blue;
}
.click-number-teacher:hover {
  color: blue;
  background: none;
}
.button-left-class {
  margin-right: 5px;
  width: 150px;
}
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click-left {
    display: inline-block;
    margin-bottom: 20px;
  }
  .button-click-right {
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
}
</style>
