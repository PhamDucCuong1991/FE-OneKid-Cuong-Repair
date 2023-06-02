<template>
  <div>
    <el-dialog
      :title="'Danh sách hóa đơn học sinh: ' + fullName"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div style="margin-bottom: 15px; position: relative; z-index: 1">
        <el-date-picker
          style="width: 130px"
          class="input-common"
          @change="searchByProperties()"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
          placeholder="Chọn năm"
        ></el-date-picker>
      </div>
      <el-row>
        <el-col
          :span="4"
          style="
            background: #67c23a;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          "
        >
          Tổng thu:
          <span>
            <span v-if="responseData.moneyTotalIn == 0">0</span>
            <span v-else> {{ responseData.moneyTotalIn | formatCurrency }}</span>
          </span>
        </el-col>
        <el-col :span="4" style="background: #f56c6c">
          Đã thu:
          <span>
            <span v-if="responseData.moneyPaidIn == 0">0</span>
            <span v-else> {{ responseData.moneyPaidIn | formatCurrency }}</span>
          </span>
        </el-col>
        <el-col :span="4" style="background: #e6a23c">
          Thu thiếu:
          <span>
            <span v-if="responseData.moneyTotalIn - responseData.moneyPaidIn == 0"
              >0</span
            >
            <span v-else>
              {{
                (responseData.moneyTotalIn - responseData.moneyPaidIn) | formatCurrency
              }}</span
            >
          </span>
        </el-col>
        <el-col :span="4" style="background: #67c23a">
          Tổng chi:
          <span>
            <span v-if="responseData.moneyTotalOut == 0">0</span>
            <span v-else> {{ responseData.moneyTotalOut | formatCurrency }}</span>
          </span>
        </el-col>
        <el-col :span="4" style="background: #f56c6c">
          Đã chi:
          <span>
            <span v-if="responseData.moneyPaidOut == 0">0</span>
            <span v-else> {{ responseData.moneyPaidOut | formatCurrency }}</span>
          </span>
        </el-col>
        <el-col
          :span="4"
          style="
            background: #e6a23c;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        >
          Chi thiếu:
          <span>
            <span v-if="responseData.moneyTotalOut - responseData.moneyPaidOut == 0"
              >0</span
            >
            <span v-else>
              {{
                (responseData.moneyTotalOut - responseData.moneyPaidOut) | formatCurrency
              }}</span
            >
          </span>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseData.dataList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeightSmall"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column width="60" fixed prop="month" align="center" label="Tháng">
        </el-table-column>
        <el-table-column width="125" fixed prop="code" align="center" label="Mã hóa đơn">
        </el-table-column>
        <el-table-column align="center" width="70" label="Hiện thị">
          <template slot-scope="scope">
            <span v-if="scope.row.view">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="70" label="Khóa">
          <template slot-scope="scope">
            <span v-if="scope.row.locked">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="120" sortable label="Trạng thái">
          <template slot-scope="scope">
            <span v-if="scope.row.totalNumber == 0">Chưa có khoản</span>
            <span v-else-if="scope.row.totalNumber != scope.row.enoughNumber"
              >Chưa hoàn thành</span
            >
            <span v-else>Đã hoàn thành</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="Đủ-Thiếu-Chưa đóng">
          <template slot-scope="scope">
            <span>
              <span style="color: #606266">{{ scope.row.enoughNumber }}</span>
              -
              <span style="color: orange">{{ scope.row.partNumber }}</span> -
              <span style="color: red">{{ scope.row.emptyNumber }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Tổng thu">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyTotalIn == 0">0</span>
            <span v-else>{{ scope.row.moneyTotalIn | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Đã thu">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyPaidIn == 0">0</span>
            <span v-else>{{ scope.row.moneyPaidIn | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Thu thiếu">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyTotalIn - scope.row.moneyPaidIn == 0">0</span>
            <span v-else>{{
              (scope.row.moneyTotalIn - scope.row.moneyPaidIn) | formatCurrency
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Tổng chi">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyTotalOut == 0">0</span>
            <span v-else>{{ scope.row.moneyTotalOut | formatCurrency }}</span>
          </template></el-table-column
        >
        <el-table-column align="right" width="120" label="Đã chi">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyPaidOut == 0">0</span>
            <span v-else>{{ scope.row.moneyPaidOut | formatCurrency }}</span>
          </template></el-table-column
        >
        <el-table-column align="right" width="120" label="Chi thiếu">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyTotalOut - scope.row.moneyPaidOut == 0">0</span>
            <span v-else>{{
              (scope.row.moneyTotalOut - scope.row.moneyPaidOut) | formatCurrency
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Tác vụ" fixed="right" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission(['fees_order_locked'])"
              :disabled="scope.row.locked || scope.row.totalNumber == 0"
              size="mini"
              type="primary"
              @click="orderKidsCasherMethod(scope.row)"
              >Thanh toán</el-button
            >
            <el-button
              :disabled="scope.row.totalNumber == 0"
              size="mini"
              type="success"
              @click="orderKidsDetailMethod(scope.row)"
              >Chi tiết</el-button
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
    <OrderKidsCasher
      :dialogVisible="showOrderKidsCasherDialog"
      @dialog-close="closesOrderKidsCasherDialog()"
      ref="OrderKidsCasher"
    />
    <OrderKidsDetailDialog
      :dialogVisible="showOrderKidsDetailDialog"
      @dialog-close="closesOrderKidsDetailDialog()"
      ref="OrderKidsDetailDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import FnFeesService from "@/services/FnFeesService";
import OrderKidsCasher from "./OrderKidsCasher.vue";
import OrderKidsDetailDialog from "./OrderKidsDetailDialog.vue";
import moment from "moment";
export default {
  components: {
    OrderKidsCasher,
    OrderKidsDetailDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      idKid: "",
      fullName: "",
      dataSearch: {
        year: null,
      },
      responseData: [],
      loadingButton: false,
      showOrderKidsCasherDialog: false,
      showOrderKidsDetailDialog: false,
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.totalNumber == 0) {
        return "color: #FB9A00";
      } else if (row.totalNumber != row.enoughNumber) {
        return "color: #FD4803";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.dataSearch.year = null;
      }, 300);
    },
    closesOrderKidsCasherDialog() {
      this.showOrderKidsCasherDialog = false;
      this.searchByProperties();
    },
    closesOrderKidsDetailDialog() {
      this.showOrderKidsDetailDialog = false;
      this.searchByProperties();
    },
    orderKidsCasherMethod(row) {
      let idKid = this.idKid;
      let idOrder = row.id;
      let orderCode = row.code;
      let month = row.month;
      let year = row.year;
      this.showOrderKidsCasherDialog = true;
      this.$refs.OrderKidsCasher.getDataCasherInitial(
        idKid,
        idOrder,
        orderCode,
        month,
        year,
        this.fullName
      );
    },
    orderKidsDetailMethod(row) {
      this.showOrderKidsDetailDialog = true;
      this.$refs.OrderKidsDetailDialog.getFormOrderKidsAll(row.id);
    },
    searchByProperties() {
      let yearInput =
        this.dataSearch.year == null ? "" : moment(this.dataSearch.year).year();
      this.textTable = this.$tableLoadding;
      FnFeesService.searchOrderKidsAll(this.idKid, yearInput)
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseData.dataList = [];
        })
        .finally(() => {
          if (this.responseData.dataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
    getOrderKidsAllInitial(row) {
      this.idKid = row.id;
      this.fullName = row.fullName;
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
