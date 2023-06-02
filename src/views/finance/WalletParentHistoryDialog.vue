<template>
  <el-dialog
    title="Lịch sửa nạp/rút ví"
    :visible.sync="dialogVisible"
    width="1200px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div style="margin-bottom: 15px; position: relative; z-index: 1">
      <el-date-picker
        class="input-common"
        style="width: 265px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.dateList"
        type="daterange"
        unlink-panels
        range-separator="-"
        @change="changeDateMethod()"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
      <el-select
        style="width: 130px"
        class="input-common"
        v-model="dataSearch.category"
        clearable
        @change="searchHeaderMethod()"
        placeholder="Chọn loại"
      >
        <el-option value="in" label="Nạp tiền"></el-option>
        <el-option value="out" label="Rút tiền"></el-option>
      </el-select>
      <el-select
        style="width: 130px"
        class="input-common"
        clearable
        v-model="dataSearch.type"
        @change="searchHeaderMethod()"
        placeholder="Chọn loại"
      >
        <el-option value="school" label="Nhà trường"></el-option>
        <el-option value="parent" label="Phụ huynh"></el-option>
      </el-select>
      <el-select
        style="width: 150px"
        class="input-common"
        clearable
        v-model="dataSearch.status"
        @change="searchHeaderMethod()"
        placeholder="Trạng thái"
      >
        <el-option value="false" label="Chưa xác nhận"></el-option>
        <el-option value="true" label="Đã xác nhận"></el-option>
      </el-select>
    </div>
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
      <el-pagination
        style="float: left"
        background
        :current-page="pageNumber"
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
        dateList: [],
        category: "",
        type: "",
        status: "",
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
      this.dataSearch.dateList = [];
      this.dataSearch.category = "";
      this.dataSearch.type = "";
      this.dataSearch.status = "";
      this.responseData.dataList = [];
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
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
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      FnFeesService.getWalletParentHistory(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idWalletParent,
        this.dataSearch.dateList,
        this.dataSearch.category,
        this.dataSearch.type,
        this.dataSearch.status
      )
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
