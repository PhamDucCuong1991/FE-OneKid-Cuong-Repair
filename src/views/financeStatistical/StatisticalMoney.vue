<template>
  <spinner-custom v-if="showSpinner" />
  <div v-else>
    <el-row>
      <div class="header-row" style="margin-bottom: 20px">
        <div class="title-text">1. Thông tin quỹ tiền mặt</div>
        <span>
          <el-radio-group
            style="margin-right: 20px"
            v-model="dataSearchCashBook.type"
            @change="changeTypeMethod()"
          >
            <el-radio label="month">Xem theo tháng</el-radio>
            <el-radio label="date">Xem theo ngày</el-radio>
          </el-radio-group>
          <el-select
            v-if="dataSearchCashBook.type == 'month'"
            style="width: 120px"
            v-model="dataSearchCashBook.month"
            clearable
            placeholder="Chọn tháng"
            @change="searchCashBookStatisticalMethod()"
          >
            <el-option
              v-for="item in monthList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-date-picker
            v-else-if="dataSearchCashBook.type == 'date'"
            class="input-common"
            style="width: 265px"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="dataSearchCashBook.dateList"
            type="daterange"
            unlink-panels
            range-separator="-"
            @change="changeDateCashBookMethod()"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
          >
          </el-date-picker>
          <el-date-picker
            style="width: 100px; margin-left: 10px"
            class="input-common"
            :clearable="false"
            @change="searchCashBookStatisticalMethod()"
            v-model="dataSearchCashBook.year"
            type="year"
            value-format="yyyy-MM-dd"
            format="yyyy"
          ></el-date-picker
        ></span>
      </div>
      <div>
        <el-col :span="5" style="background: #409eff">
          Dư đầu kỳ:
          <span>
            {{ cashBookData.moneyStart | formatCurrencyNew }}
          </span>
        </el-col>
        <el-col :span="4" style="background: #67c23a; margin-left: 10px">
          Tổng thu:
          <span>
            {{ cashBookData.moneyIn | formatCurrencyNew }}
          </span>
        </el-col>
        <el-col :span="4" style="background: #f56c6c; margin-left: 10px">
          Tổng chi:
          <span>{{ cashBookData.moneyOut | formatCurrencyNew }}</span>
        </el-col>
        <el-col :span="5" style="background: #e6a23c; margin-left: 10px">
          Thu-Chi:
          <span>
            {{
              (cashBookData.moneyIn - cashBookData.moneyOut) | formatCurrencyNew
            }}
          </span>
        </el-col>
        <el-col :span="5" style="background: #409eff; margin-left: 10px">
          Dư cuối kỳ:
          <span>{{ cashBookData.moneyEnd | formatCurrencyNew }}</span>
        </el-col>
      </div>
    </el-row>
    <br />
    <el-row>
      <div class="header-row">
        <div class="title-text">2. Thu chi nội bộ</div>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchInternal.startMonth"
          @change="changeMonthInternalMethod()"
        >
          <el-option
            v-for="item in startMonthInternalList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchInternal.endMonth"
          @change="changeMonthInternalMethod()"
        >
          <el-option
            v-for="item in endMonthInternalList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          @change="searchStatisticalInternalMethod()"
          v-model="dataSearchInternal.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
      </div>
      <br />
      <div>
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Thu chi</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>Tổng thu (1)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>Tổng chi (2)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(1) - (2)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>{{ internalData.moneyIn | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ internalData.moneyOut | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{
                  (internalData.moneyIn - internalData.moneyOut)
                    | formatCurrencyNew
                }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <br />
    <el-row>
      <div class="header-row">
        <div class="title-text">3. Thông tin học phí</div>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchFees.startMonth"
          @change="changeMonthFeesMethod()"
        >
          <el-option
            v-for="item in startMonthFeesList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchFees.endMonth"
          @change="changeMonthFeesMethod()"
        >
          <el-option
            v-for="item in endMonthFeesList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          @change="searchStatisticalFeesMethod()"
          v-model="dataSearchFees.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
      </div>
      <br />
      <div>
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Khoản thu</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Tổng phải thu (1)</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Tổng đã thu (3)</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Còn lại phải thu (5)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>{{ feesData.moneyTotalIn | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ feesData.moneyTotalPaidIn | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ feesData.moneyTotalRemainIn | formatCurrencyNew }}
              </div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Khoản chi</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Tổng phải chi (2)</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Tổng đã chi (4)</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Còn lại phải chi (6)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>{{ feesData.moneyTotalOut | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ feesData.moneyTotalPaidOut | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ feesData.moneyTotalRemainOut | formatCurrencyNew }}</div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Tổng hợp</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(1) - (2)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(3) - (4)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(5) - (6)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>
                {{ feesData.moneyTotalInOut | formatCurrencyNew }}
              </div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ feesData.moneyTotalInOutPaid | formatCurrencyNew }}
              </div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ feesData.moneyTotalInOutRemain | formatCurrencyNew }}
              </div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Thống kê</div></el-col
            >
            <el-col
              :span="9"
              style="font-weight: normal"
              class="row-header row4-background"
              ><div>
                Số học sinh chưa hoàn thành hóa đơn: {{ feesData.kidsNumber }}
              </div></el-col
            >
            <el-col
              :span="9"
              style="font-weight: normal"
              class="row-header row4-background"
              ><div>
                Số hóa đơn chưa hoàn thành: {{ feesData.orderNumber }}
              </div></el-col
            >
          </el-row>
        </div>
      </div>
    </el-row>
    <br />
    <el-row>
      <div class="header-row">
        <div class="title-text">4. Thông tin công lương</div>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchSalary.startMonth"
          @change="changeMonthSalaryMethod()"
        >
          <el-option
            v-for="item in startMonthSalaryList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearchSalary.endMonth"
          @change="changeMonthSalaryMethod()"
        >
          <el-option
            v-for="item in endMonthSalaryList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          @change="searchStatisticalSalaryMethod()"
          v-model="dataSearchSalary.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
      </div>
      <br />
      <div>
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Khoản chi</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Tổng phải chi (1)</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Tổng đã chi (3)</div></el-col
            >
            <el-col :span="6" class="row-header row2-background"
              ><div>Còn lại phải chi (5)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>{{ salaryData.moneyTotalOut | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ salaryData.moneyTotalPaidOut | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ salaryData.moneyTotalRemainOut | formatCurrencyNew }}
              </div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Khoản thu</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Tổng phải thu (2)</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Tổng đã thu (4)</div></el-col
            >
            <el-col :span="6" class="row-header row1-background"
              ><div>Còn lại phải thu (5)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>{{ salaryData.moneyTotalIn | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>{{ salaryData.moneyTotalPaidIn | formatCurrencyNew }}</div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ salaryData.moneyTotalRemainIn | formatCurrencyNew }}
              </div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Tổng hợp</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(1) - (2)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(3) - (4)</div></el-col
            >
            <el-col :span="6" class="row-header row3-background"
              ><div>(5) - (6)</div></el-col
            >
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" class="row11 align-row">
              <div>
                {{ salaryData.moneyTotalInOut | formatCurrencyNew }}
              </div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ salaryData.moneyTotalInOutPaid | formatCurrencyNew }}
              </div>
            </el-col>
            <el-col :span="6" class="row11">
              <div>
                {{ salaryData.moneyTotalInOutRemain | formatCurrencyNew }}
              </div>
            </el-col>
          </el-row>
        </div>
        <br />
        <div>
          <el-row :gutter="20">
            <el-col :span="4" style="padding: 10px 10px"
              ><div>Thống kê</div></el-col
            >
            <el-col
              :span="9"
              style="font-weight: normal"
              class="row-header row4-background"
              ><div>
                Số nhân sự chưa hoàn thành hóa đơn:
                {{ salaryData.kidsNumber }}
              </div></el-col
            >
            <el-col
              :span="9"
              style="font-weight: normal"
              class="row-header row4-background"
              ><div>
                Số hóa đơn chưa hoàn thành: {{ salaryData.orderNumber }}
              </div></el-col
            >
          </el-row>
        </div>
      </div>
    </el-row>
    <br />
    <br />
    <br />
  </div>
