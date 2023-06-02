<template>
  <div>
    <div style="margin-top: 5px">
      <div style="margin-bottom: 20px">
        <el-input
          style="width: 300px"
          placeholder="Nhập tên khoản"
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
        <div style="float: right">
          <el-button class="button-bottom" type="success" @click="createDialogMethod()"
            >Tạo mẫu công lương</el-button
          >
          <el-button
            v-if="checkPermission(['statisticalFinance_groupSalary'])"
            class="button-bottom"
            type="success"
            @click="addSalaryGroupMethod()"
            >Thêm mẫu vào nhóm</el-button
          >
          <!-- <el-dropdown @command="handleCommandAction">
            <el-button class="button-bottom" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu class="el-dropdown-menu-container">
              <el-dropdown-item command="changeSortCommand">Xuất File</el-dropdown-item>
              <el-dropdown-item command="changeSortCommand">Nhập File</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </div>

      <div class="table-content row-data">
        <el-table
          ref="multipleTable"
          :empty-text="textTable"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="responseList"
          :cell-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            fixed
            type="selection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            fixed
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="Tên khoản"
            min-width="200"
          ></el-table-column>
          <el-table-column fixed prop="category" label="Loại" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.category == 'in'">Thu</span>
              <span v-else>Chi</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="Mô tả"
            min-width="190"
          ></el-table-column>
          <el-table-column
            prop="unit"
            align="center"
            label="Đơn vị"
            width="100"
          ></el-table-column>
          <el-table-column prop="number" align="center" label="Số lượng" width="80">
          </el-table-column>
          <el-table-column prop="price" align="right" label="Đơn giá" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.price | formatCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discount" align="center" label="Giảm giá" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.discount">Có</span>
              <span v-else>Không</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="discountPrice"
            align="right"
            label="Đơn giá sau giảm"
            width="130"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.discount">{{
                scope.row.discountPrice | formatCurrency
              }}</span>
              <span v-else>{{ scope.row.price | formatCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="attendance" align="center" label="Điểm danh" width="90">
            <template slot-scope="scope">
              <span v-if="scope.row.attendance">Có</span>
              <span v-else>Không</span>
            </template>
          </el-table-column>
          <el-table-column prop="active" align="center" label="Đăng ký" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.active">Có</span>
              <span v-else>Không</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fnSalaryGroup.name"
            align="center"
            label="Nhóm"
            width="150"
          >
          </el-table-column>
          <el-table-column label="Tác vụ" fixed="right" width="140" align="center">
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
                @click="deletePackageMethod(scope.row)"
                >{{ $t("button.delete") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <SalarySampleCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="SalarySampleCreate"
    />
    <SalarySampleUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="SalarySampleUpdate"
    />
    <SalaryGroupAddDialog
      :dialogVisible="showAddSalaryGroup"
      @dialog-close="closeAddSalaryGroupMethod()"
      ref="SalaryGroupAddDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";

import SalarySampleCreate from "./SalarySampleCreate.vue";
import SalarySampleUpdate from "./SalarySampleUpdate.vue";
import SalaryGroupAddDialog from "./SalaryGroupAddDialog.vue";

export default {
  components: {
    SalarySampleCreate,
    SalarySampleUpdate,
    SalaryGroupAddDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      multipleSelection: [],
      responseList: [],
      loaddingButton: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddSalaryGroup: false,
      dataSearch: {
        name: "",
      },
    };
  },
  methods: {
    checkPermission,
    tableRowStyle({ row }) {
      if (row.category == "in") {
        return "color: #409EFF";
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    closeAddSalaryGroupMethod() {
      this.showAddSalaryGroup = false;
      this.searchByProperties();
    },

    updateDialogMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.SalarySampleUpdate.detailSalarySample(row.id);
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    addSalaryGroupMethod() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.checkSelectRowList(selectRowList);
      this.showAddSalaryGroup = true;
      this.$refs.SalaryGroupAddDialog.getDataInitial(selectRowList, "sample");
    },
    checkSelectRowList(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Chưa có khoản nào được chọn",
          type: "error",
        });
        throw null;
      }
    },

    /**
     * xóa khoản thu
     */
    deletePackageMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản thu này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        EmployeeSalaryService.deleteSalarySample(row.id)
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
      EmployeeSalaryService.searchSalarySample(this.dataSearch.name)
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
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
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
  font-family: Arial, Helvetica, sans-serif;
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
