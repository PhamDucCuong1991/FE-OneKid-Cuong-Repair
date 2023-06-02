<template>
  <div>
    <el-dialog
      title="Thống kê ví"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div
        style="
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
          display: inline-block;
        "
      >
        <el-select
          class="input-common"
          style="width: 160px"
          v-model="dataSearch.type"
          @change="searchHeaderMethod()"
          placeholder="Chọn loại"
          clearable
        >
          <el-option value="positive" label="Số dư lớn hơn 0"></el-option>
          <el-option value="zero" label="Số dư bằng 0"></el-option>
        </el-select>
        <el-input
          class="input-common"
          style="width: 220px"
          placeholder="Nhập mã ví"
          clearable
          v-model="dataSearch.code"
          @clear="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>

        <el-input
          style="width: 300px"
          placeholder="Nhập tên học sinh"
          clearable
          v-model="dataSearch.kidName"
          @clear="searchHeaderMethod()"
          @keyup.enter.native="searchHeaderMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchHeaderMethod()"
          ></el-button>
        </el-input>
      </div>
      <el-row>
        <el-col
          :span="8"
          style="
            background: #67c23a;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          "
        >
          Tổng tiền nạp:
          <span>
            <span v-if="responseData.moneyInTotal == 0">0</span>
            <span v-else>
              {{ responseData.moneyInTotal | formatCurrency }}</span
            >
          </span>
        </el-col>
        <el-col :span="8" style="background: #f56c6c">
          Tổng tiền rút:
          <span>
            <span v-if="responseData.moneyOutTotal == 0">0</span>
            <span v-else>
              {{ responseData.moneyOutTotal | formatCurrency }}</span
            >
          </span>
        </el-col>
        <el-col
          :span="8"
          style="
            background: #409eff;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          "
        >
          Tổng nạp - Tổng rút:
          <span>
            <span
              v-if="responseData.moneyInTotal - responseData.moneyOutTotal == 0"
              >0</span
            >
            <span v-else>
              {{
                (responseData.moneyInTotal - responseData.moneyOutTotal)
                  | formatCurrency
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
        <el-table-column
          type="index"
          fixed
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column width="130" align="center" prop="code" label="Mã ví">
        </el-table-column>
        <el-table-column
          label="Tên phụ huynh"
          min-width="170"
          prop="parentName"
        ></el-table-column>
        <el-table-column label="Tên học sinh" min-width="170">
          <template slot-scope="scope">
            <span v-for="item in scope.row.kidsNameList" :key="item"
              >{{ item }}<br />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền nạp" align="right" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyIn == 0">0</span>
            <span v-else>{{ scope.row.moneyIn | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tiền rút" align="right" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyOut == 0">0</span>
            <span v-else>{{ scope.row.moneyOut | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Số dư" align="right" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.moneyIn - scope.row.moneyOut == 0">0</span>
            <span v-else>{{
              (scope.row.moneyIn - scope.row.moneyOut) | formatCurrency
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-pagination
          style="float: left"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="$pageListDefaultNew"
          :page-size="maxPageItem"
          :layout="$pageLayoutDefault"
          :total="pageTotal"
        ></el-pagination>
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      idOrder: "",
      orderCode: "",
      responseData: {},
      loadingButton: false,
      dataSearch: {
        code: "",
        type: "",
        kidName: "",
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseData.dataList = [];
        this.dataSearch.code = "";
        this.dataSearch.type = "";
        this.dataSearch.kidName = "";
      }, 300);
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.walletParentStatisticalInitial();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.walletParentStatisticalInitial();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.walletParentStatisticalInitial();
    },
    walletParentStatisticalInitial() {
      this.textTable = this.$tableLoadding;
      FnFeesService.statisticalWalletParent(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.code,
        this.dataSearch.type,
        this.dataSearch.kidName
      )
        .then((resp) => {
          this.responseData = resp.data.data;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          this.pageTotal = 1;
          this.responseData.dataList = [];
        })
        .finally(() => {
          if (this.responseData.dataList.length == 0) {
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
