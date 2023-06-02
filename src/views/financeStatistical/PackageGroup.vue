<template>
  <div>
    <div>
      <div style="margin-top: 5px">
        <div
          style="
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
            display: inline-block;
          "
        >
          <el-input
            class="input-common"
            style="width: 300px"
            placeholder="Nhập tên nhóm"
            clearable
            v-model="dataSearch.name"
            @clear="searchByProperties()"
            @keyup.enter.native="searchByProperties()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchByProperties()"
            ></el-button>
          </el-input>
        </div>
        <div style="float: right">
          <el-button
            class="button-over"
            type="success"
            @click="createPackageGroupMethod()"
          >
            <i class="el-icon-plus" />
            Thêm mới
          </el-button>
        </div>
      </div>
      <!-- chi tiết khoản các học sinh -->
      <el-table
        :data="responseList"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="index"
          fixed
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="Tên nhóm"> </el-table-column>
        <el-table-column prop="note" label="Mô tả"></el-table-column>
        <el-table-column align="center" width="100" label="Số lượng">
          <template slot-scope="scope">
            <el-tooltip content="Xem" placement="top">
              <el-button
                class="click-in-row"
                @click="removeRowMethod(scope.row)"
                type="text"
                size="mini"
              >
                <span>{{ scope.row.number }}</span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="addRowMethod(scope.row)"
              >Thêm</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="updateRowMethod(scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteRowMethod(scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 15px 0"></div>
    </div>
    <PackageGroupCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="closeCreateDialogMethod()"
      ref="PackageGroupCreateDialog"
    />

    <PackageGroupUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="closeUpdateDialogMethod()"
      ref="PackageGroupUpdateDialog"
    />

    <PackageGroupAddDialog
      :dialogVisible="showAddDialog"
      @dialog-close="closeAddDialogMethod()"
      ref="PackageGroupAddDialog"
    />

    <PackageGroupRemoveDialog
      :dialogVisible="showRemoveDialog"
      @dialog-close="closeRemoveDialogMethod()"
      ref="PackageGroupRemoveDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import FinanceStatisticalService from "@/services/FinanceStatisticalService";
import PackageGroupCreateDialog from "./PackageGroupCreateDialog.vue";
import PackageGroupUpdateDialog from "./PackageGroupUpdateDialog.vue";
import PackageGroupAddDialog from "./PackageGroupAddDialog.vue";
import PackageGroupRemoveDialog from "./PackageGroupRemoveDialog.vue";

export default {
  components: {
    PackageGroupCreateDialog,
    PackageGroupUpdateDialog,
    PackageGroupAddDialog,
    PackageGroupRemoveDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      multipleSelection: [],
      responseList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddDialog: false,
      showRemoveDialog: false,
      dataSearch: {
        name: "",
      },
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeCreateDialogMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    closeUpdateDialogMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    closeAddDialogMethod() {
      this.showAddDialog = false;
      this.searchByProperties();
    },
    closeRemoveDialogMethod() {
      this.showRemoveDialog = false;
      this.searchByProperties();
    },
    createPackageGroupMethod() {
      this.showCreateDialog = true;
    },
    addRowMethod(row) {
      this.showAddDialog = true;
      this.$refs.PackageGroupAddDialog.getDataInitial(row.id, row.name);
    },
    removeRowMethod(row) {
      this.showRemoveDialog = true;
      this.$refs.PackageGroupRemoveDialog.getDataInitial(row.id, row.name);
    },
    updateRowMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.PackageGroupUpdateDialog.getDataInitial(row.id);
    },
    deleteRowMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa nhóm đã chọn không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        FinanceStatisticalService.deletePackageGroupById(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FinanceStatisticalService.searchPackageGroup(this.dataSearch.name)
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
          this.responseList = [];
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
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
// /deep/.el-table td {
//   padding: 8px 0;
// }
// /deep/.el-table th {
//   padding: 12px 0;
// }
.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 5px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 12px;
}
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
