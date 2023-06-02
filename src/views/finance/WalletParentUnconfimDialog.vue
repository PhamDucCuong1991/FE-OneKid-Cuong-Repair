<template>
  <div>
    <el-dialog
      title="Danh sách học sinh chưa xác nhận"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <!-- chi tiết khoản các học sinh -->
      <el-table
        :data="responseDataList"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :header-cell-style="tableHeaderColor"
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
        <el-table-column
          width="110"
          fixed
          align="center"
          prop="walletParent.code"
          label="Mã ví"
        >
        </el-table-column>
        <el-table-column
          width="150"
          fixed
          prop="fullName"
          label="Tên học sinh"
        ></el-table-column>
        <el-table-column
          width="150"
          fixed
          prop="className"
          label="Tên lớp"
        ></el-table-column>
        <el-table-column label="Ngày sinh" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template></el-table-column
        >
        <el-table-column min-width="140" align="right" label="Tiền nạp">
          <template slot-scope="scope">
            <span v-if="scope.row.walletParent.moneyIn == 0">0</span>
            <span v-else>{{
              scope.row.walletParent.moneyIn | formatCurrency
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" align="right" label="Tiền rút">
          <template slot-scope="scope">
            <span v-if="scope.row.walletParent.moneyOut == 0">0</span>
            <span v-else>{{
              scope.row.walletParent.moneyOut | formatCurrency
            }}</span>
          </template></el-table-column
        >
        <el-table-column min-width="140" align="right" label="Số dư ví">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.walletParent.moneyIn -
                  scope.row.walletParent.moneyOut ==
                0
              "
              >0</span
            >
            <span v-else>{{
              (scope.row.walletParent.moneyIn - scope.row.walletParent.moneyOut)
                | formatCurrency
            }}</span>
          </template></el-table-column
        >
        <el-table-column
          min-width="120"
          align="center"
          label="Chưa xác nhận"
          fixed
        >
          <template slot-scope="scope">
            <span>{{ scope.row.numberStatus }}</span>
            <el-button
              class="click-in-row"
              v-if="scope.row.numberStatus != 0"
              type="text"
              style="text-decoration: underline; margin-left: 4px"
              @click="handleHistoryFalse(scope.row)"
              >(Xem)</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
    <WalletParentHistoryFalseDialog
      :dialogVisible="showHistoryFalse"
      @dialog-close="closeViewHistoryFalseMethod()"
      ref="WalletParentHistoryFalseDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import WalletParentHistoryFalseDialog from "./WalletParentHistoryFalseDialog.vue";

export default {
  props: {
    dialogVisible: null,
  },
  components: {
    WalletParentHistoryFalseDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: false,
      loadingButton: false,
      responseDataList: [],
      showHistoryFalse: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
    },
    closeViewHistoryFalseMethod() {
      this.showHistoryFalse = false;
      this.searchWalletParentByProperties();
    },
    handleHistoryFalse(row) {
      this.showHistoryFalse = true;
      this.$refs.WalletParentHistoryFalseDialog.getDataHistoryInitial(
        row.walletParent.id
      );
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchWalletParentByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchWalletParentUnConfirm()
        .then((resp) => {
          this.responseDataList = resp.data.data;
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
          this.responseDataList = [];
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.click-in-row {
  border: none;
  padding: 0;
  color: #67c23a;
}
.click-in-row:hover {
  color: #fa03d9;
  // background: none;
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
