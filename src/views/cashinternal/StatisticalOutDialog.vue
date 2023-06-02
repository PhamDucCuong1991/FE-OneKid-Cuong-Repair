<template>
  <el-dialog
    title="Thống kê tổng tiền đã thanh toán của khoản chi"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="35%"
    top="3vh"
  >
    <div style="position: relative; z-index: 1; margin-top: 5px">
      <el-radio-group
        style="margin-right: 20px"
        v-model="dataSearch.type"
        @change="changeTypeMethod()"
      >
        <el-radio label="month">Xem theo tháng</el-radio>
        <el-radio label="date">Xem theo ngày</el-radio>
      </el-radio-group>
      <el-select
        v-if="showMonth"
        style="width: 120px; margin-right: 5px"
        v-model="dataSearch.month"
        clearable
        placeholder="Chọn tháng"
        @change="getDataInitial()"
      >
        <el-option
          v-for="item in monthList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-date-picker
        v-if="showDate"
        class="input-common"
        style="width: 265px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.dateList"
        type="daterange"
        unlink-panels
        range-separator="-"
        @change="changeDateMethod"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
    </div>
    <h1 class="money-total">
      Tổng tiền:
      <span style="font-weight: normal">{{
        totalMoney | formatCurrencyNew
      }}</span>
    </h1>
    <div class="tab-infor-button">
      <el-button type="danger" size="medium" @click="closeDialogByButton">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";
const valMonthList = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      showMonth: true,
      showDate: false,
      monthList: valMonthList,
      totalMoney: "",
      dataSearch: {
        category: "out",
        type: "month",
        month: "",
        dateList: [],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    changeTypeMethod() {
      if (this.dataSearch.type == "month") {
        this.showMonth = true;
        this.showDate = false;
        this.dataSearch.dateList = [];
      } else if (this.dataSearch.type == "date") {
        this.showMonth = false;
        this.showDate = true;
        this.dataSearch.month = "";
      }
      this.getDataInitial();
    },
    changeDateMethod() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = "";
      }
      this.getDataInitial();
    },
    getDataInitial() {
      CashInternalService.getOutCashinternalMoney(
        this.dataSearch.type,
        this.dataSearch.category,
        this.dataSearch.month,
        this.dataSearch.dateList
      )
        .then((resp) => {
          this.totalMoney = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
<style>
.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.money-total {
  padding: 5px;
  background-color: #67c23a;
  color: white;
}
</style>
