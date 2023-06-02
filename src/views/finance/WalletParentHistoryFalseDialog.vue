<template>
  <el-dialog
    title="Danh sách giao dịch chưa xác nhận"
    :visible.sync="dialogVisible"
    width="1200px"
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
      :max-height="$tableMaxHeightSmall"
      border
    >
      <el-table-column
        type="index"
        fixed
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column width="120" fixed align="center" label="Ngày nạp/rút">
        <template slot-scope="scope">
          <span>{{ scope.row.date | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Người nạp/rút"
        min-width="150"
        prop="name"
      ></el-table-column>
      <el-table-column label="Loại" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.category == 'in'">Nạp tiền</span>
          <span v-if="scope.row.category == 'out'">Rút tiền</span>
        </template>
      </el-table-column>
      <el-table-column label="Đối tượng" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'school'">Nhà trường</span>
          <span v-if="scope.row.type == 'parent'">Phụ huynh</span>
        </template>
      </el-table-column>
      <el-table-column label="Số tiền" align="right" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.money | formatCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.confirm">Đã xác nhận</span>
          <span v-else>Chưa xác nhận</span>
        </template>
      </el-table-column>
      <el-table-column label="Ảnh" align="center" width="90">
        <template slot-scope="scope">
          <el-link
            v-if="!!scope.row.picture"
            :href="scope.row.picture"
            target="blank"
            type="primary"
            style="text-decoration: underline"
            >Xem ảnh</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Mô tả" prop="description" width="150">
      </el-table-column>
      <el-table-column label="Tác vụ" fixed="right" width="170" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="
              !scope.row.confirm &&
              scope.row.type == 'parent' &&
              scope.row.category == 'in'
                ? false
                : true
            "
            type="success"
            size="mini"
            @click="confirmMethod(scope.row)"
            >Xác nhận</el-button
          >
          <el-button
            :disabled="
              (!scope.row.confirm &&
                scope.row.type == 'school' &&
                scope.row.category == 'out') ||
              (!scope.row.confirm &&
                scope.row.type == 'parent' &&
                scope.row.category == 'in')
                ? false
                : true
            "
            type="danger"
            size="mini"
            @click="deleteRowMethod(scope.row)"
            >Xóa</el-button
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
      idWalletParent: "",
      walletBalance: "",
      dataInput: {
        category: "in",
      },
      imageUrl: "",
      responseData: {},
      loadingButton: false,
      dataSearch: {
        idWalletParent: "",
      },
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
        this.resetData();
      }, 300);
    },
    resetData() {
      this.dataSearch.idWalletParent = "";
      this.responseData.dataList = [];
    },
    changeDateMethod() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = "";
      }
      this.searchHeaderMethod();
    },
    confirmMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xác nhận lần nạp tiền này?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.confirmWalletParentHisotry(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    deleteRowMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa lịch sử giao dịch này?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.deleteWalletParentHistoryById(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      FnFeesService.getWalletParentHistoryFalse(this.dataSearch.idWalletParent)
        .then((resp) => {
          this.responseData = resp.data.data;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
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
    getDataHistoryInitial(id) {
      this.dataSearch.idWalletParent = id;
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
.input-common {
  margin-right: 5px;
}
</style>
