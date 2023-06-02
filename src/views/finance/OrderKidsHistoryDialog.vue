<template>
  <div>
    <el-dialog
      :title="'Lịch sửa hóa đơn: ' + orderCode"
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
        <el-table-column
          width="125"
          fixed
          align="center"
          label="Ngày thanh toán"
        >
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
        <el-table-column label="Tiền mặt nhập" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyInput | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền ví nhập" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyWallet | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền thanh toán" align="right" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyPayment | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mô tả" prop="description" min-width="150">
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="115"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="orderKidsHistoryDetailMethod(scope.row)"
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
      </span>
    </el-dialog>
    <OrderKidsHistoryDetailDialog
      :dialogVisible="showOrderHistoryDetailDialog"
      @dialog-close="closesOrderHistoryDetailDialog()"
      ref="OrderKidsHistoryDetailDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import OrderKidsHistoryDetailDialog from "./OrderKidsHistoryDetailDialog.vue";
export default {
  components: {
    OrderKidsHistoryDetailDialog,
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
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.category == "out") {
        return "color: #409EFF";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseList = [];
      }, 300);
    },
    closesOrderHistoryDetailDialog() {
      this.showOrderHistoryDetailDialog = false;
    },
    orderKidsHistoryDetailMethod(row) {
      this.showOrderHistoryDetailDialog = true;
      this.$refs.OrderKidsHistoryDetailDialog.getOrderHistoryDetailInitial(
        row.id
      );
    },
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      FnFeesService.findOrderKidsHistory(this.idOrder)
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
    getOrderHistoryInitial(row) {
      this.idOrder = row.orderKids.id;
      this.orderCode = row.orderKids.code;
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
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