</template>
<script>
import FinanceStatisticalService from "@/services/FinanceStatisticalService";
const valMonthList = [
  { key: "01", value: "Tháng 01" },
  { key: "02", value: "Tháng 02" },
  { key: "03", value: "Tháng 03" },
  { key: "04", value: "Tháng 04" },
  { key: "05", value: "Tháng 05" },
  { key: "06", value: "Tháng 06" },
  { key: "07", value: "Tháng 07" },
  { key: "08", value: "Tháng 08" },
  { key: "09", value: "Tháng 09" },
  { key: "10", value: "Tháng 10" },
  { key: "11", value: "Tháng 11" },
  { key: "12", value: "Tháng 12" },
];
export default {
  data() {
    return {
      showSpinner: true,
      status1: false,
      status2: false,
      status3: false,
      status4: false,
      startMonthInternalList: valMonthList,
      endMonthInternalList: valMonthList,
      startMonthFeesList: valMonthList,
      endMonthFeesList: valMonthList,
      startMonthSalaryList: valMonthList,
      endMonthSalaryList: valMonthList,
      monthList: valMonthList,
      cashBookData: {},
      internalData: {},
      feesData: {},
      salaryData: {},
      dataSearchCashBook: {
        year: "",
        type: "month",
        month: "",
        dateList: [],
      },
      dataSearchInternal: {
        year: "",
        startMonth: "",
        endMonth: "",
      },
      dataSearchFees: {
        year: "",
        startMonth: "",
        endMonth: "",
      },
      dataSearchSalary: {
        year: "",
        startMonth: "",
        endMonth: "",
      },
    };
  },
  methods: {
    checkLoadApi() {
      this.showSpinner = !(
        this.status1 &&
        this.status2 &&
        this.status3 &&
        this.status4
      );
    },
    changeMonthInternalMethod() {
      this.startMonthInternalList = this.monthList.filter(
        (x) => x.key <= this.dataSearchInternal.endMonth
      );
      this.endMonthInternalList = this.monthList.filter(
        (x) => x.key >= this.dataSearchInternal.startMonth
      );
      this.searchStatisticalInternalMethod();
    },
    changeMonthFeesMethod() {
      this.startMonthFeesList = this.monthList.filter(
        (x) => x.key <= this.dataSearchFees.endMonth
      );
      this.endMonthFeesList = this.monthList.filter(
        (x) => x.key >= this.dataSearchFees.startMonth
      );
      this.searchStatisticalFeesMethod();
    },
    changeMonthSalaryMethod() {
      this.startMonthSalaryList = this.monthList.filter(
        (x) => x.key <= this.dataSearchSalary.endMonth
      );
      this.endMonthSalaryList = this.monthList.filter(
        (x) => x.key >= this.dataSearchSalary.startMonth
      );
      this.searchStatisticalSalaryMethod();
    },
    changeDateCashBookMethod() {
      if (this.dataSearchCashBook.dateList == null) {
        this.dataSearchCashBook.dateList = "";
      }
      this.searchCashBookStatisticalMethod();
    },
    searchCashBookStatisticalMethod() {
      FinanceStatisticalService.searchCashBookStatistical(
        this.moment(this.dataSearchCashBook.year).year(),
        this.dataSearchCashBook.type,
        this.dataSearchCashBook.month,
        this.dataSearchCashBook.dateList
      )
        .then((resp) => {
          this.cashBookData = resp.data.data;
          this.status1 = true;
          this.checkLoadApi();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.cashBookData = {};
        });
    },
    searchStatisticalInternalMethod() {
      FinanceStatisticalService.searchStatisticalInternal(
        this.moment(this.dataSearchInternal.year).year(),
        this.dataSearchInternal.startMonth,
        this.dataSearchInternal.endMonth
      )
        .then((resp) => {
          this.internalData = resp.data.data;
          this.status4 = true;
          this.checkLoadApi();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.internalData = {};
        });
    },
    searchStatisticalFeesMethod() {
      FinanceStatisticalService.searchStatisticalFees(
        this.moment(this.dataSearchFees.year).year(),
        this.dataSearchFees.startMonth,
        this.dataSearchFees.endMonth
      )
        .then((resp) => {
          this.feesData = resp.data.data;
          this.status2 = true;
          this.checkLoadApi();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.feesData = {};
        });
    },
    searchStatisticalSalaryMethod() {
      FinanceStatisticalService.searchStatisticalSalary(
        this.moment(this.dataSearchSalary.year).year(),
        this.dataSearchSalary.startMonth,
        this.dataSearchSalary.endMonth
      )
        .then((resp) => {
          this.salaryData = resp.data.data;
          this.status3 = true;
          this.checkLoadApi();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.salaryData = {};
        });
    },
  },
  beforeMount() {
    let nowYear = this.moment().format("YYYY-MM-DD");
    this.dataSearchCashBook.year = nowYear;

    this.dataSearchInternal.year = nowYear;
    this.dataSearchInternal.startMonth = "01";
    this.dataSearchInternal.endMonth = "12";

    this.dataSearchFees.year = nowYear;
    this.dataSearchFees.startMonth = "01";
    this.dataSearchFees.endMonth = "12";

    this.dataSearchSalary.year = nowYear;
    this.dataSearchSalary.startMonth = "01";
    this.dataSearchSalary.endMonth = "12";

    this.searchCashBookStatisticalMethod();
    this.searchStatisticalInternalMethod();
    this.searchStatisticalFeesMethod();
    this.searchStatisticalSalaryMethod();
  },
};
</script>
<style lang="scss" scoped>
.header-row {
  background: #dcdfe6;
  padding: 5px;
}
.title-text {
  display: inline-block;
  width: 256px;
  margin-left: 3px;
  font-weight: bold;
}
.el-row {
  //   margin-bottom: 30px;
  font-size: 16px;
  //   margin-left: 0px !important;
  //   margin-right: 0px !important;
}
.el-col {
  padding: 9px 5px;
}
.row-header {
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
}

.row11 {
  background: #cad8c4;
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
}
.row1-background {
  background: #67c23a;
}
.row2-background {
  background: #e6a23c;
}
.row3-background {
  background: #409eff;
}
.row4-background {
  background: #23b962;
}
.align-row {
  margin-left: 16.6667%;
}
</style>
