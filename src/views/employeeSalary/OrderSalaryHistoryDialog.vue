<template>
  <div>
    <el-dialog
      title="Lịch sử hóa đơn"
      :visible.sync="dialogVisible"
      width="1200px"
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
        <el-table-column width="180" fixed align="center" label="Ngày thanh toán">
          <template slot-scope="scope">
            <span>{{ scope.row.date | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Người thanh toán"
          width="180"
          prop="name"
        ></el-table-column>
        <el-table-column label="Loại" align="center" width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.category == 'in'">Thu</span>
            <span v-if="scope.row.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Tiền mặt nhập" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyInput | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền ví nhập" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyWallet | formatCurrency }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="Tiền thanh toán" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyPayment | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mô tả" prop="description" min-width="150">
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="orderSalaryHistoryDetailMethod(scope.row)"
              >{{ $t("button.view") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <!-- <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button> -->
      </span>
    </el-dialog>
    <OrderSalaryHistoryDetailDialog
      :dialogVisible="showOrderHistoryDetailDialog"
      @dialog-close="closesOrderHistoryDetailDialog()"
      ref="OrderSalaryHistoryDetailDialog"
    />
  </div>
</template>

<script>
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import OrderSalaryHistoryDetailDialog from "./OrderSalaryHistoryDetailDialog.vue";
export default {
  components: {
    OrderSalaryHistoryDetailDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      idOrder: "",
      orderCode: "",
      responseList: [],
      loadingButton: false,
      showOrderHistoryDetailDialog: false,
    };
  },
  methods: {
    tableRowStyle({ row }) {
      if (row.category == "in") {
        return "color: #78a5e7";
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
      }, 300);
    },
    closesOrderHistoryDetailDialog() {
      this.showOrderHistoryDetailDialog = false;
    },
    orderSalaryHistoryDetailMethod(row) {
      this.showOrderHistoryDetailDialog = true;
      this.$refs.OrderSalaryHistoryDetailDialog.getOrderHistoryDetailInitial(row.id);
    },
    // submitForm() {
    //   this.$refs["dataInput"].validate((valid) => {
    //     if (valid) {
    //       EmployeeSalaryService.createWalletParentHisotry()
    //         .then((resp) => {
    //           this.$message({
    //             message: resp.data.message,
    //             type: "success",
    //           });
    //           setTimeout(() => {
    //             this.closeDialog();
    //           }, 500);
    //         })
    //         .catch((err) => {
    //           this.$message({
    //             message: err.response.data.message,
    //             type: "error",
    //           });
    //         })
    //         .finally(() => {
    //           setTimeout(() => {
    //             this.loadingButton = false;
    //           }, 500);
    //         });
    //     } else {
    //       console.log("error validate data!");
    //       return false;
    //     }
    //   });
    // },
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.findOrderSalaryHistory(this.idOrder)
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
        });
    },
    getOrderHistoryInitial(row) {
      this.idOrder = row.billSampleResponse.id;
      this.orderCode = row.billSampleResponse.code;
      this.searchByProperties();
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
