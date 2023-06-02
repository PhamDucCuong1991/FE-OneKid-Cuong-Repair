<template>
  <el-dialog
    :title="
      'Chọn khoản để xóa cho học sinh tháng ' +
      this.moment(this.monthDelete).format('MM/yyyy')
    "
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-table
      ref="multipleTable"
      highlight-current-row
      :empty-text="textTable"
      :data="responseList"
      :cell-style="tableRowStyle"
      :header-cell-style="$funcCommon.tableHeaderColorFunction"
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
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
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
      dataInput: {
        gradeName: "",
        gradeDescription: "",
      },
      monthDelete: "",
      responseList: [],
      checkAll: false,
      loadingButton: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseList = [];
        this.idKidList = [];
        this.checkAll = false;
      }, 300);
    },
    checkUseAllMethod() {
      this.responseList.forEach((x) => {
        x.used = this.checkAll;
      });
    },
    submitForm() {
      let idKidList = this.$parent.multipleSelectionKids.map((x) => x.id);
      let idPackageList = this.responseList.filter((x) => x.used).map((x) => x.id);
      let date = this.$parent.dataSearch.date;
      this.loadingButton = true;
      FnFeesService.deletePackageKidsManyKids(idKidList, idPackageList, date)
        .then((resp) => {
          this.$message({
            message:
              resp.data.data == 0
                ? "Không có khoản nào được xóa"
                : "Có " + resp.data.data + " khoản được xóa",
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
          this.loadingButton = false;
        });
    },
    getInitialDataDelete() {
      this.monthDelete = this.$parent.dataSearch.date;
      FnFeesService.searchPackage("", "", "")
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
</style>
