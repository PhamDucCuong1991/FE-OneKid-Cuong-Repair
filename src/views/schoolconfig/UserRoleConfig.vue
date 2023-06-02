<template>
  <div>
    <div>
      <div
        style="
          margin-bottom: -20px;
          position: relative;
          z-index: 1;
          margin-top: 5px;
        "
      >
        <el-select
          class="input-common"
          style="width: 140px"
          v-model="dataSearch.appType"
          @change="changeAppTypeMethod()"
          placeholder="Chọn appType"
        >
          <el-option
            v-for="item in appTypeList"
            :key="item.key"
            :value="item.key"
            :label="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-if="activeTabName == 'permissionTab'"
          style="width: 300px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="nameOrPhoneSearch"
          @clear="filterDataMethod()"
          @keyup.enter.native="filterDataMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="filterDataMethod()"
          ></el-button>
        </el-input>
        <el-input
          v-else-if="activeTabName == 'roleTab'"
          style="width: 300px"
          placeholder="Nhập tên vai trò"
          clearable
          v-model="roleNameSearch"
          @clear="searchRoleMethod()"
          @keyup.enter.native="searchRoleMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchRoleMethod()"
          ></el-button>
        </el-input>
      </div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- phân quyền -->
        <el-tab-pane label="Phân vai trò" name="permissionTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="permissionUserFilterList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
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
              prop="fullName"
              label="Họ tên"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="SĐT"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column label="Vai trò">
              <template slot-scope="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="item in scope.row.roleList"
                  :key="item.id"
                  effect="plain"
                  >{{ item.roleName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="addRolesForUserMethod(scope.row)"
                  >Sửa vai trò</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- quản lý vai trò -->
        <el-tab-pane label="Quản lý vai trò" name="roleTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="roleDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
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
              prop="roleName"
              label="Tên vai trò"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="description"
              label="Mô tả"
              width="250"
            ></el-table-column>
            <el-table-column label="Quyền sử dụng">
              <template slot-scope="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="item in scope.row.apiList"
                  :key="item.id"
                  effect="plain"
                  >{{ item.apiName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <span>
                  <el-button
                    size="mini"
                    type="success"
                    @click="updateRoleRow(scope.row)"
                    >Sửa</el-button
                  >
                  <el-button
                    :disabled="scope.row.defaultStatus"
                    size="mini"
                    type="danger"
                    @click="deleteRoleOne(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              @click="createAttendanceSampleMethod()"
              >Thêm vai trò</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <RoleUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="RoleUpdateDialog"
    />
    <RoleCreateDialog
      :dialogVisible="showCreateRoleDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="RoleCreateDialog"
    />
    <AddPermissionForUserDialog
      :dialogVisible="showAddPermisionDialog"
      @dialog-close="dialogCloseAddMediaMethod()"
      ref="AddPermissionForUserDialog"
    />
  </div>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";

import RoleUpdateDialog from "./RoleUpdateDialog.vue";
import RoleCreateDialog from "./RoleCreateDialog.vue";
import AddPermissionForUserDialog from "./AddPermissionForUserDialog.vue";

export default {
  components: {
    RoleUpdateDialog,
    RoleCreateDialog,
    AddPermissionForUserDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      activeTabName: "permissionTab",
      permissionUserList: [],
      permissionUserFilterList: [],
      roleDataList: [],
      roleDataFilterList: [],
      nameOrPhoneSearch: "",
      roleNameSearch: "",
      loaddingButton: false,
      showUpdateDialog: false,
      showAddPermisionDialog: false,
      showCreateRoleDialog: false,
      loaddingButtonClass: false,
      dataSearch: {
        appType: "plus",
      },
      dataSearchRole: {
        roleName: "",
      },
      appTypeList: [
        { key: "plus", value: "Nhà trường" },
        { key: "teacher", value: "Giáo viên" },
      ],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.idSchool == 0) {
        return "color: #409EFF";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "permissionTab") {
        this.findAllPermissionUser();
      } else if (tabNameClick == "roleTab") {
        this.searchRoleMethod();
      }
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchRoleMethod();
    },
    dialogCloseAddMediaMethod() {
      setTimeout(() => {
        this.showAddPermisionDialog = false;
      }, 100);
      this.findAllPermissionUser();
    },
    changeAppTypeMethod() {
      if (this.activeTabName == "permissionTab") {
        this.findAllPermissionUser();
      } else if (this.activeTabName == "roleTab") {
        this.searchRoleMethod();
      }
    },
    updateRoleRow(row) {
      this.showUpdateDialog = true;
      this.$refs.RoleUpdateDialog.getAllRoleInitial(row);
    },
    dialogCloseCreateMethod() {
      this.showCreateRoleDialog = false;
      this.searchRoleMethod();
    },
    addRolesForUserMethod(row) {
      this.showAddPermisionDialog = true;
      this.$refs.AddPermissionForUserDialog.getPermissionForUserInitial(
        row,
        this.dataSearch.appType
      );
    },
    createAttendanceSampleMethod() {
      this.showCreateRoleDialog = true;
      this.$refs.RoleCreateDialog.getAllApiInitial(this.dataSearch.appType);
    },
    deleteRoleOne(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa vai trò đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteRole(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchRoleMethod();
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
     * tìm kiếm theo tên hoặc tài khoản
     */
    filterDataMethod() {
      let dataList = this.permissionUserList;
      if (dataList == null) {
        this.permissionUserFilterList = [];
      } else {
        let search = this.nameOrPhoneSearch.trim();
        if (search == "") {
          this.permissionUserFilterList = dataList;
        } else {
          this.permissionUserFilterList = dataList.filter((x) => {
            return (
              x.fullName.toLowerCase().includes(search.toLowerCase()) ||
              x.phone.toLowerCase().includes(search.toLowerCase())
            );
          });
        }
      }
      if (this.permissionUserFilterList.length == 0) {
        this.textTable = this.$tableEmpty;
      }
    },
    /**
     * tìm kiếm tất cả vai trò
     */
    searchRoleMethod() {
      this.loadingData = true;
      SchoolConfigService.searchRoleService(
        this.dataSearch.appType,
        this.dataSearchRole.roleName
      )
        .then((resp) => {
          this.roleDataList = resp.data.data;
        })
        .catch((err) => {
          this.roleDataList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.roleDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    /**
     * tìm kiếm tất cả các quyền cho người dùng
     */
    findAllPermissionUser() {
      this.loadingData = true;
      SchoolConfigService.findAllPermissionManage(this.dataSearch.appType)
        .then((resp) => {
          this.permissionUserList = resp.data.data;
          this.filterDataMethod();
        })
        .catch((err) => {
          this.permissionUserList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.permissionUserList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.findAllPermissionUser();
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
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 10px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
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

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
}
// td {
//   padding: 12px;
// }
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
