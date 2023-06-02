<template>
  <div>
    <el-dialog
      :title="'Chi tiết hóa đơn: ' + responseData.code"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-row>
        <el-col
          :span="8"
          style="
            background: #67c23a;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          "
        >
          Tổng thu:
          <span>
            <span v-if="responseDataInList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataInList, (x) => x.money) | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
        <el-col :span="8" style="background: #409eff">
          Đã thu:
          <span>
            <span v-if="responseDataInList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataInList, (x) => x.paid) | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
        <el-col
          :span="8"
          style="
            background: #f56c6c;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        >
          Thu thiếu:
          <span>
            <span v-if="responseDataInList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataInList, (x) => x.money - x.paid)
                  | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
      </el-row>
      <el-table
        v-if="responseDataInList.length > 0"
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseDataInList"
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
        <el-table-column label="Tên khoản" prop="fnPackage.name" min-width="180">
        </el-table-column>
        <el-table-column label="Kiểu đóng" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.type == 'single'">Một lần</span>
            <span v-else-if="scope.row.fnPackage.type == 'multiple'">Nhiều lần</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column label="Đơn vị" prop="fnPackage.unit" align="center" width="100">
        </el-table-column>
        <el-table-column label="Khóa" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.locked">Đã khóa</span>
            <span v-else>Chưa khóa</span>
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money == 0">0</span>
            <span v-else>{{ scope.row.money | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã thu" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">0</span>
            <span v-else>{{ scope.row.paid | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thiếu" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money - scope.row.paid == 0">0</span>
            <span v-else>{{ (scope.row.money - scope.row.paid) | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="100" align="center">
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
      <br />
      <!-- for out -->
      <el-row>
        <el-col
          :span="8"
          style="
            background: #67c23a;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          "
        >
          Tổng chi:
          <span>
            <span v-if="responseDataOutList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataOutList, (x) => x.money) | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
        <el-col :span="8" style="background: #409eff">
          Đã chi:
          <span>
            <span v-if="responseDataOutList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataOutList, (x) => x.paid) | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
        <el-col
          :span="8"
          style="
            background: #f56c6c;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        >
          Chi thiếu:
          <span>
            <span v-if="responseDataOutList.length == 0">0</span>
            <span v-else>
              {{
                this.loda.sumBy(responseDataOutList, (x) => x.money - x.paid)
                  | formatCurrencyNew
              }}</span
            >
          </span>
        </el-col>
      </el-row>
      <el-table
        v-if="responseDataOutList.length > 0"
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseDataOutList"
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
        <el-table-column label="Tên khoản" prop="fnPackage.name" min-width="180">
        </el-table-column>
        <el-table-column label="Kiểu đóng" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.type == 'single'">Một lần</span>
            <span v-else-if="scope.row.fnPackage.type == 'multiple'">Nhiều lần</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column label="Đơn vị" prop="fnPackage.unit" align="center" width="100">
        </el-table-column>
        <el-table-column label="Khóa" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.locked">Đã khóa</span>
            <span v-else>Chưa khóa</span>
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money == 0">0</span>
            <span v-else>{{ scope.row.money | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã chi" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">0</span>
            <span v-else>{{ scope.row.paid | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thiếu" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money - scope.row.paid == 0">0</span>
            <span v-else>{{ (scope.row.money - scope.row.paid) | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="100" align="center">
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
      <br />
      <el-row>
        <el-col
          :span="16"
          style="
            background: #67c23a;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          "
        >
          Còn lại phải thu phụ huynh | Thu thiếu - Chi thiếu
        </el-col>
        <el-col
          :span="8"
          style="
            background: #f56c6c;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        >
          <span>
            {{
              (this.loda.sumBy(responseDataInList, (x) => x.money - x.paid) -
                this.loda.sumBy(responseDataOutList, (x) => x.money - x.paid))
                | formatCurrencyNew
            }}</span
          >
        </el-col>
      </el-row>
      <br />
      <div>
        <el-input
          v-if="showDataCustom"
          type="textarea"
          :rows="2"
          v-model="responseData.description"
          placeholder="Nhập ghi chú hóa đơn"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="showDataCustom"
          type="primary"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Lưu mô tả</span>
        </el-button>
        <!-- <el-button
          v-if="showDataCustom"
          type="success"
          size="medium"
          @click="printOrderKidsMethod()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button> -->

        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
    <KidsPackagePaymentDetailDialog
      :dialogVisible="showOrderHistoryDetailDialog"
      @dialog-close="closesOrderHistoryDetailDialog()"
      ref="KidsPackagePaymentDetailDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import KidsPackagePaymentDetailDialog from "./KidsPackagePaymentDetailDialog.vue";
import http from "../../http-download";
import moment from "moment";
export default {
  components: {
    KidsPackagePaymentDetailDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      idOrder: "",
      responseData: {},
      responseDataInList: [],
      responseDataOutList: [],
      loadingButton: false,
      showDataCustom: true,
      multipleSelection: "",
      showOrderHistoryDetailDialog: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.fnPackage.category == "out") {
        return "color: #409EFF";
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
    orderKidsHistoryDetailMethod(row) {
      this.showOrderHistoryDetailDialog = true;
      this.$refs.KidsPackagePaymentDetailDialog.getOrderHistoryDetailInitial(row.id);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    printOrderKidsMethod() {
      this.checkButtonBefore();
      let idList = this.multipleSelection.map((x) => x.id);
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        let message = "";
        message = "PHIEU_CONG_LUONG_";
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        return http
          .get(`/pdf/kids/order/${this.idOrder}?idList=${idList}`)
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", message + myDate + ".pdf");
            document.body.appendChild(link);
            link.click();
          });
      });
    },
    checkButtonBefore() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Không có hóa đơn nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    submitForm() {
      this.loadingButton = true;
      FnFeesService.saveOrderKidsDescription(this.idOrder, this.responseData)
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
      FnFeesService.getOrderKidsDetail(this.idOrder)
        .then((resp) => {
          let obj = (this.responseData = resp.data.data);
          this.responseDataInList = obj.dataList.filter(
            (x) => x.fnPackage.category == "in"
          );
          this.responseDataOutList = obj.dataList.filter(
            (x) => x.fnPackage.category == "out"
          );
        })
        .catch((err) => {
          this.responseData.dataList = [];
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
    getOrderKidsDetailInitial(idOrder) {
      this.idOrder = idOrder;
      this.searchByProperties();
    },
    getFormOrderKidsAll(idOrder) {
      this.showDataCustom = false;
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
.el-row {
  margin-bottom: 5px;
  font-size: 17px;
  color: white;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.el-col {
  padding: 9px 5px;
}
</style>
