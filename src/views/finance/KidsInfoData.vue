<template>
  <div>
    <el-dialog
      title="Tìm kiếm học sinh"
      :visible.sync="dialogVisible"
      width="1150px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div style="margin-bottom: 15px; position: relative; z-index: 1">
        <el-input
          style="width: 300px"
          placeholder="Nhập tên học sinh"
          v-model="dataSearch.fullName"
          @keyup.enter.native="searchByProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchByProperties()"
          ></el-button>
        </el-input>
      </div>
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
          prop="fullName"
          label="Họ tên học sinh"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="maClass.className"
          label="Lớp"
          min-width="150"
        ></el-table-column>
        <el-table-column label="Ngày sinh" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template></el-table-column
        >
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="orderKidsAllMethod(scope.row)"
              >Xem hóa đơn</el-button
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
    <OrderKidsAllDialog
      :dialogVisible="showOrderKidsAllDialog"
      @dialog-close="closeOrderKidsAllDialog()"
      ref="OrderKidsAllDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import OrderKidsAllDialog from "./OrderKidsAllDialog.vue";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    OrderKidsAllDialog,
  },
  data() {
    return {
      textTable: this.$tableEmpty,
      responseList: [],
      loadingButton: false,
      showOrderKidsAllDialog: false,
      dataSearch: {
        fullName: "",
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
        this.resetData();
      }, 300);
    },
    resetData() {
      this.textTable = this.$tableEmpty;
      this.responseList = [];
      this.dataSearch.fullName = "";
    },
    closeOrderKidsAllDialog() {
      this.showOrderKidsAllDialog = false;
    },
    orderKidsAllMethod(row) {
      this.showOrderKidsAllDialog = true;
      this.$refs.OrderKidsAllDialog.getOrderKidsAllInitial(row);
    },
    searchByProperties() {
      if (this.dataSearch.fullName == "") {
        this.$message({
          message: "Nhập tên học sinh",
          type: "error",
        });
        throw null;
      }
      this.textTable = this.$tableLoadding;
      FnFeesService.findKidsByName(this.dataSearch.fullName)
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseList = [];
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.input-common {
  margin-right: 5px;
}
</style>
