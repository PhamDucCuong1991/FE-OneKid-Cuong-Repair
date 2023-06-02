<template>
  <el-dialog
    :title="'Thông kê tổng hợp khoản thu - chi: ' + classNameData"
    :visible.sync="dialogVisible"
    width="1150px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div style="margin: 0 5px">
      <div>
        <el-row>
          <!-- <el-col :span="4" style="padding: 10px 10px"
            ><div>Khoản thu</div></el-col
          > -->
          <el-col :span="8" class="row-header row1-background"
            ><div>( 1 ) Tổng thu</div></el-col
          >
          <el-col :span="8" class="row-header row1-background"
            ><div>( 2 ) Tổng chi</div></el-col
          >
          <el-col :span="8" class="row-header row1-background"
            ><div>( 1 ) - ( 2 )</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8" class="row11 align-row">
            <div v-if="totalIn == 0">0</div>
            <div>{{ totalIn | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalOut == 0">0</div>
            <div>{{ totalOut | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalIn - totalOut == 0">0</div>
            <div>{{ (totalIn - totalOut) | formatCurrency }}</div>
          </el-col>
        </el-row>
      </div>
      <br />
      <div>
        <el-row>
          <!-- <el-col :span="4" style="padding: 10px 10px"
            ><div>Khoản chi</div></el-col
          > -->
          <el-col :span="8" class="row-header row2-background"
            ><div>( 3 ) Đã thu</div></el-col
          >
          <el-col :span="8" class="row-header row2-background"
            ><div>( 4 ) Đã chi</div></el-col
          >
          <el-col :span="8" class="row-header row2-background"
            ><div>( 3 ) - ( 4 )</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8" class="row11 align-row">
            <div v-if="totalPaidIn == 0">0</div>
            <div>{{ totalPaidIn | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalPaidOut == 0">0</div>
            <div>{{ totalPaidOut | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalPaidIn - totalPaidOut == 0">0</div>
            <div>{{ (totalPaidIn - totalPaidOut) | formatCurrency }}</div>
          </el-col>
        </el-row>
      </div>
      <br />
      <div>
        <el-row>
          <!-- <el-col :span="4" style="padding: 10px 10px"
            ><div>Tổng hợp</div></el-col
          > -->
          <el-col :span="8" class="row-header row3-background"
            ><div>( 5 ) Thu thiếu</div></el-col
          >
          <el-col :span="8" class="row-header row3-background"
            ><div>( 6 ) Chi thiếu</div></el-col
          >
          <el-col :span="8" class="row-header row3-background"
            ><div>( 5 ) - ( 6 )</div></el-col
          >
        </el-row>
        <el-row>
          <el-col :span="8" class="row11 align-row">
            <div v-if="totalIn - totalPaidIn == 0">0</div>
            <div>{{ (totalIn - totalPaidIn) | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalOut - totalPaidOut == 0">0</div>
            <div>{{ (totalOut - totalPaidOut) | formatCurrency }}</div>
          </el-col>
          <el-col :span="8" class="row11">
            <div v-if="totalIn - totalPaidIn - (totalOut - totalPaidOut) == 0">
              0
            </div>
            <div>
              {{
                (totalIn - totalPaidIn - (totalOut - totalPaidOut))
                  | formatCurrency
              }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    dialogVisible: null,
    dataList: null,
    classNameData: null,
  },

  data() {
    return {};
  },
  computed: {
    totalIn() {
      return this.loda.sumBy(
        this.dataList.filter((x) => x.orderKids != null),
        (x) => x.orderKids.moneyTotalIn
      );
    },
    totalOut() {
      return this.loda.sumBy(
        this.dataList.filter((x) => x.orderKids != null),
        (x) => x.orderKids.moneyTotalOut
      );
    },
    totalPaidIn() {
      return this.loda.sumBy(
        this.dataList.filter((x) => x.orderKids != null),
        (x) => x.orderKids.moneyPaidIn
      );
    },
    totalPaidOut() {
      return this.loda.sumBy(
        this.dataList.filter((x) => x.orderKids != null),
        (x) => x.orderKids.moneyPaidOut
      );
    },
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
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
.row-header {
  padding: 10px 0;
  //   margin-right: 1px;
  border-right: 1px solid white;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
}

.row11 {
  background: #cad8c4;
  padding: 10px 0;
  //   margin-right: 1px;
  border-right: 1px solid white;
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
// .align-row {
//   //   margin-left: 188px;
// }
</style>
