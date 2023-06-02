<template>
  <div>
    <div
      style="margin-top: 5px"
      v-if="checkPermission(['schoolConfig_accountType_update'])"
      class="button-click-right row-data"
    >
      <el-button
        class="button-over"
        type="success"
        @click="createDialogMethod()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
    </div>
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      highlight-current-row
      :data="responseList"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChangeMedia"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        width="250"
        label="Đối tượng"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="Mô tả đối tượng"
      ></el-table-column>
      <el-table-column label="Áp dụng" width="250">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.infoEmployeeSchoolList"
            :key="index"
          >
            {{ index + 1 }}, {{ item.fullName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['schoolConfig_accountType_update'])"
        label="Tác vụ"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="updateDialogMethod(scope.row)"
            >{{ $t("button.update") }}</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deleteOneMethod(scope.row)"
            >{{ $t("button.delete") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AccountTypeCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <AccountTypeUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AccountTypeUpdate"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";

import AccountTypeCreate from "./AccountTypeCreate";
import AccountTypeUpdate from "./AccountTypeUpdate";
export default {
  components: {
    AccountTypeCreate,
    AccountTypeUpdate,
  },
  data() {
    return {
      responseList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      loadingData: true,
      textTable: "",
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    updateDialogMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.AccountTypeUpdate.getDataInitial(row.id);
    },
    dialogCloseCreateMethod() {
      this.searchByProperties();
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },
    deleteOneMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa đối tượng đã chọn không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteAccountTypeById(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
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
    searchByProperties() {
      this.loadingData = true;
      SchoolConfigService.findAccountType()
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseList.length == 0) {
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
.button-click-right {
  float: right;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.row-data {
  margin-bottom: 20px;
}
</style>
