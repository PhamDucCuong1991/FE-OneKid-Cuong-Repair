<template>
  <div>
    <el-dialog
      :title="'Thêm khoản cho nhóm: ' + name"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
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
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="Tên khoản" min-width="150"></el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          min-width="150"
        ></el-table-column>
        <el-table-column prop="category" label="Loại" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.category == 'in'">Thu</span>
            <span v-else>Chi</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unit"
          align="center"
          label="Đơn vị"
          width="100"
        ></el-table-column>
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
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FinanceStatisticalService from "@/services/FinanceStatisticalService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: this.$tableEmpty,
      responseList: [],
      loadingButton: false,
      id: "",
      name: "",
      multipleSelection: [],
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
    tableRowStyle({ row }) {
      if (row.category == "out") {
        return "color: #409EFF";
      }
    },
    resetData() {
      this.textTable = this.$tableEmpty;
      this.responseList = [];
      this.dataSearch.name = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkBeforeSubmit() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Chưa có khoản nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    submitForm() {
      this.checkBeforeSubmit();
      this.loadingButton = true;
      let idList = this.multipleSelection.map((x) => x.id);
      FinanceStatisticalService.addPackageForGroup(this.id, idList)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingButton = false;
        });
    },
    getDataInitial(id, name) {
      this.id = id;
      this.name = name;
      FinanceStatisticalService.getPackageForAdd()
        .then((resp) => {
          this.responseList = resp.data.data;
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

<style lang="scss" scoped>
.input-common {
  margin-right: 5px;
}
</style>
