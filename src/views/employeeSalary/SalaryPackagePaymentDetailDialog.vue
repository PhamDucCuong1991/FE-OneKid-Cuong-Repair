<template>
  <el-dialog
    title="Chi tiết các lần thanh toán"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      highlight-current-row
      :data="responseList"
      :cell-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeight"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
        type="index"
        fixed
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="Ngày thanh toán" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderEmployeeHistory.date | formatDate }}</span>
        </template></el-table-column
      >
      <el-table-column
        width="200"
        prop="orderEmployeeHistory.name"
        label="Người thanh toán"
      >
      </el-table-column>
      <el-table-column label="Tiền thanh toán" align="right" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.money | formatCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="200"
        prop="orderEmployeeHistory.description"
        label="Mô tả"
      >
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      responseList: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
    },
    getOrderHistoryDetailInitial(id) {
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.findSalaryPackagePaymentDetail(id)
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.responseList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
.input-common {
  margin-right: 5px;
}
</style>
