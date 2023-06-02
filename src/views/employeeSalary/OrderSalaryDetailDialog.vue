<template>
  <div>
    <el-dialog
      :title="'Chi tiết hóa đơn: ' + responseData.code"
      :visible.sync="dialogVisible"
      width="1100px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseData.dataList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column
          type="index"
          fixed
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Tên khoản" prop="name" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Loại" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.category == 'in'">Thu</span>
            <span v-else-if="scope.row.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column label="Đơn vị" prop="unit" align="center" width="100">
        </el-table-column>
        <el-table-column label="Khóa" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.locked">Đã khóa</span>
            <span v-else>Chưa khóa</span>
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="right" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.money == 0">0</span>
            <span v-else>{{ scope.row.money | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã trả" align="right" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">0</span>
            <span v-else>{{ scope.row.paid | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thiếu" align="right" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.money - scope.row.paid == 0">0</span>
            <span v-else>{{ (scope.row.money - scope.row.paid) | formatCurrency }}</span>
          </template>
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
      <br />
      <div>
        <el-input
          type="textarea"
          :rows="2"
          v-model="responseData.description"
          placeholder="Nhập ghi chú hóa đơn"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu mô tả</span>
        </el-button>
      </span>
    </el-dialog>
    <SalaryPackagePaymentDetailDialog
      :dialogVisible="showOrderHistoryDetailDialog"
      @dialog-close="closesOrderHistoryDetailDialog()"
      ref="SalaryPackagePaymentDetailDialog"
    />
  </div>
</template>

<script>
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import SalaryPackagePaymentDetailDialog from "./SalaryPackagePaymentDetailDialog.vue";
import http from "../../http-download";
import moment from "moment";
export default {
  components: {
    SalaryPackagePaymentDetailDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      idOrder: "",
      responseData: [],
      loadingButton: false,
      loadingButtonPrint: false,
      showOrderHistoryDetailDialog: false,
      multipleSelectionDetail: [],
    };
  },
  methods: {
    tableRowStyle({ row }) {
      if (row.paid == 0) {
        return "color: #F14950";
      } else if (row.paid < row.money) {
        return "color: #E6A23C";
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleSelectionChange(val) {
      this.multipleSelectionDetail = val;
    },
    printOrderKidsMethod() {
      this.checkButtonBefore();
      let idList = this.multipleSelectionDetail.map((x) => x.id);
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.loadingButtonPrint = true;
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        return http
          .get(`/pdf/salary/order/${this.idOrder}?idList=${idList}`)
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "PHIEU_CONG_LUONG_" + myDate + ".pdf");
            document.body.appendChild(link);
            link.click();
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButtonPrint = false;
            }, 500);
          });
      });
    },
    checkButtonBefore() {
      if (this.multipleSelectionDetail.length == 0) {
        this.$message({
          message: "Không có hóa đơn nào được chọn",
          type: "error",
        });
        throw null;
      }
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
      this.$refs.SalaryPackagePaymentDetailDialog.getOrderHistoryDetailInitial(row.id);
    },
    submitForm() {
      this.loadingButton = true;
      EmployeeSalaryService.saveOrderSalaryDescription(this.idOrder, this.responseData)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.getOrderSalaryDetail(this.idOrder)
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          this.responseData = null;
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseData.dataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
    getOrderSalaryDetailInitial(idOrder) {
      this.idOrder = idOrder;
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
