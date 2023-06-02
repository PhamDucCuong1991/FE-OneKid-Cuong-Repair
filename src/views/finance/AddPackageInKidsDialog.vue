<template>
  <el-dialog
    title="Thêm khoản khác cho các học sinh"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-table
      ref="multipleTable"
      highlight-current-row
      :empty-text="textTable"
      :data="responseList"
      :cell-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="Tên khoản" min-width="200"></el-table-column>
      <el-table-column label="Kiểu đóng" align="center" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'single'">Một lần</span>
          <span v-else-if="scope.row.type == 'multiple'">Nhiều lần</span>
        </template>
      </el-table-column>
      <el-table-column label="Loại" align="center" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.category == 'in'">Thu</span>
          <span v-else-if="scope.row.category == 'out'">Chi</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" align="right" label="Đơn giá" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.price == 0">0</span>
          <span v-else>{{ scope.row.price | formatCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" align="center" label="Giảm giá" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.discount">Có</span>
          <span v-else>Không</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="discountPrice"
        align="right"
        label="Đơn giá sau giảm"
        width="130"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.discount">
            <span v-if="scope.row.discountPrice == 0">0</span>
            <span v-else>{{ scope.row.discountPrice | formatCurrency }}</span></span
          >
          <span v-else>
            <span v-if="scope.row.price == 0">0</span>
            <span v-else>{{ scope.row.price | formatCurrency }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="description" min-width="150" label="Mô tả"></el-table-column>
      <el-table-column fixed="right" width="100" align="center">
        <template slot="header" slot-scope="scope">
          <div>Áp dụng</div>
          <el-checkbox
            @change="checkUseAllMethod(scope.$index)"
            v-model="checkAll"
          ></el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.used"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
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
      textTable: this.$tableLoadding,
      idClass: "",
      className: "",
      responseList: [],
      loadingButton: false,
      checkAll: false,
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
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseList = [];
        this.checkAll = false;
      }, 300);
    },
    checkUseAllMethod() {
      this.responseList.forEach((x) => {
        x.used = this.checkAll;
      });
    },
    submitForm() {
      let dataInput = {
        idKidList: this.$parent.multipleSelectionKids.map((x) => x.id),
        idPackageList: this.responseList.filter((x) => x.used).map((x) => x.id),
        date: this.$parent.dataSearch.date,
      };
      this.loadingButton = true;
      FnFeesService.createPackageForAddNotInClass(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: resp.data.data == 0 ? "warning" : "success",
          });
          this.loadingButton = false;
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getAddDataInitial() {
      FnFeesService.getPackageForAddNotInClass(this.$parent.dataSearch.idClass)
        .then((resp) => {
          this.responseList = resp.data.data;
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        })
        .catch((err) => {
          console.log(err);
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
</style>
