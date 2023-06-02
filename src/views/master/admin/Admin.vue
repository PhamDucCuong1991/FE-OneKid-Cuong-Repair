<template>
  <div class="content">
    <div>
      <!-- chọn trạng thái nhân viên -->
      <el-select
        class="input-common input-grade"
        style="width: 150px"
        v-model="dataSearch.status"
        clearable
        @change="searchAdminMethod()"
        placeholder="Làm việc"
      >
        <el-option
          v-for="item in statusList"
          :key="item"
          :value="item"
          :label="item"
        ></el-option>
      </el-select>
      <!-- trạng thái kích hoạt -->
      <el-select
        style="width: 150px; margin-left: 10px"
        v-model="dataSearch.activated"
        clearable
        @change="searchAdminMethod()"
        placeholder="Trạng thái"
      >
        <el-option
          v-for="item in activatedList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>
      <!-- button left -->
      <div class="button-click-left">
        <el-input
          style="width: 280px; margin-left: 10px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="dataSearch.nameOrPhone"
          @clear="searchAdminMethod()"
          @keyup.enter.native="searchAdminMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchAdminMethod()"
          ></el-button>
        </el-input>
      </div>

      <!-- button action -->
      <div class="button-click-right row-data">
        <el-button class="button-over" type="success" @click="createAdminMethod()">
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>
      </div>
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
        :data="tableData"
        highlight-current-row
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        sortable
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="fullName" sortable label="Họ tên"></el-table-column>
        <el-table-column
          prop="createdDate"
          label="Thời gian tạo"
          align="center"
          width="135"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="Giới tính"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column prop="address" label="Địa chỉ"></el-table-column>
        <el-table-column
          prop="phone"
          label="SĐT"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="adminStatus"
          label="Trạng thái"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column label="Kích hoạt" width="100" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.maUser.activated"
              @change="activeAccountRow(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="maUser.username"
          label="Username"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="maUser.passwordShow"
          label="Password"
          align="center"
        ></el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
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
    <AdminUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AdminUpdate"
    />
    <AdminCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
  </div>
</template>

<script>
import AdminService from "@/services/AdminService";

import AdminUpdate from "./AdminUpdate.vue";
import AdminCreate from "./AdminCreate.vue";

export default {
  components: {
    AdminUpdate,
    AdminCreate,
  },
  data() {
    return {
      tableData: [],
      loadingData: true,
      textTable: "",
      showUpdateDialog: false,
      showCreateDialog: false,
      dataSearch: {
        status: "Đang làm",
        activated: "",
        nameOrPhone: "",
      },
      sorting: -1,
      statusList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      activatedList: [
        { key: true, value: "Đã kích hoạt" },
        { key: false, value: "Chưa kích hoạt" },
      ],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.adminStatus == "Nghỉ làm") {
        return "color: red";
      } else if (row.adminStatus == "Tạm nghỉ") {
        return "color: #409EFF";
      }
    },
    /**
     * search all admin
     */
    searchAdminMethod() {
      this.loadingData = true;
      let search = this.dataSearch;
      AdminService.searchAdmin(search.status, search.activated, search.nameOrPhone)
        .then((resp) => {
          this.tableData = resp.data.data;
          this.tableData = this.tableData
            .slice(0)
            .sort((a, b) => (a.fullName < b.fullName ? this.sorting : -this.sorting));
        })
        .catch((err) => {
          console.log(err);
          this.tableData = null;
        })
        .finally(() => {
          if (this.tableData.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * active account
     */
    activeAccountRow(row) {
      let textAlert = "";
      if (row.maUser.activated) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      AdminService.updateActiveAccount(row.maUser)
        .then((resp) => {
          let checkActive = resp.data.data;
          console.log(checkActive);
          this.$message({
            message: textAlert + " thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: textAlert + " thất bại",
            type: "error",
          });
        });
    },
    /**
     * delete admin
     */
    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa nhân viên đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AdminService.deleteAdmin(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa nhân viên thành công",
              type: "success",
            });
            this.searchAdminMethod();
          })
          .catch(() => {
            this.$message({
              message: "Bạn không thể xóa nhân viên đang quản lý trường",
              type: "error",
            });
          });
      });
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchAdminMethod();
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchAdminMethod();
    },
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.AdminUpdate.getDataInitial(row);
    },
    createAdminMethod() {
      this.showCreateDialog = true;
    },
  },
  beforeMount() {
    this.searchAdminMethod();
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
