<template>
  <div class="content">
    <!-- add -->
    <el-button
      v-if="checkPermission(['cashInternal_bank_update'])"
      class="button-over"
      style="float: right; margin-bottom: 20px; margin-top: 5px"
      type="success"
      @click="createDialogMethod()"
    >
      <i class="el-icon-plus" />
      Thêm tài khoản
    </el-button>

    <div class="lblthemlichsu">
      <div class="table-content row-data">
        <el-table
          ref="multipleTable"
          :empty-text="textTable"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          :data="responseList"
          highlight-current-row
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="index"
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="bankName"
            label="Tên ngân hàng"
          ></el-table-column>

          <el-table-column
            prop="fullName"
            label="Chủ tài khoản"
          ></el-table-column>

          <el-table-column
            prop="accountNumber"
            label="Số tài khoản"
          ></el-table-column>
          <el-table-column prop="branch" label="Chi nhánh"></el-table-column>
          <el-table-column prop="description" label="Ghi chú"></el-table-column>
          <el-table-column label="TK chính" width="100" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="scope.row.checked"
                :label="true"
                @change="updateCheckedMethod(scope.row)"
              >
              </el-radio>
            </template>
          </el-table-column>

          <el-table-column
            v-if="checkPermission(['cashInternal_bank_update'])"
            label="Tác vụ"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleUpdate(scope.row)"
                >Sửa</el-button
              >
              <el-button
                :disabled="scope.row.checked ? true : false"
                size="mini"
                @click="handleDelete(scope.row)"
                type="danger"
                >Xóa</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <FnBankCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="FnBankCreate"
    />
    <FnBankUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="FnBankUpdate"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import FnBankCreate from "./FnBankCreate.vue";
import FnBankUpdate from "./FnBankUpdate.vue";
import CashInternalService from "@/services/CashInternalService";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  components: { FnBankCreate, FnBankUpdate },
  data() {
    return {
      loadingData: false,
      textEmpty: "",
      responseList: [],
      textTable: "",
      showCreateDialog: false,
      showUpdateDialog: false,
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      multipleSelection: [],

      activeName: "AddHeightWeight",
      showAdd: true,
      dataList: [],
      dataListSchool: [],
      content: "",
    };
    // ----
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.getData();
    },
    handleUpdate(row) {
      this.showUpdateDialog = true;
      this.$refs.FnBankUpdate.getDataInitial(row.id);
    },
    dialogCloseUpdateMethod() {
      this.getData();
      this.showUpdateDialog = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    createDialogMethod() {
      setTimeout(() => {
        this.showCreateDialog = true;
      }, 500);
    },
    updateCheckedMethod(row) {
      CashInternalService.updateBankChecked(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.getData();
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.checked = false;
          }, 200);
        });
    },
    //click delete at row
    handleDelete(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thông tin tài khoản đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        CashInternalService.deleteBankInfo(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getData();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          });
      });
    },

    getData() {
      this.loadingData = true;
      this.textTable = "";
      CashInternalService.findBankInfo()
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
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.button-select {
  margin-right: 5px;
  width: 150px;
}

/deep/.el-table th {
  padding: 10px 0;
}

.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-button--primary {
  // width: 8% !important;
  background: #ffffff;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
}
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
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
}

/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}

.button-left-class {
  margin-right: 5px;
  width: 150px;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
}
.button-left-class1 {
  margin-right: 5px;
  width: 133px;
}
/deep/.el-table th > .cell {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  text-align: center !important;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}

.button-left-class9 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class2 {
  margin-right: -50px;
  width: 140px;
}
.button-left-class3 {
  margin-left: -10px;
  width: 140px;
}
.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  // border-collapse: separate;
  border-spacing: 0;
  margin-top: 5px;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
/deep/.content[data-v-14071a78] .el-range-editor.el-input__inner {
  width: 240px;
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  width: 220px;
}
.el-range-editor.el-input__inner {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  width: 260px;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* border: red; */
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}

// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
/deep/.paging-click .el-pagination {
  text-align: right;
  margin-right: 50px;
  margin-top: -5px;
}
/deep/.el-radio__label {
  font-size: 0;
  padding-left: 0;
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
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  line-height: 23px;
  padding-right: 10px;
  max-height: 40px !important;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
