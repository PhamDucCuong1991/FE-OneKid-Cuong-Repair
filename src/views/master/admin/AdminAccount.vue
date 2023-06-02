<template>
  <div class="content">
    <div>
      <!-- button left -->
      <div class="button-click-left">
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="dataSearch.nameOrPhone"
          @clear="seachAdminSchoolMethod()"
          @keyup.enter.native="seachAdminSchoolMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="seachAdminSchoolMethod()"
          ></el-button>
        </el-input>
      </div>

      <!-- button action -->
      <div class="button-click-right row-data">
        <!-- <el-button class="button-over" type="success" @click="createAccount()">
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>-->
        <!-- <el-dropdown>
          <el-button class="button-over" type="success">
            Gửi tin
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item>Gửi qua App</el-dropdown-item>
            <el-dropdown-item>Gửi qua SMS</el-dropdown-item>
            <el-dropdown-item>Gửi tài khoản</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="button-over" type="success" @click="handleExport()">Xuất File Excel</el-button>-->
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
        :data="tableDataList"
        highlight-current-row
        :cell-style="tableRowStyleDetail"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
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
          width="200"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="Số điện thoại"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="Danh sách trường">
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 8px"
              v-for="item in scope.row.schoolList"
              :key="item.id"
              type
              effect="plain"
              >{{ item.schoolName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >Thêm trường</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddSchoolForAdmin
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AddSchoolForAdmin"
    />
  </div>
</template>


<script>
import AdminService from "@/services/AdminService";

import AddSchoolForAdmin from "./AddSchoolForAdmin.vue";

export default {
  components: {
    AddSchoolForAdmin,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      tableDataList: [],
      showUpdateDialog: false,
      dataSearch: {
        nameOrPhone: "",
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    seachAdminSchoolMethod() {
      this.loadingData = true;
      let search = this.dataSearch;
      AdminService.searchAdminSchool(search.nameOrPhone)
        .then((resp) => {
          this.tableDataList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.tableDataList = null;
        })
        .finally(() => {
          if (this.tableDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.seachAdminSchoolMethod();
    },
    handleEdit(row) {
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 100);
      this.$refs.AddSchoolForAdmin.getDataInitial(row.id);
    },
    /**
     * active account
     */
    activeAccountRow(row) {
      let textAlert = "";
      if (row.activated) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      AdminService.updateActiveAccount(row)
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
  },
  beforeMount() {
    this.seachAdminSchoolMethod();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
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