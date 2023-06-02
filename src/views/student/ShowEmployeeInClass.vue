<template>
  <el-dialog
    title="Danh sách nhân sự"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      highlight-current-row
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChange"
      :max-height="$tableMaxHeight"
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="fullName" label="Nhân viên"></el-table-column>
      <el-table-column
        prop="employeeStatus"
        label="Trạng thái"
        align="center"
      ></el-table-column>
      <el-table-column label="Số điện thoại" width="150" prop="phone" align="center">
      </el-table-column>
      <el-table-column width="300" label="Đối tượng">
        <template slot-scope="scope">
          <span v-for="item in scope.row.accountTypeList" :key="item.id"
            >- {{ item.name }}<br />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import MaClassService from "@/services/MaClassService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.tableData = [];
      this.$emit("dialog-close");
    },
    getDetailInitial(id) {
      console.log(id);
      MaClassService.findEmployeeInClass(id)
        .then((resp) => {
          this.tableData = resp.data.data;
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
</style>
